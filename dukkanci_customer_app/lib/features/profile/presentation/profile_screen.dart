import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.read(authRepositoryProvider).currentSession;
    final isLoggedIn = session != null;

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navProfile)),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Row(
            children: [
              const CircleAvatar(radius: 28, backgroundColor: AppColors.green50, child: Icon(Icons.person_rounded, color: AppColors.green800, size: 30)),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(isLoggedIn ? (session.user.userMetadata?['name'] as String? ?? 'حسابي') : 'زائر', style: AppTextStyles.title),
                    const SizedBox(height: 2),
                    Text(isLoggedIn ? (session.user.phone ?? session.user.email ?? '') : 'سجّل الدخول لحفظ عناوينك وطلباتك', style: AppTextStyles.bodyMuted),
                  ],
                ),
              ),
              if (!isLoggedIn) FilledButton(onPressed: () {}, child: const Text('دخول')),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),
          _Section(
            children: [
              _tile(context, Icons.location_on_outlined, 'عناويني', () => context.push(AppRoutes.locationPicker)),
              _tile(context, Icons.receipt_long_outlined, 'طلباتي', () => context.push(AppRoutes.orders)),
              _tile(context, Icons.favorite_border_rounded, 'المفضلة', () => context.push(AppRoutes.favorites), isLast: true),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          _Section(
            children: [
              _tile(context, Icons.support_agent_rounded, 'الدعم والمساعدة', () => context.push(AppRoutes.support)),
              _tile(context, Icons.description_outlined, 'الشروط والأحكام', () {}),
              _tile(context, Icons.privacy_tip_outlined, 'سياسة الخصوصية', () {}),
              _tile(context, Icons.info_outline_rounded, 'عن التطبيق', () {}, isLast: true),
            ],
          ),
          if (isLoggedIn) ...[
            const SizedBox(height: AppSpacing.lg),
            _Section(
              children: [
                _tile(context, Icons.logout_rounded, 'تسجيل الخروج', () => ref.read(authRepositoryProvider).signOut()),
                _tile(context, Icons.delete_forever_rounded, 'حذف الحساب', () {}, danger: true, isLast: true),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _tile(BuildContext context, IconData icon, String label, VoidCallback onTap, {bool danger = false, bool isLast = false}) {
    final color = danger ? AppColors.danger : AppColors.ink;
    return Column(
      children: [
        ListTile(
          leading: Icon(icon, color: danger ? AppColors.danger : AppColors.muted),
          title: Text(label, style: AppTextStyles.body.copyWith(color: color)),
          trailing: const Icon(Icons.chevron_left_rounded, color: AppColors.muted),
          onTap: onTap,
        ),
        if (!isLast) const Divider(height: 1, indent: AppSpacing.lg, endIndent: AppSpacing.lg),
      ],
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
        child: Column(children: children),
      ),
    );
  }
}
