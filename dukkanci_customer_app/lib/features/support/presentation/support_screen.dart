import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/localization/app_strings.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

/// Spec section 23 issue types — the actual ticket submission (with
/// order id / store id / screenshots attached automatically) needs a real
/// POST /support/tickets endpoint that doesn't exist server-side yet; for
/// now every category routes to WhatsApp support (the real "خدمة العملاء"
/// number from the website footer — index.html, not a placeholder) with the
/// category pre-filled, same as the website's existing WhatsApp assist
/// channel. Reference layout: a searchable categorized help list — the
/// reference's "Joker ve Kupon"/"Ypro"/"YeClub" categories have no Dukkanci
/// equivalent (no coupon system or paid membership) and aren't reproduced.
class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _IssueType {
  final IconData icon;
  final String label;
  const _IssueType(this.icon, this.label);
}

class _SupportScreenState extends State<SupportScreen> {
  static const _customerServiceWhatsapp = '905551000630';
  final _searchController = TextEditingController();
  String _query = '';

  static const _issueTypes = [
    _IssueType(Icons.schedule_rounded, 'طلب متأخر'),
    _IssueType(Icons.remove_shopping_cart_rounded, 'منتج ناقص'),
    _IssueType(Icons.swap_horiz_rounded, 'منتج مختلف عمّا طلبته'),
    _IssueType(Icons.thumb_down_alt_rounded, 'جودة المنتج سيئة'),
    _IssueType(Icons.payment_rounded, 'مشكلة في الدفع'),
    _IssueType(Icons.location_off_rounded, 'مشكلة في العنوان'),
    _IssueType(Icons.cancel_rounded, 'إلغاء طلب'),
    _IssueType(Icons.bug_report_rounded, 'مشكلة في التطبيق'),
    _IssueType(Icons.question_answer_rounded, 'استفسار عام'),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _contact(String issue) {
    launchUrl(
      Uri.parse('https://wa.me/$_customerServiceWhatsapp?text=${Uri.encodeComponent('لدي مشكلة: $issue')}'),
      mode: LaunchMode.externalApplication,
    );
  }

  @override
  Widget build(BuildContext context) {
    final normalized = _query.trim();
    final filtered = normalized.isEmpty ? _issueTypes : _issueTypes.where((t) => t.label.contains(normalized)).toList();

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.supportAndHelp)),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          TextField(
            controller: _searchController,
            onChanged: (v) => setState(() => _query = v),
            decoration: const InputDecoration(hintText: AppStrings.supportSearchHint, prefixIcon: Icon(Icons.search_rounded)),
          ),
          const SizedBox(height: AppSpacing.lg),
          Card(
            child: ListTile(
              leading: Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(color: AppColors.green50, shape: BoxShape.circle),
                child: const Icon(Icons.chat_rounded, color: AppColors.success),
              ),
              title: const Text(AppStrings.supportWhatsappTitle, style: AppTextStyles.titleSmall),
              subtitle: const Text(AppStrings.supportWhatsappSubtitle, style: AppTextStyles.bodyMuted),
              trailing: const Icon(Icons.chevron_left_rounded, color: AppColors.muted),
              onTap: () => launchUrl(Uri.parse('https://wa.me/$_customerServiceWhatsapp'), mode: LaunchMode.externalApplication),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(AppStrings.supportIssueTypesTitle, style: AppTextStyles.titleSmall),
          const SizedBox(height: AppSpacing.sm),
          if (filtered.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: AppSpacing.xl),
              child: Center(child: Text(AppStrings.noResults, style: AppTextStyles.bodyMuted)),
            )
          else
            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
                child: Column(
                  children: [
                    for (var i = 0; i < filtered.length; i++) ...[
                      ListTile(
                        leading: Icon(filtered[i].icon, color: AppColors.muted),
                        title: Text(filtered[i].label, style: AppTextStyles.body),
                        trailing: const Icon(Icons.chevron_left_rounded, color: AppColors.muted),
                        onTap: () => _contact(filtered[i].label),
                      ),
                      if (i != filtered.length - 1) const Divider(height: 1, indent: AppSpacing.lg, endIndent: AppSpacing.lg),
                    ],
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
