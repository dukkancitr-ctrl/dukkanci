import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

/// Spec section 23 issue types — the actual ticket submission (with
/// order id / store id / screenshots attached automatically) needs a real
/// POST /support/tickets endpoint that doesn't exist server-side yet; for
/// now this routes straight to WhatsApp support (the real "خدمة العملاء"
/// number from the website footer — index.html, not a placeholder), same as
/// the website's existing WhatsApp assist channel.
class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  static const _customerServiceWhatsapp = '905551000630';

  static const _issueTypes = [
    'طلب متأخر',
    'منتج ناقص',
    'منتج مختلف',
    'جودة سيئة',
    'مشكلة دفع',
    'مشكلة عنوان',
    'إلغاء',
    'مشكلة في التطبيق',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('الدعم والمساعدة')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Card(
            child: ListTile(
              leading: Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(color: AppColors.green50, shape: BoxShape.circle),
                child: const Icon(Icons.chat_rounded, color: AppColors.success),
              ),
              title: const Text('تواصل عبر واتساب', style: AppTextStyles.titleSmall),
              subtitle: const Text('أسرع طريقة للحصول على مساعدة', style: AppTextStyles.bodyMuted),
              trailing: const Icon(Icons.chevron_left_rounded, color: AppColors.muted),
              onTap: () => launchUrl(Uri.parse('https://wa.me/$_customerServiceWhatsapp'), mode: LaunchMode.externalApplication),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text('نوع المشكلة', style: AppTextStyles.titleSmall),
          const SizedBox(height: AppSpacing.sm),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              for (final t in _issueTypes)
                ActionChip(
                  label: Text(t),
                  onPressed: () => launchUrl(
                    Uri.parse('https://wa.me/$_customerServiceWhatsapp?text=${Uri.encodeComponent('لدي مشكلة: $t')}'),
                    mode: LaunchMode.externalApplication,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
