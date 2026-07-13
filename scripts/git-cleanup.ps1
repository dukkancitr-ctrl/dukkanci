# git-cleanup.ps1
#
# نسخة PowerShell من scripts/git-cleanup.sh (لأن جهازك يستخدم PowerShell وليس bash).
# شغّله من جذر المشروع مباشرة في PowerShell:
#   cd "C:\projects\New Dukkanci"
#   .\scripts\git-cleanup.ps1
#
# إن ظهرت رسالة عن سياسة التنفيذ (execution policy) شغّل مرة واحدة فقط:
#   powershell -ExecutionPolicy Bypass -File .\scripts\git-cleanup.ps1
#
# القاعدة: لا شيء هنا يلمس الموقع المنشور فعلياً — هذا تنظيف محلي لـ Git فقط.

$ErrorActionPreference = "Continue"

Write-Host "== الخطوة 1: تنظيف نُسخ العمل (worktrees) المتروكة ==" -ForegroundColor Cyan
Write-Host "تم التأكد أن مجلدات الـ15 نسخة كلها غير موجودة فعلياً على القرص (gitdir file points to non-existent location)."
Write-Host "لذلك الحذف هنا آمن 100% — لا يوجد كود يُحذف، فقط سجلّ داخلي لـ Git."
git worktree prune -v

Write-Host ""
Write-Host "== الخطوة 2: حذف الفروع المحلية المدموجة فعلياً في main (آمن) ==" -ForegroundColor Cyan
$localBranches = @(
  "add-babalyemen-clean",
  "add-baraka-store",
  "add-rody-restaurant",
  "add-wingi-store",
  "codex/fix-merchant-category",
  "fix-product-save-handler",
  "fix-profile-setup-compact",
  "merchant-staff-roles",
  "merchant-team-roles",
  "trust-icons-deploy",
  "worktree-filistin-kunefesi-65",
  "worktree-add-istanbul-chicken"
)
foreach ($b in $localBranches) {
  $result = git branch -d $b 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "حُذف: $b" -ForegroundColor Green
  } else {
    Write-Host "تخطّي (غير موجود أو غير مدموج فعلاً): $b" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "== الخطوة 3: حذف الفروع البعيدة المدموجة في origin/main (آمن) ==" -ForegroundColor Cyan
$remoteBranches = @(
  "add-baraka-store",
  "add-facebook-ads-targeting",
  "add-filistin-kunefesi",
  "add-wingi-store",
  "admin-complaints-persistence",
  "fix-product-save-handler",
  "fix/checkout-stale-cart-item",
  "fix/marketplace-audit",
  "run-catalog-ingestion",
  "ship-customers-tab"
)
foreach ($b in $remoteBranches) {
  git push origin --delete $b 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "حُذف من origin: $b" -ForegroundColor Green
  } else {
    Write-Host "تخطّي (غير موجود بالفعل): $b" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "== انتهى الجزء الآمن. الفروع التالية لم تُحذف وتحتاج مراجعتك اليدوية: ==" -ForegroundColor Magenta

$review = @"
الفرع                          | آخر تعديل   | ملاحظة
--------------------------------------------------------------
add-alahdab-store               | 2026-07-02  | تحقّق: هل متجر الأحدب ظاهر على الموقع؟ إن كان ظاهراً، احذف الفرع.
add-albaraa-kunafa              | 2026-07-02  | تحقّق: هل عنصر كنافة البرّاء مضاف فعلياً؟
add-babalyemen-store            | 2026-07-01  | يوجد فرع أحدث (add-babalyemen-clean) تم دمجه بالفعل — راجع ثم احذف.
add-beyazit-store               | 2026-07-04  | 14 التزاماً فريداً — الأكبر من نوعها، راجع بعناية قبل أي حذف.
add-bludan-store                | 2026-07-01  | يوجد bludan-data.js وbludan-fatih-data.js بتاريخ أحدث — يُرجَّح أن العمل انتقل لمسار آخر. تحقّق أولاً.
add-facebook-ads-targeting      | 2026-07-05  | النسخة البعيدة مدموجة بالفعل، لكن المحلية فيها 33 التزاماً إضافياً — راجع الفارق قبل الحذف.
add-hadramout-store             | 2026-07-02  | تحقّق من ظهور متجر حضرموت على الموقع.
add-ruman-store                 | 2026-07-02  | تحقّق من ظهور متجر رُمّان.
add-saj-store, add-shamgrill-store, add-rody-clean, add-yumy-yumy | متفرقة | كل واحد فرع "إضافة متجر" لم يُدمَج رسمياً — تحقّق من ظهور كل متجر على الموقع أولاً.
address-flow-v2, admin-coupons-ui, admin-panel-g2-orders-rls, admin-panel-g2-rls-server-writes | 2026-07-03 | ميزات إدارية غير مدموجة — راجع إن كانت لا تزال مطلوبة.
biryani-on-main, catalog-manual-enhance, catalog-review-ui-fix | متفرقة | راجع يدوياً.
claude/mystifying-sanderson-b7c4f6 | 2026-07-04 | فرع تجريبي من جلسة سابقة — على الأغلب قابل للحذف بعد مراجعة سريعة.
fix-customers-directory, fix-delivery-zone-nan, fix-import-modal-price-row, fix-join-modal-formatting, fix-robots-merchants, fix/pasa-noimage-hide, khawali-store-pixel, security-hardening | متفرقة | تحقّق إن كانت المشكلة قد حُلّت بطريقة أخرى على main؛ إن كانت كذلك، احذف الفرع.
merchant-ai-images, merchant-audit-notifications, merchant-dashboard-foundation, merchant-discount-codes, merchant-meta-catalog, merchant-products-menu, merchant-reports, merchant-search-synonyms, merchant-support | متفرقة | مجموعة كبيرة من ميزات لوحة التاجر غير المدموجة — تستحق مراجعة مخصصة منفصلة.
redesign-join-modal             | 2026-07-05  | راجع إن كان التصميم النهائي وصل لـ main بطريقة أخرى.
"@
Write-Host $review
