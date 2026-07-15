import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../products/domain/product.dart';
import '../domain/store.dart';

final storeByKeyProvider = FutureProvider.autoDispose.family<Store?, String>((ref, slugOrId) {
  return ref.read(storeRepositoryProvider).fetchStoreBySlugOrId(slugOrId);
});

final storeProductsProvider = FutureProvider.autoDispose.family<List<Product>, int>((ref, storeId) {
  return ref.read(storeRepositoryProvider).fetchProductsForStore(storeId);
});

/// Spec section 12. Product list is grouped by category but does not yet
/// implement the sticky jump-to-section shelf described there — that's a
/// straightforward follow-up (CustomScrollView + section keys) once this
/// base screen is reviewed; kept as a flat grouped list for this first pass.
class StoreScreen extends ConsumerWidget {
  const StoreScreen({super.key, required this.slugOrId});

  final String slugOrId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storeAsync = ref.watch(storeByKeyProvider(slugOrId));
    return Scaffold(
      body: storeAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, _) => const Center(child: Text(AppStrings.somethingWentWrong)),
        data: (store) {
          if (store == null) {
            return const Center(child: Text('هذا المتجر غير متاح'));
          }
          return _StoreBody(store: store);
        },
      ),
    );
  }
}

class _StoreBody extends ConsumerWidget {
  const _StoreBody({required this.store});

  final Store store;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(storeProductsProvider(store.id));
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            title: Text(store.name),
            background: store.displayImage != null
                ? CachedNetworkImage(imageUrl: store.displayImage!, fit: BoxFit.cover)
                : Container(color: AppColors.creamDark),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Chip(label: Text(store.open ? AppStrings.storeOpenNow : AppStrings.storeClosedNow)),
                    const SizedBox(width: 8),
                    if (store.rating > 0) Chip(avatar: const Icon(Icons.star_rounded, size: 16), label: Text(store.rating.toStringAsFixed(1))),
                  ],
                ),
                const SizedBox(height: 10),
                if (store.description != null) Text(store.description!),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 16,
                  runSpacing: 6,
                  children: [
                    if (store.minOrder != null) Text('${AppStrings.minOrder}: ${store.minOrder!.toStringAsFixed(0)} ${AppStrings.currencySuffix}'),
                    if (store.deliveryFeePerKm != null) Text('${AppStrings.deliveryFee}: ${store.deliveryFeePerKm!.toStringAsFixed(0)} ${AppStrings.currencySuffix}/كم'),
                    if (store.hours != null) Text(store.hours!),
                  ],
                ),
              ],
            ),
          ),
        ),
        productsAsync.when(
          loading: () => const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.all(40), child: Center(child: CircularProgressIndicator()))),
          error: (_, _) => const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.all(40), child: Center(child: Text(AppStrings.somethingWentWrong)))),
          data: (products) {
            if (products.isEmpty) {
              return const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.all(40), child: Center(child: Text(AppStrings.noResults))));
            }
            final byCategory = <String, List<Product>>{};
            for (final p in products) {
              byCategory.putIfAbsent(p.category ?? 'أخرى', () => []).add(p);
            }
            return SliverList(
              delegate: SliverChildListDelegate([
                for (final entry in byCategory.entries) ...[
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
                    child: Text(entry.key, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                  ),
                  for (final product in entry.value)
                    ListTile(
                      leading: SizedBox(
                        width: 56,
                        height: 56,
                        child: product.image != null
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: CachedNetworkImage(imageUrl: product.image!, fit: BoxFit.cover),
                              )
                            : Container(decoration: BoxDecoration(color: AppColors.creamDark, borderRadius: BorderRadius.circular(10))),
                      ),
                      title: Text(product.name),
                      subtitle: Text(
                        product.priceOnRequest ? 'السعر عند الطلب' : '${product.price.toStringAsFixed(0)} ${AppStrings.currencySuffix}',
                      ),
                      enabled: product.available,
                      onTap: () => context.push(AppRoutes.productDetailPath(store.slug ?? store.id.toString(), product.id.toString())),
                    ),
                ],
              ]),
            );
          },
        ),
      ],
    );
  }
}
