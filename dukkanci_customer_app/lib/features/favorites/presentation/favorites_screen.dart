import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
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
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, _) => const Center(child: Text(AppStrings.somethingWentWrong)),
        data: (stores) {
          if (stores.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text('لم تُضِف أي متجر إلى المفضلة بعد', textAlign: TextAlign.center),
              ),
            );
          }
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
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
