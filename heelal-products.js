const heelalProductCatalog = [];

const heelalCategoryDescriptions = {
  "الخاروف": "لحم خاروف طازج ومجهز حسب اختيارك.",
  "العجول": "لحم عجل طازج مختار بعناية.",
  "الدجاج": "دجاج طازج وتجهيزات متنوعة.",
  "الديك الرومي": "قطع ديك رومي طازجة جاهزة للتجهيز.",
  "السقطات": "سقطات طازجة ومنظفة بعناية.",
  "أكلات القشة": "مكونات أكلات القشة والتجهيزات التقليدية.",
  "الجاهز": "تجهيزات جاهزة للطهي من وصفات الملحمة.",
  "المشاوي": "مشاوي مجهزة ومتبلّة للتقديم.",
  "التواصي": "طلبات خاصة وتواصي للعائلات والمناسبات."
};

const heelalProducts = heelalProductCatalog.map(([name, image, price, unit, category], index) => ({
  id: 5001 + index,
  storeId: 5,
  name,
  image: `/assets/photos/heelal/${image}`,
  price,
  oldPrice: null,
  unit,
  category,
  available: true,
  featured: index < 8,
  description: heelalCategoryDescriptions[category],
  options: unit === "الكيلو"
    ? [{ name: "الكمية", values: ["كيلو", "نصف كيلو"], extra: [0, -(price / 2)] }]
    : []
}));
