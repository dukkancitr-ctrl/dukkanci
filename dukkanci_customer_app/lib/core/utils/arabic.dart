/// Arabic-aware text matching, shared by every search surface in the app.
///
/// [normalizeArabic] is a character-for-character port of the website's
/// `normalizeAr()` (app.js:3275). The app and the site read the *same*
/// Supabase rows, so they must agree on what "matches" — before this existed
/// there were two divergent half-copies of the rule (search_screen.dart and
/// store_repository.dart), each missing folds the other had.
library;

/// Characters that normalization *folds into* — i.e. the only ambiguous
/// characters that can survive [normalizeArabic]. A normalized `ا` may have
/// been written `أ إ آ ا` in the database, `ه` may have been `ه ة`, and so on,
/// so these positions can never be matched literally server-side.
const _ambiguousAfterNormalize = {'ا', 'ه', 'ي', 'و'};

/// Fold spelling variants that Arabic writers use interchangeably, so
/// "شاورمة"/"شاورما" and "أرز"/"ارز" compare equal. Both spellings genuinely
/// occur in the live catalog (55 rows spell it "أرز", 20 spell it "ارز"), so
/// this is not a theoretical nicety — without it, half the results vanish.
String normalizeArabic(String input) => input
    .toLowerCase()
    .replaceAll(RegExp('[أإآ]'), 'ا')
    .replaceAll('ة', 'ه')
    .replaceAll('ى', 'ي')
    .replaceAll('ؤ', 'و')
    .replaceAll('ئ', 'ي')
    .replaceAll('ـ', '') // tatweel
    .replaceAll(RegExp('[ً-ْ]'), '') // harakat / diacritics
    .replaceAll(RegExp(r'\s+'), ' ')
    .trim();

/// Split a raw user query into the normalized terms that must *all* match.
List<String> arabicSearchTerms(String query) =>
    normalizeArabic(query).split(' ').where((t) => t.isNotEmpty).toList();

/// Does [haystack] satisfy every term in [terms]? Mirrors the website's
/// `terms.every(t => hay.includes(t))` — AND across terms, plain substring
/// (not word-boundary) per term.
bool matchesAllTerms(String haystack, List<String> terms) {
  if (terms.isEmpty) return false;
  final hay = normalizeArabic(haystack);
  return terms.every(hay.contains);
}

final _letterOrDigit = RegExp(r'[\p{L}\p{N}]', unicode: true);

/// Build a PostgREST `ilike` pattern that is a deliberate **superset** of the
/// true matches for one normalized [term], used only to narrow 11,725 rows
/// down to a candidate set the client can then filter exactly.
///
/// Two problems make a literal `*term*` wrong, both confirmed against the live
/// catalog:
///
///  * **Substitution** — the query is normalized but the stored text is not,
///    so a normalized `ه` must still match a stored `ة`. Searching the literal
///    "شاورمة" returns *zero* rows even though 367 products match it. Every
///    ambiguous position therefore becomes `_` (matches exactly one char).
///  * **Deletion** — normalization *removes* tatweel and harakat, which no
///    single-char wildcard can stand in for. "حمص" would silently miss the
///    real products "حمّص" and "حـمـص بيـروتـي". Joining every character with
///    `*` absorbs those, and lifts recall on that query from 156/161 to 161/161.
///
/// Anything that is not a letter or digit collapses to `_` as well, which both
/// keeps the value safe inside PostgREST's comma/parenthesis-delimited `or=(…)`
/// syntax and stops a user-typed `%`/`*` from widening the pattern.
/// Spelling variants a stored synonym might use, for EXACT matching.
///
/// `product_synonyms.synonyms` is a `text[]`, and PostgREST offers no pattern
/// matching on array elements — `ilike` on the column fails outright with
/// `42883 (no operator)`, leaving only `cs`/`ov`, which compare whole elements
/// **case-sensitively**. So instead of one loose pattern we send a bounded set
/// of concrete spellings and let `ov` (overlap) do the work.
///
/// Case variants matter because synonyms are stored as written, not folded:
/// `cs.{Dove}` matches while `cs.{dove}` returns nothing. Arabic variants
/// matter for the same reason — the stored text is un-normalized, so a user
/// typing "قهوه عربيه" must still reach a stored "قهوة عربية". Measured
/// against the live table, this set reaches 94.8% of the synonym terms that
/// add anything over a product's own name/category.
List<String> synonymMatchCandidates(String query, {int max = 24}) {
  final q = query.trim().replaceAll(RegExp(r'\s+'), ' ');
  if (q.isEmpty) return const [];

  String titleCase(String s) => s.replaceAllMapped(
        RegExp(r'\S+'),
        (m) => m[0]!.length == 1 ? m[0]!.toUpperCase() : m[0]![0].toUpperCase() + m[0]!.substring(1).toLowerCase(),
      );

  final out = <String>{};
  for (final cased in {q, q.toLowerCase(), q.toUpperCase(), titleCase(q)}) {
    for (final variant in _arabicSpellings(cased, max)) {
      out.add(variant);
      if (out.length >= max) return out.toList();
    }
  }
  return out.toList();
}

/// Every letter that normalization treats as interchangeable maps to its whole
/// class, so a query spelled one way still matches text spelled another.
const _spellingClasses = <String, List<String>>{
  'ا': ['ا', 'أ', 'إ', 'آ'], 'أ': ['ا', 'أ', 'إ', 'آ'], 'إ': ['ا', 'أ', 'إ', 'آ'], 'آ': ['ا', 'أ', 'إ', 'آ'],
  'ه': ['ه', 'ة'], 'ة': ['ه', 'ة'],
  'ي': ['ي', 'ى', 'ئ'], 'ى': ['ي', 'ى', 'ئ'], 'ئ': ['ي', 'ى', 'ئ'],
  'و': ['و', 'ؤ'], 'ؤ': ['و', 'ؤ'],
};

/// Cartesian expansion over ambiguous letters, hard-bounded: once the set
/// would exceed [max], later letters are appended as typed instead of
/// expanded. Deterministic, and never explodes on a long query.
List<String> _arabicSpellings(String s, int max) {
  var results = <String>[''];
  for (final ch in s.split('')) {
    final options = _spellingClasses[ch];
    if (options == null || results.length * options.length > max) {
      results = [for (final r in results) '$r$ch'];
    } else {
      results = [for (final r in results) for (final o in options) '$r$o'];
    }
  }
  return results;
}

String arabicIlikePattern(String term) {
  final buffer = StringBuffer('*');
  for (final ch in term.split('')) {
    final safe = _ambiguousAfterNormalize.contains(ch) || !_letterOrDigit.hasMatch(ch) ? '_' : ch;
    buffer
      ..write(safe)
      ..write('*');
  }
  return buffer.toString();
}
