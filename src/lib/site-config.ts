/**
 * Site Configuration
 *
 * All niche-specific text and settings live here.
 * To reuse this CMS for a different niche, edit this file only.
 */

export const siteConfig = {
  // ── Core identity ──────────────────────────────────────────
  name: 'أدوات البريد',
  tagline: 'دليلك لأدوات البريد الإلكتروني',
  url: process.env.SITE_URL || 'https://example.com',
  locale: 'ar_AR',
  lang: 'ar',
  dir: 'rtl' as const,
  defaultLanguage: 'ar',

  // ── SEO defaults ───────────────────────────────────────────
  seo: {
    titleDefault: 'أدوات البريد — أفضل أدوات النشرات البريدية والتسويق بالإيميل',
    titleTemplate: '%s — أدوات البريد',
    description:
      'مراجعات ومقارنات عملية تساعدك تختار أداة النشرات البريدية والتسويق بالإيميل المناسبة لصناع المحتوى العرب',
  },

  // ── UTM source identifier ─────────────────────────────────
  utmSource: 'adawat-albarid',

  // ── Homepage ───────────────────────────────────────────────
  hero: {
    badge: 'دليلك لأدوات البريد الإلكتروني',
    title: 'اختر أداة النشرات البريدية المناسبة لمشروعك',
    description:
      'مراجعات صادقة ومقارنات عملية لأشهر أدوات التسويق بالإيميل والنشرات البريدية، مصممة خصيصًا لصناع المحتوى والمسوقين العرب.',
    ctaPrimary: 'تصفح المراجعات',
    ctaSecondary: 'قارن بين الأدوات',
  },

  startHere: {
    title: 'ابدأ من هنا',
    description: 'لا تعرف من أين تبدأ؟ هذه الأدلة تساعدك تختار بسرعة.',
    cards: [
      {
        href: '/reviews',
        title: 'مراجعات الأدوات',
        description: 'مراجعات تفصيلية لكل أداة بريد إلكتروني — الميزات والعيوب والتسعير',
      },
      {
        href: '/comparisons',
        title: 'مقارنات مباشرة',
        description: 'مقارنات عملية بين الأدوات المتنافسة لمساعدتك في اتخاذ القرار',
      },
      {
        href: '/guides',
        title: 'أدلة الأفضل',
        description: 'أفضل الأدوات لكل حالة استخدام — للمبتدئين والمتقدمين',
      },
    ],
  },

  // ── Section titles ─────────────────────────────────────────
  sections: {
    latestArticles: 'أحدث المقالات',
    latestReviews: 'أحدث المراجعات',
    latestComparisons: 'أحدث المقارنات',
    guides: 'الأدلة',
    viewAll: 'عرض الكل',
  },

  // ── Trust strip ────────────────────────────────────────────
  trust: {
    title: 'لماذا تثق بنا؟',
    items: [
      {
        title: 'تجربة حقيقية',
        description: 'كل مراجعة مبنية على تجربة فعلية للأداة وليست مجرد نقل من مصادر أخرى',
      },
      {
        title: 'تقييم موضوعي',
        description: 'نقدم الميزات والعيوب بصراحة لمساعدتك في اتخاذ القرار الأفضل',
      },
      {
        title: 'محتوى عربي أصيل',
        description: 'محتوى مكتوب بالعربية من البداية وليس ترجمة آلية من مصادر أجنبية',
      },
    ],
    disclosure:
      'هذا الموقع يحتوي على روابط تسويقية (affiliate links). عند الشراء من خلال هذه الروابط، قد نحصل على عمولة دون أي تكلفة إضافية عليك.',
    disclosureLink: 'اقرأ سياسة الإفصاح الكاملة',
  },

  // ── Navigation ─────────────────────────────────────────────
  nav: [
    { href: '/', label: 'الرئيسية' },
    { href: '/reviews', label: 'المراجعات' },
    { href: '/comparisons', label: 'المقارنات' },
    { href: '/guides', label: 'الأدلة' },
    { href: '/about', label: 'عن الموقع' },
  ],

  // ── Footer ─────────────────────────────────────────────────
  footer: {
    description:
      'موقع عربي متخصص في مراجعة ومقارنة أدوات النشرات البريدية والتسويق بالإيميل. نساعدك تختار الأداة المناسبة بمراجعات صادقة ومقارنات عملية.',
    contentLinks: [
      { href: '/reviews', label: 'المراجعات' },
      { href: '/comparisons', label: 'المقارنات' },
      { href: '/guides', label: 'الأدلة' },
    ],
    siteLinks: [
      { href: '/about', label: 'عن الموقع' },
      { href: '/disclosure', label: 'سياسة الإفصاح' },
    ],
    copyright: 'أدوات البريد. جميع الحقوق محفوظة.',
    affiliateNotice: 'يحتوي هذا الموقع على روابط تسويقية.',
    readMore: 'اقرأ المزيد',
    contentColumnTitle: 'المحتوى',
    siteColumnTitle: 'الموقع',
  },

  // ── Content type labels (Arabic) ───────────────────────────
  typeLabels: {
    review: 'مراجعة',
    comparison: 'مقارنة',
    best: 'الأفضل',
    problem: 'حلول',
    alternative: 'بدائل',
  } as Record<string, string>,

  // ── Content section mapping ────────────────────────────────
  sectionLabels: {
    review: 'المراجعات',
    comparison: 'المقارنات',
    best: 'الأدلة',
    problem: 'الأدلة',
    alternative: 'الأدلة',
  } as Record<string, string>,

  sectionLinks: {
    review: '/reviews',
    comparison: '/comparisons',
    best: '/guides',
    problem: '/guides',
    alternative: '/guides',
  } as Record<string, string>,

  // ── Article page labels ────────────────────────────────────
  article: {
    productsTitle: 'الأدوات المذكورة في هذا المقال',
    tryCta: 'جرّب الأداة',
    disclosure:
      'يحتوي هذا المقال على روابط تسويقية. عند الشراء من خلالها قد نحصل على عمولة دون تكلفة إضافية عليك.',
    disclosureLink: 'اقرأ المزيد',
    relatedTitle: 'مقالات ذات صلة',
    breadcrumbHome: 'الرئيسية',
    notFound: 'غير موجود',
  },

  // ── Listing page metadata ──────────────────────────────────
  pages: {
    reviews: {
      title: 'المراجعات',
      description: 'مراجعات تفصيلية لأدوات النشرات البريدية والتسويق بالإيميل',
      subtitle:
        'مراجعات تفصيلية لأدوات النشرات البريدية والتسويق بالإيميل — الميزات والعيوب والتسعير وتجربة الاستخدام',
      empty: 'لا توجد مراجعات منشورة بعد.',
    },
    comparisons: {
      title: 'المقارنات',
      description: 'مقارنات عملية بين أدوات النشرات البريدية والتسويق بالإيميل',
      subtitle:
        'مقارنات عملية بين أدوات النشرات البريدية والتسويق بالإيميل لمساعدتك في اتخاذ القرار',
      empty: 'لا توجد مقارنات منشورة بعد.',
    },
    guides: {
      title: 'الأدلة',
      description:
        'أدلة شاملة لأفضل أدوات النشرات البريدية وحلول المشكلات الشائعة والبدائل المتاحة',
      subtitle: 'أدلة شاملة لأفضل الأدوات وحلول المشكلات الشائعة والبدائل المتاحة',
      empty: 'لا توجد أدلة منشورة بعد.',
      bestTitle: 'أدلة الأفضل',
      problemTitle: 'حلول المشكلات',
      alternativeTitle: 'البدائل',
    },
    about: {
      title: 'عن الموقع',
      description:
        'تعرف على موقع أدوات البريد ورسالتنا في مساعدة صناع المحتوى العرب في اختيار أدوات النشرات البريدية',
    },
    disclosure: {
      title: 'سياسة الإفصاح',
      description: 'سياسة الإفصاح عن الروابط التسويقية في موقع أدوات البريد',
    },
  },

  // ── Newsletter ─────────────────────────────────────────────
  newsletter: {
    title: 'اشترك في نشرتنا البريدية',
    description: 'احصل على أحدث المراجعات والمقارنات مباشرة في بريدك الإلكتروني.',
    placeholder: 'بريدك الإلكتروني',
    button: 'اشترك الآن',
    success: 'تم الاشتراك بنجاح!',
    error: 'حدث خطأ. حاول مرة أخرى.',
    duplicate: 'هذا البريد مسجل بالفعل.',
  },
} as const;
