export const CATEGORIES = [
  { id: 'anti-aging', name: 'Anti-Aging', count: 12 },
  { 
    id: 'brands', 
    name: 'Brands', 
    count: 28,
    children: [
      { id: 'apoxar', name: 'Apoxar', count: 18 },
      { id: 'apoxer', name: 'Apoxer', count: 10 }
    ]
  },
  { 
    id: 'hair-skin-sleep', 
    name: 'Hair, Skin & Sleep', 
    count: 14,
    children: [
      { id: 'accutane', name: 'Accutane', count: 4 },
      { id: 'finasteride', name: 'Finasteride', count: 5 },
      { id: 'zopiclone', name: 'Zopiclone', count: 5 }
    ]
  },
  { 
    id: 'hgh-pertides', 
    name: 'HGH & Pertides', 
    count: 16,
    children: [
      { id: 'hgh-growth-hormone', name: 'HGH - Growth Hormone', count: 6 },
      { id: 'hgh-176-191', name: 'HGH-176-191', count: 3 },
      { id: 'igf-1-insulin-growth-factor', name: 'IGF-1 – Insulin Growth Factor', count: 4 },
      { id: 'pt-141', name: 'PT-141', count: 3 }
    ]
  },
  { 
    id: 'injectable-steroids', 
    name: 'Injectable Steroids', 
    count: 42,
    children: [
      { id: 'boldenones-eq', name: 'Boldenones - EQ', count: 6 },
      { id: 'nandrolone', name: 'Nandrolone', count: 8 },
      { id: 'sustanon', name: 'Sustanon', count: 7 },
      { id: 'testosterone', name: 'Testosterone', count: 14 },
      { id: 'testosterone-400', name: 'Testosterone 400', count: 7 }
    ]
  },
  { 
    id: 'oral-steroids', 
    name: 'Oral Steroids', 
    count: 36,
    children: [
      { id: 'anadrol-oxymetholone', name: 'Anadrol - Oxymetholone', count: 5 },
      { id: 'anavar-oxandrolone', name: 'Anavar - Oxandrolone', count: 8 },
      { id: 'dianabol', name: 'Dianabol', count: 6 },
      { id: 'proviron-mesterolone', name: 'Proviron - Mesterolone', count: 4 },
      { id: 'turinabol', name: 'Turinabol', count: 5 },
      { id: 'winstrol-stanozolol', name: 'Winstrol - Stanozolol', count: 8 }
    ]
  },
  { 
    id: 'post-cycle-therapy', 
    name: 'Post Cycle Therapy', 
    count: 24,
    children: [
      { id: 'anti-estrogen', name: 'Anti Estrogen', count: 6 },
      { id: 'arimidex-anastrozole', name: 'Arimidex - Anastrozole', count: 4 },
      { id: 'aromasin-exemestane', name: 'Aromasin - Exemestane', count: 3 },
      { id: 'clomid-clomiphene-citrate', name: 'Clomid - Clomiphene Citrate', count: 3 },
      { id: 'femara-letrozole', name: 'Femara - Letrozole', count: 2 },
      { id: 'hcg-gonadotropin', name: 'HCG - Gonadotropin', count: 2 },
      { id: 'ketotifen', name: 'Ketotifen', count: 1 },
      { id: 'nolvadex-tamoxifen', name: 'Nolvadex - Tamoxifen', count: 2 },
      { id: 'skin-hair-more', name: 'Skin, Hair & More', count: 1 }
    ]
  },
  { 
    id: 'sarms', 
    name: 'SARMs', 
    count: 22,
    children: [
      { id: 'andarine-s4', name: 'Andarine - S4', count: 2 },
      { id: 'cardarine-gw501516', name: 'Cardarine - GW501516', count: 4 },
      { id: 'ligandrol-lgd-4033', name: 'Ligandrol - LGD-4033', count: 3 },
      { id: 'mk-677-ibutamoren', name: 'MK-677 - Ibutamoren', count: 5 },
      { id: 'ostarine-mk-2866', name: 'Ostarine - MK-2866', count: 3 },
      { id: 'rad-140-testolone', name: 'RAD-140 - Testolone', count: 3 },
      { id: 'stenabolic-sr9009', name: 'Stenabolic - SR9009', count: 1 },
      { id: 'yk-11', name: 'YK-11', count: 1 }
    ]
  },
  { 
    id: 'sex-health', 
    name: 'Sex Health', 
    count: 8,
    children: [
      { id: 'cialis', name: 'Cialis', count: 4 },
      { id: 'viagra', name: 'Viagra', count: 4 }
    ]
  },
  { 
    id: 'smart-drugs', 
    name: 'Smart Drugs', 
    count: 12,
    children: [
      { id: '3fpm-stimulant', name: '3FPM (Stimulant)', count: 2 },
      { id: 'cerebral-smart-drug', name: 'Cerebral (Smart Drug) stack - Innovagen', count: 2 },
      { id: 'modafinil', name: 'Modafinil', count: 3 },
      { id: 'noopept-smart-drug', name: 'Noopept (Smart Drug) 20mg/ml - Innovagen', count: 2 },
      { id: 'pao-stack', name: 'PAO Stack (Smart Drug) 500mg/30caps - Innovagen', count: 1 },
      { id: 'smart-drug-innovagen', name: 'Smart Drug 25mg/30tabs - Innovagen', count: 2 }
    ]
  },
  { 
    id: 'syringes-accessories', 
    name: 'Syringes & Accessories', 
    count: 15,
    children: [
      { id: 'drawing-needles', name: 'Drawing Needles', count: 3 },
      { id: 'syringes-hgh-peptides', name: 'Syringes for HGH,HCG, Peptides,', count: 4 },
      { id: 'syringes-steroids', name: 'Syringes for Steroid Injections', count: 5 },
      { id: 'water-injections', name: 'Water For Injections', count: 3 }
    ]
  },
  { id: 'uncategorized', name: 'Uncategorized', count: 4 },
  { 
    id: 'weight-loss', 
    name: 'Weight Loss', 
    count: 14,
    children: [
      { id: 'clenbuterol', name: 'Clenbuterol', count: 5 },
      { id: 'cytomel-t3', name: 'Cytomel - T3', count: 4 },
      { id: 'meridia', name: 'Meridia', count: 2 },
      { id: 'weight-loss-blends', name: 'Weight Loss Blends', count: 3 }
    ]
  }
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Testosterone Cypionate 250mg/ml – Apoxar",
    category: "Injectable Steroids",
    categorySlug: "injectable-steroids",
    price: 80.00,
    rating: 0,
    popularity: 100,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-testosterone-cypionate-online-in-canada-steroids-apoxar-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-testosterone-cypionate-online-in-canada-steroids-apoxar.jpg",
    description: "Testosterone Cypionate 250mg/ml by Apoxar is an injectable testosterone ester known for promoting steady sustained muscle hypertrophy, strength increments, and peak physical conditioning.",
    dosage: "250mg/ml",
    form: "10ml multi-dose vial",
    inStock: true
  },
  {
    id: 2,
    name: "Testosterone Enanthate 250mg/ml – NovoPharm",
    category: "Injectable Steroids",
    categorySlug: "injectable-steroids",
    price: 80.00,
    rating: 0,
    popularity: 98,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/novo-pharm_testosterone_enanthate-1-1-300x300.jpg",
    hoverImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/test-e_1-1-1-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/novo-pharm_testosterone_enanthate-1-1.jpg",
    description: "NovoPharm Testosterone Enanthate delivers pure pharmaceutical-grade testosterone in an enanthate ester. Trusted by athletes for reliable hormone levels and steady lean gains.",
    dosage: "250mg/ml",
    form: "10ml multi-dose vial",
    inStock: true
  },
  {
    id: 3,
    name: "Anavar – Oxandrolone 20mg/50tabs – Apoxar",
    category: "Anavar - Oxandrolone",
    categorySlug: "oral-steroids",
    price: 105.00,
    rating: 0,
    popularity: 96,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anavar-oxandrolone-online-in-canada-steroids-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anavar-oxandrolone-online-in-canada-steroids.jpg",
    description: "Apoxar Anavar (Oxandrolone) 20mg tabs are the gold standard for cutting cycles, dry hard muscle gains, increased vascularity, and fat reduction with zero water retention.",
    dosage: "20mg per tab",
    form: "50 tablets per bottle",
    inStock: true
  },
  {
    id: 4,
    name: "Trenbolone Acetate (Fina) 100mg/ml – NovoPharm",
    category: "Injectable Steroids",
    categorySlug: "injectable-steroids",
    price: 65.00,
    rating: 2.5,
    popularity: 94,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/photo_2023-02-05_08-29-45-1-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/photo_2023-02-05_08-29-45-1.jpg",
    description: "NovoPharm Trenbolone Acetate is a fast-acting, high-potency anabolic compound designed to rapidly stimulate muscle hardness, aggressive density, and fat loss.",
    dosage: "100mg/ml",
    form: "10ml multi-dose vial",
    inStock: true
  },
  {
    id: 5,
    name: "Anadrol – Oxymetholone 50mg/50tabs",
    category: "Anadrol - Oxymetholone",
    categorySlug: "oral-steroids",
    price: 110.00,
    rating: 5.0,
    popularity: 92,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anadrol-online-in-canada-steroids-1-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anadrol-online-in-canada-steroids-1.jpg",
    description: "Powerful oral bulking agent Oxymetholone 50mg. Renowned for rapid cellular expansion, massive strength surges, and intense workout pumps.",
    dosage: "50mg per tab",
    form: "50 tablets",
    inStock: true
  },
  {
    id: 6,
    name: "10 (TEN) 22G 1.5″ 3ml Syringe with Needle",
    category: "Syringes & Accessories",
    categorySlug: "syringes-accessories",
    price: 10.00,
    rating: 0,
    popularity: 90,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/21g_3ml_syringe_with_needle_2-300x300.png",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/21g_3ml_syringe_with_needle_2.png",
    description: "Pack of 10 medical-grade sterile disposable syringes with 22 Gauge 1.5 inch needles. Smooth plunger movement and ultra-sharp bevel.",
    dosage: "3ml capacity",
    form: "10 individually wrapped sterile units",
    inStock: true
  },
  {
    id: 7,
    name: "10 (TEN) 23G x 1″ 3ml Syringe with Needle",
    category: "Syringes & Accessories",
    categorySlug: "syringes-accessories",
    price: 10.00,
    rating: 0,
    popularity: 88,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/23g_syringe_2-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/23g_syringe_2.jpg",
    description: "Precision 23 Gauge 1-inch disposable syringe combo. Ideal for accurate dosing, smooth administration, and minimal post-injection discomfort.",
    dosage: "3ml capacity",
    form: "10 individually sealed units",
    inStock: true
  },
  {
    id: 8,
    name: "Arimidex – Anastrozole (Estrogen Blocker) 1mg/50tabs – Apoxar",
    category: "Arimidex - Anastrozole",
    categorySlug: "post-cycle-therapy",
    price: 95.00,
    rating: 0,
    popularity: 86,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-arimidex-anastrozole-pct-online-in-canada-steroids-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-arimidex-anastrozole-pct-online-in-canada-steroids.jpg",
    description: "Apoxar Arimidex 1mg (Anastrozole). Potent aromatase inhibitor used during cycles to prevent water retention and control serum estradiol.",
    dosage: "1mg per tablet",
    form: "50 tablets per bottle",
    inStock: true
  },
  {
    id: 9,
    name: "Masteron (Drostanolone) Enanthate 200mg/ml – Apoxar",
    category: "Injectable Steroids",
    categorySlug: "injectable-steroids",
    price: 140.00,
    rating: 0,
    popularity: 84,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-masteron-enanthate-online-in-canada-steroids-apoxar-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-masteron-enanthate-online-in-canada-steroids-apoxar.jpg",
    description: "Apoxar Drostanolone Enanthate 200mg/ml. Provides exceptional aesthetic hardening, chiseled definition, and natural anti-estrogenic characteristics.",
    dosage: "200mg/ml",
    form: "10ml multi-dose vial",
    inStock: true
  },
  {
    id: 10,
    name: "HGH – Somatropin 10iu/vial – Apoxar",
    category: "HGH - Growth Hormone",
    categorySlug: "hgh-pertides",
    price: 70.00,
    rating: 0,
    popularity: 82,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/somatropin-10iu-injection-1-300x300.jpg",
    hoverImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/apoxar_hgh_10iu-1-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/apoxar_hgh_10iu-1.jpg",
    description: "Recombinant Human Growth Hormone Somatropin 10iu. Enhances tissue regeneration, fat oxidation, skin vitality, deep sleep, and IGF-1 production.",
    dosage: "10iu per vial",
    form: "Lyophilized powder vial",
    inStock: true
  },
  {
    id: 11,
    name: "Trenbolone Enanthate 200mg/ml – NovoPharm",
    category: "Injectable Steroids",
    categorySlug: "injectable-steroids",
    price: 95.00,
    rating: 5.0,
    popularity: 80,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/photo_2023-02-05_08-29-47-1-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/photo_2023-02-05_08-29-47-1.jpg",
    description: "NovoPharm Trenbolone Enanthate provides a prolonged release curve for heavy anabolic stimulation with twice-weekly administration.",
    dosage: "200mg/ml",
    form: "10ml multi-dose vial",
    inStock: true
  },
  {
    id: 12,
    name: "Anavar – Oxandrolone 20mg/50tabs – Apoxar",
    category: "Apoxar",
    categorySlug: "brands",
    price: 105.00,
    rating: 0,
    popularity: 78,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anavar-oxandrolone-online-in-canada-steroids-1-300x300.jpg",
    fullImage: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anavar-oxandrolone-online-in-canada-steroids-1.jpg",
    description: "Verified Apoxar Oxandrolone batch. Pure 20mg tablets tested for precise dosage integrity, premium bioavailability, and lean gains.",
    dosage: "20mg per tablet",
    form: "50 tablets per bottle",
    inStock: true
  }
];

export const LATEST_PRODUCTS = [
  {
    id: 101,
    name: "Proffessional Gym Closet",
    regularPrice: 16000.00,
    salePrice: 14800.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2026/04/b64985_ab52764f0bf1429a8acba7bda68cfc5cmv2-100x100.jpg"
  },
  {
    id: 102,
    name: "adjustable workout bench online",
    price: 550.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2026/03/71Q7j-QFJsL._AC_UF10001000_QL80_-100x100.jpg"
  },
  {
    id: 103,
    name: "best adjustable dumbbells",
    price: 750.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2026/03/24KG_-_image_1-100x100.webp"
  },
  {
    id: 104,
    name: "Anavar Troche (Oxandrolone Troches)",
    price: 170.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2026/01/2-bottles-floating-size-00-no-tag-01-100x100.jpg"
  }
];

export const BEST_SELLING = [
  {
    id: 1,
    name: "Testosterone Cypionate 250mg/ml - Apoxar",
    price: 80.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-testosterone-cypionate-online-in-canada-steroids-apoxar-100x100.jpg"
  },
  {
    id: 2,
    name: "Testosterone Enanthate 250mg/ml - NovoPharm",
    price: 80.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/novo-pharm_testosterone_enanthate-1-1-100x100.jpg"
  },
  {
    id: 3,
    name: "Anavar - Oxandrolone 20mg/50tabs - Apoxar",
    price: 105.00,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anavar-oxandrolone-online-in-canada-steroids-100x100.jpg"
  },
  {
    id: 4,
    name: "Trenbolone Acetate (Fina) 100mg/ml - NovoPharm",
    price: 65.00,
    rating: 2.5,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/photo_2023-02-05_08-29-45-1-100x100.jpg"
  }
];

export const TOP_RATED = [
  {
    id: 105,
    name: "Nolvadex - Tamoxifen (Anti-Estrogen, PCT) 20mg/50tabs - NovoPharm",
    price: 91.00,
    rating: 5.0,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/novo-pharm_nolvadex_20mg_50_tabs-100x100.jpg"
  },
  {
    id: 5,
    name: "Anadrol – Oxymetholone 50mg/50tabs",
    price: 110.00,
    rating: 5.0,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/buy-anadrol-online-in-canada-steroids-1-300x300.jpg"
  },
  {
    id: 11,
    name: "Trenbolone Enanthate 200mg/ml – NovoPharm",
    price: 95.00,
    rating: 5.0,
    image: "https://roidstarlabs.com/wp-content/uploads/2024/01/photo_2023-02-05_08-29-47-1-300x300.jpg"
  }
];

export const GALLERY_IMAGES = [
  "https://roidstarlabs.com/wp-content/uploads/2024/01/diuretics-liver-heart-PhotoRoom.png-PhotoRoom-405x400-1-removebg-preview-280x280.png",
  "https://roidstarlabs.com/wp-content/uploads/2024/01/pharmacy-grade-PhotoRoom.png-PhotoRoom-100x100.png",
  "https://roidstarlabs.com/wp-content/uploads/2024/01/istockphoto-534682529-170667a-280x280.webp",
  "https://roidstarlabs.com/wp-content/uploads/2024/01/images-removebg-preview-100x100.png"
];
