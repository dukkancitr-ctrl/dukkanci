import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../stores/domain/store.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _controller = TextEditingController();
  Timer? _debounce;
  List<Store>? _results;
  bool _loading = false;

  // Spec section 26 filters. Wired to storeRepository once the backend
  // exposes the corresponding delivery-zone / rating fields end-to-end;
  // kept here as selectable chips so the UI shape is ready.
  final _filters = ['مفتوح الآن', 'الأقرب', 'الأعلى تقييماً', 'عروض وخصومات'];
  final _activeFilters = <String>{};

  void _onChanged(String query) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 350), () => _search(query));
  }

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() => _results = null);
      return;
    }
    setState(() => _loading = true);
    try {
      final results = await ref.read(storeRepositoryProvider).searchStores(query);
      if (mounted) setState(() => _results = results);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          autofocus: false,
          textInputAction: TextInputAction.search,
          decoration: const InputDecoration(
            hintText: 'ابحث عن متجر أو منتج...',
            prefixIcon: Icon(Icons.search_rounded),
            filled: false,
            border: InputBorder.none,
          ),
          onChanged: _onChanged,
          onSubmitted: _search,
        ),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: _filters.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final f = _filters[i];
                final selected = _activeFilters.contains(f);
                return FilterChip(
                  label: Text(f),
                  selected: selected,
                  onSelected: (v) => setState(() => v ? _activeFilters.add(f) : _activeFilters.remove(f)),
                );
              },
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _results == null
                    ? const Center(child: Text('ابحث عن متجر أو منتج للبدء'))
                    : _results!.isEmpty
                        ? const Center(child: Text(AppStrings.noResults))
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _results!.length,
                            itemBuilder: (context, i) {
                              final store = _results![i];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: SizedBox(
                                  height: 220,
                                  child: StoreCard(
                                    store: store,
                                    onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
                                  ),
                                ),
                              );
                            },
                          ),
          ),
        ],
      ),
    );
  }
}
