import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../app/providers.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/widgets/press_scale.dart';
import '../../auth/presentation/login_sheet.dart';

final _packageInfoProvider = FutureProvider.autoDispose<PackageInfo>((ref) => PackageInfo.fromPlatform());

/// Reference layout: quick-action tiles + a "more" section + a real app
/// version footer. Three reference sections have NO Dukkanci equivalent and
/// are deliberately omitted rather than faked: the "Ypro" paid-membership
/// banner, the "Cüzdan" (in-app wallet/balance — Dukkanci has no prepaid
/// balance, only cash/card-on-delivery/bank-transfer), and "Fırsatlar"
/// (Ypro/YeClub/coupons — no loyalty program or coupon system exists, see
/// [[flutter-v2-android-app]] cart-redesign notes for the same conclusion).
/// The settings gear icon is also omitted — there's no settings screen to
/// open, and a dead icon is worse than no icon.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  static const _customerServiceWhatsapp = '905551000630';

  void _openLegalPage(String path) {
    launchUrl(Uri.parse('https://www.dukkanci.com.tr$path'), mode: LaunchMode.externalApplication);
  }

  void _requestAccountDeletion() {
    launchUrl(
      Uri.parse('https://wa.me/$_customerServiceWhatsapp?text=${Uri.encodeComponent('أرغب في حذف حسابي على تطبيق دكانجي')}'),
      mode: LaunchMode.externalApplication,
    );
  }

  void _showAbout(BuildContext context, PackageInfo? info) {
    showAboutDialog(
      context: context,
      applicationName: AppStrings.appName,
      applicationVersion: info == null ? null : '${info.version} (${info.buildNumber})',
      applicationIcon: ClipRRect(
        borderRadius: BorderRadius.circular(AppRadius.sm),
        child: Image.asset('assets/images/logo.png', width: 48, height: 48, errorBuilder: (_, _, _) => const FlutterLogo(size: 48)),
      ),
      applicationLegalese: 'دكانجي — سوق طلبات محلي (مطاعم وسوبرماركت) في تركيا',
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watching this (rather than a one-off `ref.read`) is what makes the
    // screen rebuild the instant showLoginSheet() creates a session — see
    // authStateChangesProvider's doc comment for why a plain read never did.
    ref.watch(authStateChangesProvider);
    final session = ref.read(authRepositoryProvider).currentSession;
    final isLoggedIn = session != null;
    final packageInfo = ref.watch(_packageInfoProvider).when(data: (v) => v, loading: () => null, error: (_, _) => null);

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
                    Text(isLoggedIn ? (session.user.userMetadata?['name'] as String? ?? AppStrings.navProfile) : AppStrings.profileGuestName, style: AppTextStyles.title),
                    const SizedBox(height: 2),
                    Text(isLoggedIn ? (session.user.phone ?? session.user.email ?? '') : AppStrings.profileGuestBody, style: AppTextStyles.bodyMuted),
                  ],
                ),
              ),
              if (!isLoggedIn) FilledButton(onPressed: () => showLoginSheet(context), child: const Text(AppStrings.profileLogin)),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),
          Row(
            children: [
              Expanded(child: _QuickActionTile(icon: Icons.receipt_long_rounded, label: AppStrings.navOrders, onTap: () => context.push(AppRoutes.orders))),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: _QuickActionTile(icon: Icons.favorite_rounded, label: AppStrings.navFavorites, onTap: () => context.push(AppRoutes.favorites))),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: _QuickActionTile(icon: Icons.location_on_rounded, label: AppStrings.myAddresses, onTap: () => context.push(AppRoutes.addresses))),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(AppStrings.moreSection, style: AppTextStyles.titleSmall),
          const SizedBox(height: AppSpacing.sm),
          _Section(
            children: [
              _tile(context, Icons.support_agent_rounded, AppStrings.supportAndHelp, () => context.push(AppRoutes.support)),
              _tile(context, Icons.description_outlined, AppStrings.termsAndConditions, () => _openLegalPage('/terms')),
              _tile(context, Icons.privacy_tip_outlined, AppStrings.privacyPolicy, () => _openLegalPage('/privacy.html')),
              _tile(context, Icons.info_outline_rounded, AppStrings.aboutApp, () => _showAbout(context, packageInfo), isLast: true),
            ],
          ),
          if (isLoggedIn) ...[
            const SizedBox(height: AppSpacing.lg),
            _Section(
              children: [
                _tile(context, Icons.logout_rounded, AppStrings.logout, () => ref.read(authRepositoryProvider).signOut()),
                _tile(context, Icons.delete_forever_rounded, AppStrings.deleteAccount, _requestAccountDeletion, danger: true, isLast: true),
              ],
            ),
          ],
          const SizedBox(height: AppSpacing.xl),
          if (packageInfo != null)
            Center(
              child: Text('${AppStrings.appVersionPrefix} ${packageInfo.version} (${packageInfo.buildNumber})', style: AppTextStyles.caption),
            ),
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

class _QuickActionTile extends StatelessWidget {
  const _QuickActionTile({required this.icon, required this.label, required this.onTap});

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return PressScale(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md, horizontal: AppSpacing.xs),
        decoration: BoxDecoration(
          color: AppColors.white,
          border: Border.all(color: AppColors.line),
          borderRadius: BorderRadius.circular(AppRadius.sm),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.green800, size: 22),
            const SizedBox(height: 6),
            Text(label, style: AppTextStyles.label, maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
          ],
        ),
      ),
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
