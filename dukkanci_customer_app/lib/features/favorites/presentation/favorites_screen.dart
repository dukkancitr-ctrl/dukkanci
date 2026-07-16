import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/state_views.dart';
import '../../home/presentation/widgets/store_card.dart';
import '../../stores/domain/store.dart';
import '../application/favorites_controller.dart';

final _favoriteStoresProvider = FutureProvider.autoDispose<List<Store>>((ref) async {
  final ids = ref.watch(favoritesControllerProvider);
  if (ids.isEmpty) return [];
  final all = await ref.read(storeRepositoryProvider).fetchApprovedStores();
  return all.where((s) => ids.contains(s.id)).toList();
});

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(_favoriteStoresProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navFavorites)),
      body: storesAsync.when(
        loading: () => const AppLoadingView(),
        error: (_, _) => AppErrorView(onRetry: () => ref.invalidate(_favoriteStoresProvider)),
        data: (stores) {
          if (stores.isEmpty) {
            return const AppEmptyView(message: 'لم تُضِف أي متجر إلى المفضلة بعد', icon: Icons.favorite_border_rounded);
          }
          return GridView.builder(
            padding: const EdgeInsets.all(AppSpacing.lg),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: AppSpacing.md,
              crossAxisSpacing: AppSpacing.md,
              childAspectRatio: 0.72,
            ),
            itemCount: stores.length,
            itemBuilder: (context, i) {
              final store = stores[i];
              return StoreCard(
                store: store,
                onTap: () => context.push(AppRoutes.storeDetailPath(store.slug ?? store.id.toString())),
              );
            },
          );
        },
      ),
    );
  }
}
