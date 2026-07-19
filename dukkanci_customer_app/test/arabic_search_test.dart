import 'package:flutter_test/flutter_test.dart';
import 'package:dukkanci_customer_app/core/utils/arabic.dart';

/// These expectations are not invented — every "real data" case below was
/// confirmed against the live Supabase catalog (11,725 products) before the
/// search implementation was written.
void main() {
  group('normalizeArabic', () {
    test('folds alef variants — "أرز" and "ارز" both exist in the catalog', () {
      expect(normalizeArabic('أرز'), normalizeArabic('ارز'));
      expect(normalizeArabic('آرز'), 'ارز');
      expect(normalizeArabic('إرز'), 'ارز');
    });

    test('folds ta-marbuta, alef-maqsura, hamza forms', () {
      expect(normalizeArabic('شاورمة'), normalizeArabic('شاورمه'));
      expect(normalizeArabic('مشوى'), normalizeArabic('مشوي'));
      expect(normalizeArabic('مؤمن'), 'مومن');
      expect(normalizeArabic('بئر'), 'بير');
    });

    test('strips tatweel and harakat — real catalog rows use both', () {
      expect(normalizeArabic('حـمـ__ص'.replaceAll('__', '')), 'حمص');
      expect(normalizeArabic('حمّص'), 'حمص');
    });

    test('collapses whitespace and lowercases', () {
      expect(normalizeArabic('  دجاج   مشوي '), 'دجاج مشوي');
      expect(normalizeArabic('PIZZA'), 'pizza');
    });
  });

  group('matchesAllTerms', () {
    test('ANDs terms and ignores their order (mirrors app.js terms.every)', () {
      expect(matchesAllTerms('وجبة دجاج مشوي', ['دجاج', 'مشوي']), isTrue);
      expect(matchesAllTerms('وجبة دجاج مشوي', ['مشوي', 'دجاج']), isTrue);
      expect(matchesAllTerms('وجبة دجاج مقلي', ['دجاج', 'مشوي']), isFalse);
    });

    test('matches across the name+category haystack', () {
      expect(matchesAllTerms('شاورما دجاج سندويش الشاورما', ['شاورما', 'دجاج']), isTrue);
    });

    test('a query spelled differently still matches the stored text', () {
      expect(matchesAllTerms('شاورمة دجاج', ['شاورمه']), isTrue); // stored ة, typed ه
      expect(matchesAllTerms('حمّص بالقريدس', ['حمص']), isTrue); // stored shadda
      expect(matchesAllTerms('أرز بخاري', ['ارز']), isTrue); // stored أ, typed ا
    });

    test('KNOWN LIMIT: a final ا and a final ة are NOT interchangeable', () {
      // Normalization folds ة→ه, but leaves ا alone, so "شاورمة" and "شاورما"
      // stay distinct. This is not an app bug — it is exactly what the website
      // does, and searching "شاورمة" against the live catalog genuinely
      // returns 0 products while "شاورما" returns 367. Asserted here so the
      // behaviour is deliberate and visible rather than a silent surprise.
      expect(matchesAllTerms('شاورما دجاج', ['شاورمه']), isFalse);
    });

    test('empty terms never match', () {
      expect(matchesAllTerms('أي شيء', const []), isFalse);
    });
  });

  group('arabicIlikePattern', () {
    test('masks every position normalization could have altered', () {
      // ا, ه, ي and و are all ambiguous — أ/إ/آ fold into ا, ة into ه,
      // ى/ئ into ي, and ؤ into و — so none of them can be matched literally.
      expect(arabicIlikePattern('شاورما'), '*ش*_*_*ر*م*_*');
      expect(arabicIlikePattern('حمص'), '*ح*م*ص*'); // no ambiguous letters at all
    });

    test('و and ي are ambiguous too (ؤ, ى/ئ fold into them)', () {
      expect(arabicIlikePattern('قهوه'), '*ق*_*_*_*');
    });

    test('joins characters with * so deleted tatweel/harakat still match', () {
      // This is what lifts "حمص" from 156/161 to 161/161 on real data.
      final pattern = arabicIlikePattern('حمص');
      expect(pattern.startsWith('*') && pattern.endsWith('*'), isTrue);
      expect(pattern.split('*').where((s) => s.isNotEmpty).join(), 'حمص');
    });

    test('neutralises PostgREST/LIKE metacharacters so a query cannot widen or break the filter', () {
      // `,` and `)` would escape the or=(…) syntax; `%`/`*`/`_` would widen it.
      for (final ch in [',', ')', '(', '%', '*', '_', r'\', '"']) {
        expect(arabicIlikePattern('ab${ch}cd'), '*a*b*_*c*d*', reason: 'unsafe char $ch leaked');
      }
    });

    test('keeps latin and digits literal', () {
      expect(arabicIlikePattern('pizza7'), '*p*i*z*z*a*7*');
    });
  });

  group('arabicSearchTerms', () {
    test('splits on whitespace and drops empties', () {
      expect(arabicSearchTerms('  دجاج   مشوي '), ['دجاج', 'مشوي']);
      expect(arabicSearchTerms('   '), isEmpty);
    });
  });
}
