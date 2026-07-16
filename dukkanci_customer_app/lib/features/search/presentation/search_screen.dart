import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/distance.dart';
import '../../../core/widgets/state_views.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../location/application/location_controller.dart';
import '../../stores/domain/store.dart';

enum _Filter { openNow, nearest, topRated, offers }

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _controller = TextEditingController();
  Timer? _debounce;
  List<Store>? _allStores;
  bool _loading = false;
  String _query = '';
  final _activeFilters = <_Filter>{};

  static const _filterMeta = {
    _Filter.openNow: ('مفتوح الآن', Icons.access_time_filled_rounded),
    _Filter.nearest: ('الأقرب', Icons.near_me_rounded),
    _Filter.topRated: ('الأعلى تقييماً', Icons.star_rounded),
    _Filter.offers: ('عروض وخصومات', Icons.local_offer_rounded),
  };

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    setState(() => _loading = true);
    try {
      final stores = await ref.read(storeRepositoryProvider).fetchApprovedStores();
      if (mounted) setState(() => _allStores = stores);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _onChanged(String query) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () => setState(() => _query = query.trim()));
  }

  String _normalizeArabic(String input) => input
      .replaceAll(RegExp('[أإآا]'), 'ا')
      .replaceAll('ة', 'ه')
      .replaceAll('ى', 'ي')
      .toLowerCase();

  List<Store> get _filtered {
    if (_allStores == null) return [];
    var list = List<Store>.from(_allStores!);

    if (_query.isNotEmpty) {
      final normalizedQuery = _normalizeArabic(_query);
      list = list.where((s) => _normalizeArabic(s.name).contains(normalizedQuery) || _normalizeArabic(s.category).contains(normalizedQuery)).toList();
    }
    if (_activeFilters.contains(_Filter.openNow)) list = list.where((s) => s.open).toList();
    if (_activeFilters.contains(_Filter.offers)) list = list.where((s) => s.hasOffer).toList();

    final location = ref.read(locationControllerProvider);
    if (_activeFilters.contains(_Filter.nearest) && location != null) {
      list.sort((a, b) {
        final da = (a.lat != null && a.lng != null) ? haversineKm(location.lat, location.lng, a.lat!, a.lng!) : double.infinity;
        final db = (b.lat != null && b.lng != null) ? haversineKm(location.lat, location.lng, b.lat!, b.lng!) : double.infinity;
        return da.compareTo(db);
      });
    } else if (_activeFilters.contains(_Filter.topRated)) {
      list.sort((a, b) => b.rating.compareTo(a.rating));
    }
    return list;
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasLocation = ref.watch(locationControllerProvider) != null;
    final results = _filtered;
    final showingAll = _query.isEmpty && _activeFilters.isEmpty;

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          autofocus: false,
          textInputAction: TextInputAction.search,
          decoration: const InputDecoration(
            hintText: 'ابحث عن متجر...',
            prefixIcon: Icon(Icons.search_rounded),
            filled: false,
            border: InputBorder.none,
          ),
          onChanged: _onChanged,
        ),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
              itemCount: _Filter.values.length,
              separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.sm),
              itemBuilder: (context, i) {
                final f = _Filter.values[i];
                final (label, icon) = _filterMeta[f]!;
                final selected = _activeFilters.contains(f);
                final disabled = f == _Filter.nearest && !hasLocation;
                return FilterChip(
                  avatar: Icon(icon, size: 16, color: selected ? Colors.white : AppColors.muted),
                  label: Text(label),
                  selected: selected,
                  onSelected: disabled
                      ? null
                      : (v) => setState(() {
                            if (v) {
                              _activeFilters.add(f);
                              if (f == _Filter.nearest) _activeFilters.remove(_Filter.topRated);
                              if (f == _Filter.topRated) _activeFilters.remove(_Filter.nearest);
                            } else {
                              _activeFilters.remove(f);
                            }
                          }),
                );
              },
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: _loading
                ? const AppLoadingView()
                : results.isEmpty
                    ? AppEmptyView(message: showingAll ? 'لا توجد متاجر بعد' : AppStrings.noResults, icon: Icons.search_off_rounded)
                    : GridView.builder(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisSpacing: AppSpacing.md,
                          crossAxisSpacing: AppSpacing.md,
                          childAspectRatio: 0.72,
                        ),
                        itemCount: results.length,
                        itemBuilder: (context, i) {
                          final store = results[i];
                          return StoreCard(
                            store: store,
                            onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
