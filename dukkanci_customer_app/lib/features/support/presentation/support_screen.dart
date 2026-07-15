import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';

/// Spec section 23 issue types — the actual ticket submission (with
/// order id / store id / screenshots attached automatically) needs a real
/// POST /support/tickets endpoint that doesn't exist server-side yet; for
/// now this routes straight to WhatsApp support, same as the website's
/// existing "مساعدة واتساب" channel.
class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

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
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.chat_rounded, color: AppColors.success),
              title: const Text('تواصل عبر واتساب'),
              subtitle: const Text('أسرع طريقة للحصول على مساعدة'),
              onTap: () => launchUrl(Uri.parse('https://wa.me/905XXXXXXXXX'), mode: LaunchMode.externalApplication),
            ),
          ),
          const SizedBox(height: 16),
          Text('نوع المشكلة', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [for (final t in _issueTypes) ActionChip(label: Text(t), onPressed: () {})],
          ),
        ],
      ),
    );
  }
}
