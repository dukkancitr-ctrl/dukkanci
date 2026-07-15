import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../stores/domain/store.dart';

/// Every field here is real store data — never a placeholder rating or ETA
/// (spec section 10: "ممنوع عرض وقت توصيل أو تقييم غير حقيقي").
class StoreCard extends StatelessWidget {
  const StoreCard({super.key, required this.store, required this.onTap});

  final Store store;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (store.displayImage != null)
                    CachedNetworkImage(
                      imageUrl: store.displayImage!,
                      fit: BoxFit.cover,
                      errorWidget: (_, _, _) => Container(color: AppColors.creamDark),
                    )
                  else
                    Container(color: AppColors.creamDark),
                  if (!store.open)
                    Container(
                      color: Colors.black.withValues(alpha: 0.45),
                      alignment: Alignment.center,
                      child: const Text(
                        AppStrings.storeClosedNow,
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(store.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text(store.category, style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      if (store.rating > 0) ...[
                        const Icon(Icons.star_rounded, size: 16, color: AppColors.orange),
                        const SizedBox(width: 2),
                        Text(store.rating.toStringAsFixed(1), style: const TextStyle(fontWeight: FontWeight.w600)),
                        if (store.reviews > 0) Text(' (${store.reviews})', style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                        const SizedBox(width: 10),
                      ],
                      if (store.etaMinutes != null) ...[
                        const Icon(Icons.access_time_rounded, size: 15, color: AppColors.muted),
                        const SizedBox(width: 2),
                        Text('~${store.etaMinutes} د', style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
