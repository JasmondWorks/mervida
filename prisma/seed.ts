import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "african-foods",
    name: "African Foods",
    description:
      "Everyday African staples, rich traditional red oil, and authentic herb seasonings",
  },
  {
    slug: "baking-ingredients",
    name: "Baking Ingredients",
    description:
      "Pure cold-pressed cooking oils, gluten-free flours, and natural baking fats",
  },
  {
    slug: "food-chemicals",
    name: "Natural Food Colorants",
    description:
      "Natural plant color oils, pure carrot extracts, and clean food-making additives",
  },
];

const products = [
  {
    name: "Ijebu Yellow Garri",
    slug: "ijebu-yellow-garri",
    categorySlug: "african-foods",
    shortDescription:
      "Crisp, pleasantly sour, and 100% sand-free. Roasted clean from fresh cassava.",
    fullDescription:
      "Forget garri that leaves sand at the bottom of your cup. Our Ijebu Yellow Garri is made from fresh cassava, fermented properly, and pan-roasted in clean stainless-steel setups. Sifted three times for a smooth, sand-free crunch—perfect for drinking cold or making light, smooth eba.",
    images: ["/images/garri.jpeg"],
    price: 3200,
    unit: "1kg",
    nutritionSpecs: {
      Carbohydrates: "84g per 100g",
      DietaryFiber: "3.5g per 100g",
      Calories: "360 kcal per 100g",
    },
    stockCount: 50,
    inStock: true,
    nafdacNumber: "08-7241",
    certifications: ["100% Natural", "Sand-Free", "NAFDAC Registered"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "How We Ferment & Pan-Roast Our Sand-Free Garri",
      videoUrl: "/videos/garri-manufacturing.mp4",
      posterUrl: "/images/garri.jpeg",
      duration: "1:10",
      categoryName: "African Foods",
      highlights: [
        "Clean Stainless Pan Roasting",
        "Sifted 3 Times for Zero Sand",
        "Sealed for Freshness",
      ],
    },
    seoTitle: "Ijebu Yellow Garri 1kg – Mervida by GFO Foods",
    seoDescription:
      "Buy crisp, clean Ijebu Yellow Garri. 100% sand-free, naturally fermented.",
  },
  {
    name: "Unrefined Red Palm Oil",
    slug: "unrefined-red-palm-oil",
    categorySlug: "african-foods",
    shortDescription:
      "Pure, rich red palm oil that smells like home. No fake color, no chemicals.",
    fullDescription:
      "Pure red palm oil pressed directly from fresh oil palm fruits with zero heat bleaching or chemical additives. Packed with natural Vitamin E and rich color to give your stews that deep, authentic taste and mouthwatering aroma.",
    images: ["/images/palm-oil.jpeg"],
    price: 4500,
    unit: "1L",
    nutritionSpecs: {
      NaturalColor: "Rich Red Palm Pigment",
      VitaminE: "15mg per 100g",
      NaturalFats: "100% Pure Plant Oil",
    },
    stockCount: 40,
    inStock: true,
    nafdacNumber: "08-8319",
    certifications: ["100% Unrefined", "No Chemicals", "Export Sealed"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "Pressing Fresh Palm Fruit & Settling Clean Oil",
      videoUrl: "/videos/palm-oil-manufacturing.mp4",
      posterUrl: "/images/palm-oil.jpeg",
      duration: "0:55",
      categoryName: "African Foods",
      highlights: [
        "No Chemical Bleach",
        "Natural Rich Red Color",
        "Tamper-Evident Sealed Bottle",
      ],
    },
    seoTitle: "Unrefined Red Palm Oil 1L – Mervida by GFO Foods",
    seoDescription:
      "Pure unrefined red palm oil. Naturally rich in Vitamin E, zero chemical bleaching.",
  },
  {
    name: "African Multipurpose Spice Blend",
    slug: "african-multipurpose-spice-blend",
    categorySlug: "african-foods",
    shortDescription:
      "Whole ground herbs and peppers. 0% MSG, 0% salt fillers, 100% real flavor.",
    fullDescription:
      "A rich blend of dried ginger, garlic, calabash nutmeg (ehuru), and local peppers. We grind real sun-dried herbs whole so you get maximum flavor without cheap salt fillers or artificial MSG.",
    images: ["/images/spices.jpg"],
    price: 1800,
    unit: "150g",
    nutritionSpecs: {
      Sodium: "Zero Added Salt",
      Fillers: "0% Artificial Additives",
    },
    stockCount: 65,
    inStock: true,
    nafdacNumber: "08-9102",
    certifications: ["No MSG", "100% Whole Herb Ground", "Freshness Sealed Jar"],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    processVideo: {
      title: "Sun-Drying & Grinding Our Herb Seasoning",
      videoUrl: "/videos/spices-manufacturing.mp4",
      posterUrl: "/images/spices.jpg",
      duration: "0:45",
      categoryName: "African Foods",
      highlights: [
        "Real Ground Herbs",
        "Zero MSG or Fake Salt",
        "Freshness Sealed Jar",
      ],
    },
    seoTitle: "African Multipurpose Spice Blend – Mervida by GFO Foods",
    seoDescription:
      "All-natural African spice blend with zero MSG or fillers. Real ground herbs.",
  },
  {
    name: "Sun-Dried Plantain Flour",
    slug: "sun-dried-plantain-flour",
    categorySlug: "african-foods",
    shortDescription:
      "Gluten-free flour milled from 100% green unripe plantains. Easy on the stomach.",
    fullDescription:
      "Made from fresh green unripe plantains, sun-dried and ground into a smooth flour. Naturally gluten-free, light on digestion, and packed with fiber and potassium. Great for baking breads or preparing a healthy, comforting swallow.",
    images: ["/images/plantain-flower.jpeg"],
    price: 2800,
    unit: "1kg",
    nutritionSpecs: {
      Calories: "350 kcal per 100g",
      Potassium: "499mg per 100g",
      Gluten: "0% (Gluten-Free)",
    },
    stockCount: 45,
    inStock: true,
    nafdacNumber: "08-5520",
    certifications: ["Gluten-Free", "High Fiber", "NAFDAC Registered"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "Drying & Milling Green Unripe Plantains",
      videoUrl: "/videos/plantain-flour-manufacturing.mp4",
      posterUrl: "/images/plantain-flower.jpeg",
      duration: "1:00",
      categoryName: "African Foods",
      highlights: [
        "100% Green Unripe Plantains",
        "No Artificial Additives",
        "Gluten-Free Clean Facility",
      ],
    },
    seoTitle: "Sun-Dried Plantain Flour 1kg – Mervida by GFO Foods",
    seoDescription:
      "Gluten-free plantain flour for healthy baking and smooth swallow recipes.",
  },
  {
    name: "Cold-Pressed Virgin Coconut Oil",
    slug: "cold-pressed-virgin-coconut-oil",
    categorySlug: "baking-ingredients",
    shortDescription:
      "Raw cold-pressed coconut oil. Sweet fresh aroma, perfect for clean baking.",
    fullDescription:
      "Cold-extracted from fresh coconut meat with zero high heat or chemical bleaching. It retains its natural coconut aroma and clean fats—making it a wonderful butter replacement for baking pastries, frying, and daily cooking.",
    images: ["/images/coconut-oil.jpg"],
    price: 4800,
    unit: "500ml",
    nutritionSpecs: {
      GoodFats: "50% Lauric Acid",
      Calories: "862 kcal per 100ml",
      TransFat: "0g",
    },
    stockCount: 35,
    inStock: true,
    nafdacNumber: "08-6610",
    certifications: ["Raw Virgin Grade", "Cold-Pressed Without Heat", "Non-GMO"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "Cold Pressing & Filtering Fresh Coconuts",
      videoUrl: "/videos/coconut-oil-manufacturing.mp4",
      posterUrl: "/images/coconut-oil.jpg",
      duration: "1:05",
      categoryName: "Baking Ingredients",
      highlights: [
        "Pressed Cold Without Heat",
        "Great for High-Heat Baking",
        "100% Pure & Clear",
      ],
    },
    seoTitle: "Cold-Pressed Virgin Coconut Oil 500ml – Mervida",
    seoDescription:
      "Raw cold-pressed virgin coconut oil for baking, cooking, and healthy nutrition.",
  },
  {
    name: "Natural Carrot Color Oil (Beta-Carotene)",
    slug: "food-grade-carrot-extract-oil",
    categorySlug: "food-chemicals",
    shortDescription:
      "Pure carrot oil rich in natural Beta-Carotene. Gives foods a rich, natural yellow-orange color.",
    fullDescription:
      "A concentrated natural oil made from fresh carrots. It gives foods, baked goods, and butter a beautiful natural yellow-orange color—without using fake chemical dyes or artificial colors.",
    images: ["/images/carrot-oil.jpg"],
    price: 6500,
    unit: "250ml",
    nutritionSpecs: {
      NaturalColor: "Pure Carrot Beta-Carotene",
      Use: "Natural Color for Foods & Baking",
      Grade: "Food-Grade Plant Extract",
    },
    stockCount: 25,
    inStock: true,
    nafdacNumber: "08-9941",
    certifications: [
      "100% Food-Grade",
      "Natural Plant Color",
      "Lab Tested & Certified",
    ],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    processVideo: {
      title: "Extracting Pure Natural Oil From Fresh Carrots",
      videoUrl: "/videos/carrot-oil-manufacturing.mp4",
      posterUrl: "/images/carrot-oil.jpg",
      duration: "1:20",
      categoryName: "Natural Food Colorants",
      highlights: [
        "Natural Plant Color",
        "Safe for Baking & Cooking",
        "Clean Batch Bottled",
      ],
    },
    seoTitle: "Natural Carrot Color Oil 250ml – Mervida",
    seoDescription:
      "Concentrated natural carrot oil for safe, plant-based food coloring.",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const { categorySlug, ...product } of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: categorySlug },
    });
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId: category.id },
      create: { ...product, categoryId: category.id },
    });
  }

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      whatsappMessageTemplate:
        "Hello GFO Foods! 👋\n\nI'd like to place an order:\n\n🛒 *My Order:*\n{items}\n\n💰 *Estimated Total: ₦{total}*\n\nPlease confirm availability, final pricing, and delivery options. Thank you!",
      businessName: "GFO Foods Limited",
      carouselImages: [
        "/images/garri.jpeg",
        "/images/palm-oil.jpeg",
        "/images/plantain-flower.jpeg",
      ],
    },
  });

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
