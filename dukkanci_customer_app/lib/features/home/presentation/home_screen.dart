import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../stores/domain/store.dart';
import 'widgets/store_card.dart';

final _homeStoresProvider = FutureProvider.autoDispose<List<Store>>((ref) {
  return ref.read(storeRepositoryProvider).fetchApprovedStores();
});

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storesAsync = ref.watch(_homeStoresProvider);
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.appName), centerTitle: false),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(_homeStoresProvider),
        child: storesAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => ListView(
            children: [
              const SizedBox(height: 120),
              const Icon(Icons.wifi_off_rounded, size: 48),
              const SizedBox(height: 12),
              Center(child: Text(AppStrings.somethingWentWrong)),
              const SizedBox(height: 12),
              Center(
                child: OutlinedButton(
                  onPressed: () => ref.invalidate(_homeStoresProvider),
                  child: const Text(AppStrings.retry),
                ),
              ),
            ],
          ),
          data: (stores) {
            if (stores.isEmpty) {
              return ListView(
                children: const [
                  SizedBox(height: 160),
                  Center(child: Text(AppStrings.noResults)),
                ],
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
      ),
    );
  }
}
