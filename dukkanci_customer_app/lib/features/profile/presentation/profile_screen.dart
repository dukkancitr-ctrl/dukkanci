import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.read(authRepositoryProvider).currentSession;
    final isLoggedIn = session != null;

    Widget tile(IconData icon, String label, VoidCallback onTap) => ListTile(
          leading: Icon(icon, color: AppColors.muted),
          title: Text(label),
          trailing: const Icon(Icons.chevron_left_rounded),
          onTap: onTap,
        );

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.navProfile)),
      body: ListView(
        children: [
          const SizedBox(height: 12),
          if (!isLoggedIn)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ElevatedButton(onPressed: () {}, child: const Text('تسجيل الدخول')),
            ),
          const Divider(height: 32),
          tile(Icons.location_on_outlined, 'عناويني', () => context.push(AppRoutes.locationPicker)),
          tile(Icons.receipt_long_outlined, 'طلباتي', () => context.push(AppRoutes.orders)),
          tile(Icons.favorite_border_rounded, 'المفضلة', () => context.push(AppRoutes.favorites)),
          tile(Icons.support_agent_rounded, 'الدعم والمساعدة', () => context.push(AppRoutes.support)),
          tile(Icons.description_outlined, 'الشروط والأحكام', () {}),
          tile(Icons.privacy_tip_outlined, 'سياسة الخصوصية', () {}),
          tile(Icons.info_outline_rounded, 'عن التطبيق', () {}),
          const Divider(height: 32),
          if (isLoggedIn) ...[
            tile(Icons.logout_rounded, 'تسجيل الخروج', () => ref.read(authRepositoryProvider).signOut()),
            ListTile(
              leading: const Icon(Icons.delete_forever_rounded, color: AppColors.danger),
              title: const Text('حذف الحساب', style: TextStyle(color: AppColors.danger)),
              onTap: () {
                // Spec section 22: must be reachable both in-app AND via a
                // public web page — wire the in-app confirmation + backend
                // DELETE /me call once auth ships end-to-end.
              },
            ),
          ],
        ],
      ),
    );
  }
}
