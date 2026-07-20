import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../../../core/widgets/shimmer_box.dart';
import '../../../core/widgets/state_views.dart';
import '../../cart/application/cart_controller.dart' show localCacheProvider;
import '../application/notifications_controller.dart';
import '../domain/app_notification.dart';

/// صندوق الإشعارات.
///
/// يتبع نفس لغة التصميم المعتمدة في بقية التطبيق: بطاقات، [PressScale] لكل
/// عنصر قابل للنقر، هياكل [ShimmerBox] أثناء التحميل بدل سبينر، و
/// [AppEmptyView]/[AppErrorView] للحالتين الفارغة والفاشلة (قسم 33 من
/// المواصفات: حالة مصمَّمة لكل شاشة، لا `Text()` عارية).
class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  /// يُقرأ من الذاكرة المحلية مرة عند الفتح — SharedPreferences متزامن هنا
  /// فلا حاجة لحالة غير متزامنة لمفتاح واحد.
  late bool _enabled = ref.read(localCacheProvider).notificationsEnabled;

  Future<void> _toggle(bool value) async {
    setState(() => _enabled = value);
    await ref.read(notificationsControllerProvider.notifier).setNotificationsEnabled(value);
  }

  /// النقر: يعلّم كمقروء (تفاؤلياً) ثم ينتقل — إن كانت الوجهة معروفة.
  ///
  /// وجهة غير معروفة (رابط من حملة أحدث من نسخة التطبيق) **لا تفعل شيئاً**
  /// بدل أن ترمي أو تنقل لشاشة خطأ؛ التعليم كمقروء يحدث في الحالتين لأن
  /// المستخدم رآه فعلاً.
  void _open(AppNotification item) {
    ref.read(notificationsControllerProvider.notifier).markRead(item.id);
    final route = resolveNotificationRoute(item.deepLink);
    if (route != null) context.push(route);
  }

  @override
  Widget build(BuildContext context) {
    final inboxAsync = ref.watch(notificationsControllerProvider);
    final unread = inboxAsync.value?.unread ?? 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.notificationsTitle),
        actions: [
          if (unread > 0)
            TextButton(
              onPressed: () => ref.read(notificationsControllerProvider.notifier).markAllRead(),
              child: const Text(AppStrings.notificationsMarkAllRead, style: AppTextStyles.label),
            ),
        ],
      ),
      body: Column(
        children: [
          _NotificationsPrefCard(enabled: _enabled, onChanged: _toggle),
          Expanded(
            child: RefreshIndicator(
              color: AppColors.green800,
              onRefresh: () => ref.read(notificationsControllerProvider.notifier).refresh(),
              child: inboxAsync.when(
                loading: () => const _NotificationsSkeleton(),
                // القوائم مغلَّفة بـListView حتى في الحالتين الفارغة والفاشلة
                // كي يبقى السحب-للتحديث ممكناً (طفل غير قابل للتمرير يعطّل
                // RefreshIndicator بصمت).
                error: (_, _) => _Scrollable(
                  child: AppErrorView(
                    message: AppStrings.notificationsFailed,
                    onRetry: () => ref.invalidate(notificationsControllerProvider),
                  ),
                ),
                data: (inbox) {
                  if (inbox.isEmpty) {
                    return const _Scrollable(
                      child: AppEmptyView(
                        message: '${AppStrings.notificationsEmptyTitle}\n${AppStrings.notificationsEmptyBody}',
                        icon: Icons.notifications_none_rounded,
                      ),
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.xxl),
                    physics: const AlwaysScrollableScrollPhysics(),
                    itemCount: inbox.items.length,
                    separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
                    itemBuilder: (context, i) => _NotificationCard(
                      item: inbox.items[i],
                      onTap: () => _open(inbox.items[i]),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// يجعل محتوىً غير قابل للتمرير قابلاً للسحب-للتحديث.
class _Scrollable extends StatelessWidget {
  const _Scrollable({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) => ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [SizedBox(height: constraints.maxHeight, child: child)],
      ),
    );
  }
}

/// مفتاح تفعيل الإشعارات — الواجهة الوحيدة لعلم
/// `LocalCache.notificationsEnabled` الذي كان معرَّفاً في المشروع بلا أي
/// مستدعٍ. يظهر دائماً، حتى فوق قائمة فارغة، فلا يختفي الإعداد بمجرد أنه لا
/// توجد إشعارات بعد.
class _NotificationsPrefCard extends StatelessWidget {
  const _NotificationsPrefCard({required this.enabled, required this.onChanged});

  final bool enabled;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, 0),
      child: Card(
        margin: EdgeInsets.zero,
        child: SwitchListTile.adaptive(
          value: enabled,
          onChanged: onChanged,
          activeThumbColor: AppColors.white,
          activeTrackColor: AppColors.green800,
          contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.xs),
          title: const Text(AppStrings.notificationsPrefTitle, style: AppTextStyles.titleSmall),
          subtitle: Text(
            enabled ? AppStrings.notificationsPrefOn : AppStrings.notificationsPrefOff,
            style: AppTextStyles.caption,
          ),
        ),
      ),
    );
  }
}

class _NotificationCard extends StatelessWidget {
  const _NotificationCard({required this.item, required this.onTap});

  final AppNotification item;
  final VoidCallback onTap;

  /// اللون والأيقونة معاً يحملان النوع — لا يُعتمد على اللون وحده
  /// (ui-ux-pro-max: لا معنى ينقله اللون بمفرده).
  (IconData, Color) get _kindVisual => switch (item.kind) {
        NotificationKind.order => (Icons.receipt_long_rounded, AppColors.success),
        NotificationKind.promo => (Icons.local_offer_rounded, AppColors.orangeDark),
        NotificationKind.system => (Icons.info_outline_rounded, AppColors.blue),
      };

  @override
  Widget build(BuildContext context) {
    final (icon, color) = _kindVisual;
    final unread = !item.isRead;

    return PressScale(
      onTap: onTap,
      child: Card(
        margin: EdgeInsets.zero,
        // غير المقروء يُميَّز بثلاث إشارات مجتمعة (خلفية، حد، وزن الخط
        // وشارة) لا بلون وحده.
        color: unread ? AppColors.green50 : null,
        shape: unread
            ? RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.md),
                side: const BorderSide(color: AppColors.green100),
              )
            : null,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            style: AppTextStyles.titleSmall.copyWith(
                              fontWeight: unread ? FontWeight.w700 : FontWeight.w600,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (unread) ...[
                          const SizedBox(width: AppSpacing.sm),
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(color: AppColors.green800, shape: BoxShape.circle),
                          ),
                        ],
                      ],
                    ),
                    if (item.body.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.xs),
                      Text(item.body, style: AppTextStyles.bodyMuted, maxLines: 3, overflow: TextOverflow.ellipsis),
                    ],
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      children: [
                        if (item.createdAt != null)
                          Text(AppStrings.relativeTime(item.createdAt), style: AppTextStyles.caption),
                        if (unread) ...[
                          if (item.createdAt != null)
                            const Text(' · ', style: AppTextStyles.caption),
                          Text(
                            AppStrings.notificationsUnreadBadge,
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.green800,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              if (item.imageUrl != null) ...[
                const SizedBox(width: AppSpacing.md),
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  child: CachedNetworkImage(
                    imageUrl: item.imageUrl!,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    // صورة مكسورة لا تترك مربعاً رمادياً معلّقاً — تختفي
                    // ببساطة وتبقى البطاقة سليمة.
                    errorWidget: (_, _, _) => const SizedBox.shrink(),
                    placeholder: (_, _) => const ShimmerBox(width: 56, height: 56),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _NotificationsSkeleton extends StatelessWidget {
  const _NotificationsSkeleton();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.xxl),
      physics: const NeverScrollableScrollPhysics(),
      itemCount: 5,
      separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
      itemBuilder: (_, _) => Card(
        margin: EdgeInsets.zero,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const ShimmerBox(width: 44, height: 44, borderRadius: BorderRadius.all(Radius.circular(22))),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    ShimmerBox(width: 160, height: 15),
                    SizedBox(height: AppSpacing.sm),
                    ShimmerBox(height: 12),
                    SizedBox(height: AppSpacing.sm),
                    ShimmerBox(width: 80, height: 11),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
