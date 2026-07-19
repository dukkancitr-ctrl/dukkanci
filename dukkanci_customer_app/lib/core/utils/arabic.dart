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
