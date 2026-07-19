// No static image imports needed - assets are served from the public/ folder directly as strings.

export type Locale = 'ar' | 'en';
export type SectionHash = 'about' | 'contact' | 'projects' | 'vision' | 'blog' | '';

type NavLink = {
  hash: SectionHash;
  href: {
    hash: SectionHash;
    pathname: '/' | '/about' | '/contact' | '/projects' | '/blog';
  };
  label: string;
};

export type ProjectCard = {
  amenities?: string[];
  area_name?: string;
  canonical_slug?: string;
  city?: string;
  description: string;
  cover_url?: string;
  delivery_date?: string;
  details: string[];
  faq_blocks?: Array<{ answer: string; question: string }>;
  gallery?: string[];
  governorate?: string;
  indexable?: boolean;
  location: string;
  meta_description?: string;
  og_description?: string;
  og_image?: string;
  og_title?: string;
  payment_plan_summary?: string;
  project_type?: string;
  seo_title?: string;
  slug: string;
  stats: Array<{ label: string; value: string }>;
  status?: string;
  title: string;
  unit_types?: string[];
};

export type BlogPost = {
  author_name?: string;
  content: string[];
  cover_url?: string;
  created_at?: string;
  date: string;
  excerpt: string;
  expert_source?: string;
  faq_blocks?: Array<{ answer: string; question: string }>;
  indexable?: boolean;
  key_takeaways?: string[];
  meta_description?: string;
  og_description?: string;
  og_image?: string;
  og_title?: string;
  published_at?: string;
  reviewed_by?: string;
  seo_title?: string;
  slug: string;
  sources?: string[];
  tag: string;
  title: string;
  updated_at?: string;
};

type WhyInvestCol = {
  title: string;
  value: string;
  desc: string;
};

type ArchPillar = {
  step: string;
  title: string;
  detail: string;
};

type ArchMetric = {
  label: string;
  value: string;
};

export type SiteCopy = {
  arch: {
    eyebrow: string;
    titleFirst: string;
    titleSecond: string;
    description: string;
    statement: string;
    statementLabel: string;
    metrics: ArchMetric[];
    pillars: ArchPillar[];
  };
  about: {
    cta: string;
    eyebrow: string;
    paragraphs: string[];
    titleLines: [string, string];
    milestones: Array<{ year: string; title: string; description: string }>;
    cards: Array<{ label: string; value: string }>;
  };
  aboutLeadership: {
    imageUrl: string;
    name: string;
    position: string;
    quote: string;
  };
  aboutValues: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  footer: {
    contactTitle: string;
    description: string;
    links: NavLink[];
    location: string;
    privacy: string;
    rights: string;
    terms: string;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    description: string;
    formHeading: string;
    formNote: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    interestLabel: string;
    interestOptions: string[];
    button: string;
    detailsHeading: string;
    addressLabel: string;
    address: string;
    mapLabel: string;
    phone: string;
    email: string;
    socialHeading: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  hero: {
    badge: string;
    scrollLabel: string;
    subtitle: string;
    titleFirst: string;
    titleSecond: string;
    btnDownload: string;
    btnProjects: string;
    videoUrl?: string;
    posterUrl?: string;
  };
  lifestyle: {
    images?: string[];
    items: string[];
    titleFirst: string;
    titleSecond: string;
  };
  marquee: {
    first: string;
    second: string;
  };
  nav: {
    brand: string;
    links: NavLink[];
  };
  philosophy: {
    text: string;
  };
  projects: {
    description: string;
    items: ProjectCard[];
    titleFirst: string;
    titleSecond: string;
    cta: string;
  };
  blog: {
    title: string;
    description: string;
    items: BlogPost[];
    cta: string;
  };
  contactPage: {
    title: string;
    description: string;
    formTitle: string;
    infoTitle: string;
  };
  whyInvest: {
    eyebrow: string;
    titleFirst: string;
    titleSecond: string;
    description: string;
    cols: WhyInvestCol[];
  };
};

export const siteImages: {
  about: string;
  hero: string;
  lifestyle: string[];
  projects: string[];
} = {
  about: '/about-bg.webp',
  hero: '/hero-bg.webp',
  lifestyle: ['/hero-bg.webp', '/project-4.webp', '/project-3.webp', '/project-2.webp'],
  projects: ['/project-1.webp', '/project-2.webp', '/project-3.webp', '/project-4.webp'],
};

export const siteContent: Record<Locale, SiteCopy> = {
  ar: {
    arch: {
      eyebrow: 'النهج المميز',
      titleFirst: 'كيف نصنع',
      titleSecond: 'القيمة',
      description:
        'لا نبدأ من الواجهة، بل من الأثر الذي يجب أن يتركه المكان. من اختيار الموقع حتى تفاصيل التسليم، نبني تجربة متماسكة تحافظ على القيمة وترفع مستوى الحياة.',
      statementLabel: 'وعد الشهري',
      statement:
        'نرسم منطق المشروع أولًا: لماذا هذا الموقع، كيف تُعاش المساحات، وما الذي يجعل الأصل أكثر رسوخًا بمرور الوقت.',
      metrics: [
        { value: '3', label: 'محاور تقود كل مشروع' },
        { value: '1', label: 'رؤية موحدة من الفكرة حتى التسليم' },
        { value: '100%', label: 'تفاصيل تخدم الراحة والقيمة معًا' },
      ],
      pillars: [
        {
          step: '01',
          title: 'اختيار ذكي للموقع',
          detail: 'نبحث عن المواقع التي لا تبدو واعدة فقط، بل قادرة على تكوين طلب مستمر وصورة ذهنية قوية على المدى الطويل.',
        },
        {
          step: '02',
          title: 'تجربة سكنية متكاملة',
          detail: 'التخطيط والحركة والخصوصية والإضاءة والخدمات تُصاغ كمنظومة واحدة حتى تبدو الحياة داخل المشروع سهلة وطبيعية وراقية.',
        },
        {
          step: '03',
          title: 'تنفيذ يحفظ الأصل',
          detail: 'نختار الشركاء والخامات والتفاصيل التشغيلية بما يضمن أن يبقى المشروع جذابًا وعمليًا وقادرًا على حماية قيمته بعد التسليم.',
        },
      ],
    },
    nav: {
      brand: 'الشهري',
      links: [
        { hash: 'projects', href: { pathname: '/projects', hash: '' }, label: 'المشاريع' },
        { hash: 'about', href: { pathname: '/about', hash: '' }, label: 'من نحن' },
        { hash: 'blog', href: { pathname: '/blog', hash: '' }, label: 'المدونة' },
        { hash: 'contact', href: { pathname: '/contact', hash: '' }, label: 'تواصل' },
      ],
    },
    hero: {
      badge: 'الشهري للتطوير العقاري',
      titleFirst: 'نجعل استثمارك اليوم',
      titleSecond: 'علامة فارقة في المستقبل',
      subtitle: 'فصل جديد في قصتنا يبدأ اليوم… لنصنع غدًا يستحق أن يُحكى',
      scrollLabel: 'اكتشف للأسفل',
      btnDownload: 'تحميل ملف الشركة',
      btnProjects: 'تصفح مشاريعنا',
      videoUrl: '',
      posterUrl: '',
    },
    about: {
      eyebrow: 'الرؤية',
      titleLines: ['بناء', 'تاريخ من الفخامة'],
      paragraphs: [
        'في الشهري للتطوير العقاري لا نبني عقارات فقط، بل نصنع إرثًا يدوم. كل مشروع هو انعكاس لالتزامنا المطلق بالجودة، حيث تلتقي الرؤية المعمارية بالحرفية الاستثنائية.',
        'نبتكر مساحات مخصصة للنخبة، تمنح أسلوب حياة حصريًا تتجلى فيه العناية الدقيقة في كل تفصيلة.',
      ],
      milestones: [
        { year: '2012', title: 'البداية', description: 'تأسيس الشهري برؤية واضحة لإحداث ثورة في مفهوم السكن الفاخر.' },
        { year: '2018', title: 'البرج الأيقوني', description: 'إطلاق أول برج سكني ذكي بتصميم معماري حاز على جوائز دولية.' },
        { year: '2024', title: 'التوسع العالمي', description: 'بدء أولى مشاريعنا خارج الحدود مع الحفاظ على بصمتنا الفريدة.' },
      ],
      cta: 'قصتنا',
      cards: [
        { label: 'القيادة', value: 'Eng. Ahmed El Shihry' },
        { label: 'المقر', value: 'فيلا 472 - شمال الشويفات - أمام داون تاون - التجمع الخامس - القاهرة الجديدة 11835، مصر' },
        { label: 'الهوية', value: 'El Shihry Developments' }
      ],
    },
    aboutLeadership: {
      imageUrl: '',
      name: 'م/ أحمد الشهري',
      position: 'رئيس مجلس الإدارة',
      quote: 'نحن لا نبني جدراناً، نحن نصيغ فضاءات تحكي قصصاً من الرقي.',
    },
    aboutValues: {
      title: 'قيمنا الجوهرية',
      items: [
        { title: 'الخلود', description: 'تصاميم لا تتأثر بمرور الزمن وتزداد قيمة مع السنوات.' },
        { title: 'الدقة', description: 'كل مليمتر في مشاريعنا مدروس بعناية فائقة لضمان الكمال.' },
        { title: 'الإرث', description: 'نبني ليبقى اسمنا مرادفاً للجودة لأجيال قادمة.' },
      ],
    },
    philosophy: {
      text: 'الرفاهية الحقيقية لا تُرى فقط، بل تُحَس. إنها العناية الدقيقة بالتفاصيل الخفية، وتناغم النسب الذهبية، والوعد الصامت بالخلود في كل حجر.',
    },
    projects: {
      titleFirst: 'مشاريعنا',
      titleSecond: '',
      description: 'استكشف مجموعة من مشاريعنا التي تعكس رؤيتنا في الابتكار والجودة',
      cta: 'استكشف المشروع',
      items: [
        {
          slug: 'aurum-tower',
          title: 'برج أوروم',
          location: 'وسط المدينة',
          description: 'تحفة معمارية تعيد تعريف أفق المدينة، حيث تلتقي الرفاهية بالابتكار.',
          stats: [
            { label: 'الارتفاع', value: '300م' },
            { label: 'الوحدات', value: '150' },
            { label: 'التسليم', value: '2027' },
          ],
          details: ['إطلالات بانورامية', 'نادي صحي خاص', 'خدمة الكونسيرج الملكية'],
        },
        {
          slug: 'jasmine-estates',
          title: 'ضياع الياسمين',
          location: 'الريفيرا الساحلية',
          description: 'ملاذ هادئ يجمع بين سحر الطبيعة وفخامة التصميم العصري.',
          stats: [
            { label: 'المساحة', value: '500 فدان' },
            { label: 'الفيلات', value: '80' },
            { label: 'الشاطئ', value: 'خاص' },
          ],
          details: ['مسارات خضراء', 'مرسى لليخوت', 'نادي رياضي متكامل'],
        },
        {
          slug: 'lumina-towers',
          title: 'أبراج لومينا',
          location: 'الحي المالي',
          description: 'وجهة العمل والحياة المثالية في قلب المركز الاقتصادي النابض.',
          stats: [
            { label: 'المكاتب', value: 'مستوى A' },
            { label: 'التكنولوجيا', value: 'ذكية' },
            { label: 'الاستدامة', value: 'LEED' },
          ],
          details: ['مساحات عمل مرنة', 'مطاعم فاخرة', 'أمن 24/7'],
        },
        {
          slug: 'royal-penthouses',
          title: 'البنتهاوس الملكي',
          location: 'شارع الأفق',
          description: 'السكن فوق السحاب، حيث كل تفصيلة تحكي قصة من الرقي المتناهي.',
          stats: [
            { label: 'الطوابق', value: 'الأخيرة' },
            { label: 'المسبح', value: 'انفينيتي' },
            { label: 'المصعد', value: 'خاص' },
          ],
          details: ['تراس سماوي', 'جناح رئيسي ضخم', 'تشطيبات إيطالية'],
        },
      ],
    },
    blog: {
      title: 'رؤية الشهري',
      description: 'نظرة معمقة في عالم العقارات الفاخرة، الاستثمار، والابتكار المعماري.',
      cta: 'اقرأ المقال',
      items: [
        {
          slug: 'new-phase-launch',
          title: 'إطلاق المرحلة الجديدة بخطط سداد استثنائية',
          date: '15 أبريل 2026',
          tag: 'إطلاق جديد',
          excerpt: 'اكتشف الفرص الحصرية في أحدث مراحلنا الإنشائية مع مرونة غير مسبوقة.',
          content: [
            'أعلنت الشهري للتطوير العقاري اليوم عن طرح مرحلة جديدة من مشروع "أوروم" السكني.',
            'تتضمن هذه المرحلة وحدات متنوعة تلبي تطلعات النخبة الراغبين في سكن يجمع بين الخصوصية والفخامة.',
            'تتميز خطط السداد الجديدة بمرونة تصل إلى 10 سنوات، مما يجعلها فرصة استثمارية لا تعوض.',
          ],
        },
        {
          slug: 'location-strategy',
          title: 'لماذا يظل الموقع هو العنصر الأهم في الاستثمار؟',
          date: '02 أبريل 2026',
          tag: 'رؤية عقارية',
          excerpt: 'كيف نختار مواقع مشاريعنا لضمان نمو القيمة الرأسمالية لأصول عملائنا.',
          content: [
            'الموقع ليس مجرد إحداثيات، بل هو المستقبل.',
            'في الشهري، نقوم بدراسة التحولات العمرانية لعشر سنوات قادمة قبل اختيار أرض المشروع.',
            'نركز على القرب من المحاور الرئيسية، جودة الخدمات المحيطة، وندرة المواقع في المناطق الحيوية.',
          ],
        },
      ],
    },
    contactPage: {
      title: 'تواصل مع النخبة',
      description: 'نحن هنا لتصميم تجربتك العقارية التالية. فريقنا المتخصص في انتظارك.',
      formTitle: 'طلب مكالمة خاصة',
      infoTitle: 'المكاتب الإقليمية',
    },
    marquee: {
      first: 'الشهري للتطوير العقاري / عقارات فائقة الفخامة / الشهري للتطوير العقاري / عقارات فائقة الفخامة /',
      second: 'ما بعد الخيال / نصنع إرثًا خالدًا / ما بعد الخيال / نصنع إرثًا خالدًا /',
    },
    lifestyle: {
      titleFirst: 'أسلوب',
      titleSecond: 'العمل',
      images: siteImages.lifestyle,
      items: ['واجهات ذهبية', 'تصميمات ملكية', 'إطلالات بانورامية', 'سكينة ساحلية'],
    },
    whyInvest: {
      eyebrow: 'حفظ الثروات',
      titleFirst: 'أصول',
      titleSecond: 'مستدامة',
      description: 'استثمارات استراتيجية صُممت لحماية إرثك وتحقيق عوائد لا مثيل لها.',
      cols: [
        { title: 'العائد السنوي', value: '15', desc: 'العائد السنوي المتوقع على العقارات الفاخرة.' },
        { title: 'شراكات استراتيجية', value: 'النخبة', desc: 'تحالفات مع مقاولين عالميين وإدارة تشغيل استثنائية.' },
        { title: 'التطوير', value: 'متقدم', desc: 'إنجاز مراحل البناء بخطى متسارعة لضمان التسليم المبكر.' },
      ],
    },
    footer: {
      description: 'قمة التطوير العقاري الفاخر. نصمم مستقبل الحياة الراقية بمشاريع تتجاوز التوقعات.',
      links: [
        { hash: 'projects', href: { pathname: '/', hash: 'projects' }, label: 'المشاريع' },
        { hash: 'about', href: { pathname: '/', hash: 'about' }, label: 'من نحن' },
          { hash: 'contact', href: { pathname: '/', hash: 'contact' }, label: 'تواصل' },
      ],
      contactTitle: 'تواصل',
      location: 'فيلا 472 - شمال الشويفات - أمام داون تاون - التجمع الخامس - القاهرة الجديدة 11835، مصر',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      rights: 'جميع الحقوق محفوظة.',
    },
    contact: {
      sectionLabel: 'تواصل',
      heading: 'ابدأ معنا المحادثة المناسبة',
      description: 'شاركنا اهتمامك وسيساعدك فريقنا في مقارنة المشروعات وخطط السداد ومواعيد التسليم المتوقعة.',
      formHeading: 'اطلب مكالمة من فريقنا',
      formNote: 'عادة نقوم بالرد خلال يوم عمل واحد.',
      nameLabel: 'الاسم',
      phoneLabel: 'رقم الهاتف',
      emailLabel: 'البريد الإلكتروني',
      interestLabel: 'نوع الاهتمام',
      interestOptions: ['اختر نوع الاهتمام', 'شقة', 'فيلا', 'وحدة تجارية', 'فرصة استثمارية'],
      button: 'إرسال الطلب',
      detailsHeading: 'بيانات التواصل المباشر',
      addressLabel: 'العنوان',
      address: 'فيلا 472 - شمال الشويفات - أمام داون تاون - التجمع الخامس - القاهرة الجديدة 11835، مصر',
      mapLabel: 'عرض على Google Maps',
      phone: '010 20008256',
      email: 'esgroup@gmail.com',
      socialHeading: 'تابعنا',
      facebook: 'https://www.facebook.com/ElshihryDevelopments',
      instagram: 'https://www.instagram.com/elshihrydevelopments/',
      linkedin: 'https://www.linkedin.com/company/elshihrydevelopments',
      whatsapp: '201020008256',
    },
  },
  en: {
    arch: {
      eyebrow: 'Signature Approach',
      titleFirst: 'How We',
      titleSecond: 'Shape Value',
      description:
        'We do not start with facades. We start with the experience, performance, and long-term value a place should deliver from day one onward.',
      statementLabel: 'El Shihry Promise',
      statement:
        'Before we refine the surfaces, we choreograph the logic of the project: why this location, how the spaces should feel, and what keeps the asset strong over time.',
      metrics: [
        { value: '3', label: 'pillars guiding every project' },
        { value: '1', label: 'unified vision from concept to handover' },
        { value: '100%', label: 'details serving comfort and value' },
      ],
      pillars: [
        {
          step: '01',
          title: 'Land Chosen With Intent',
          detail: 'We pursue locations with lasting demand, strong positioning, and the kind of identity that compounds value rather than simply borrowing attention.',
        },
        {
          step: '02',
          title: 'Living Experience First',
          detail: 'Planning, circulation, privacy, light, and services are composed as one system so the project feels effortless to live in and unmistakably premium.',
        },
        {
          step: '03',
          title: 'Delivery That Protects Value',
          detail: 'Materials, partners, and operational details are selected to help the asset remain desirable, resilient, and commercially strong after handover.',
        },
      ],
    },
    nav: {
      brand: 'El Shihry',
      links: [
        { hash: 'projects', href: { pathname: '/projects', hash: '' }, label: 'Projects' },
        { hash: 'about', href: { pathname: '/about', hash: '' }, label: 'About' },
        { hash: 'blog', href: { pathname: '/blog', hash: '' }, label: 'Blog' },
        { hash: 'contact', href: { pathname: '/contact', hash: '' }, label: 'Contact' },
      ],
    },
    hero: {
      badge: 'EL SHIHRY DEVELOPMENTS',
      titleFirst: 'Building tomorrow',
      titleSecond: 'landmarks today',
      subtitle: 'A new chapter in our story begins today… to create a tomorrow worth telling.',
      scrollLabel: 'Scroll to Explore',
      btnDownload: 'Download Portfolio',
      btnProjects: 'See Our Projects',
      videoUrl: '',
      posterUrl: '',
    },
    about: {
      eyebrow: 'The Vision',
      titleLines: ['Building', 'A Legacy of Luxury'],
      paragraphs: [
        'At El Shihry Developments, we do not simply build properties; we craft legacies. Every project reflects our unwavering commitment to excellence, where visionary architecture meets masterful execution.',
        'Our spaces are created for the elite, offering an exclusive lifestyle where every detail is curated with precision and intent.',
      ],
      milestones: [
        { year: '2012', title: 'The Foundation', description: 'Establishing El Shihry with a clear vision to revolutionize luxury living.' },
        { year: '2018', title: 'The Iconic Tower', description: 'Launching our first smart residential tower with award-winning architecture.' },
        { year: '2024', title: 'Global Expansion', description: 'Starting our first international projects while maintaining our unique footprint.' },
      ],
      cta: 'Our Story',
      cards: [
        { label: 'Leadership', value: 'Eng. Ahmed El Shihry' },
        { label: 'Headquarters', value: 'Villa 472, North El Choueifat, opposite Downtown, Fifth Settlement, New Cairo 11835, Egypt' },
        { label: 'Brand', value: 'El Shihry Developments' }
      ],
    },
    aboutLeadership: {
      imageUrl: '',
      name: 'Eng. Ahmed El Shihry',
      position: 'Chairman',
      quote: 'We do not build walls; we craft spaces that tell stories of elegance.',
    },
    aboutValues: {
      title: 'Core Values',
      items: [
        { title: 'Timelessness', description: 'Designs that transcend trends and increase in value over time.' },
        { title: 'Precision', description: 'Every millimeter in our projects is meticulously crafted for perfection.' },
        { title: 'Legacy', description: 'Building so that our name remains synonymous with quality for generations.' },
      ],
    },
    philosophy: {
      text: 'True luxury is not just seen, it is felt. It lives in the meticulous attention to the unseen details, the harmony of golden proportions, and the silent promise of eternity built into every stone.',
    },
    projects: {
      titleFirst: 'Signature',
      titleSecond: 'Projects',
      description: 'Discover a portfolio of ultra-luxury properties designed for those who demand nothing but the absolute best.',
      cta: 'Explore Project',
      items: [
        {
          slug: 'aurum-tower',
          title: 'Aurum Tower',
          location: 'Downtown',
          description: 'An architectural masterpiece redefining the skyline, where luxury meets innovation.',
          stats: [
            { label: 'Height', value: '300m' },
            { label: 'Units', value: '150' },
            { label: 'Delivery', value: '2027' },
          ],
          details: ['Panoramic Views', 'Private Spa', 'Royal Concierge'],
        },
        {
          slug: 'jasmine-estates',
          title: 'Jasmine Estates',
          location: 'Coastal Riviera',
          description: 'A serene sanctuary blending the charm of nature with modern luxury design.',
          stats: [
            { label: 'Area', value: '500 Acres' },
            { label: 'Villas', value: '80' },
            { label: 'Beach', value: 'Private' },
          ],
          details: ['Green Trails', 'Yacht Marina', 'Elite Sports Club'],
        },
        {
          slug: 'lumina-towers',
          title: 'Lumina Towers',
          location: 'Financial District',
          description: 'The perfect destination for work and life in the heart of the business center.',
          stats: [
            { label: 'Offices', value: 'Grade A' },
            { label: 'Tech', value: 'Smart' },
            { label: 'Sustainability', value: 'LEED' },
          ],
          details: ['Flexible Workspaces', 'Fine Dining', '24/7 Security'],
        },
        {
          slug: 'royal-penthouses',
          title: 'Royal Penthouses',
          location: 'Skyline Avenue',
          description: 'Living above the clouds, where every detail tells a story of absolute elegance.',
          stats: [
            { label: 'Floors', value: 'Top Tier' },
            { label: 'Pool', value: 'Infinity' },
            { label: 'Elevator', value: 'Private' },
          ],
          details: ['Sky Terrace', 'Royal Master Suite', 'Italian Finishes'],
        },
      ],
    },
    blog: {
      title: 'El Shihry Insights',
      description: 'In-depth perspectives on luxury real estate, investment, and architectural innovation.',
      cta: 'Read Article',
      items: [
        {
          slug: 'new-phase-launch',
          title: 'New Phase Launch with Exceptional Payment Plans',
          date: '15 Apr 2026',
          tag: 'New Launch',
          excerpt: 'Discover exclusive opportunities in our latest construction phase with unprecedented flexibility.',
          content: [
            'El Shihry Developments today announced the launch of a new phase in the Aurum residential project.',
            'This phase includes a variety of units tailored for the elite seeking a home that balances privacy and luxury.',
            'The new payment plans feature flexibility up to 10 years, making it an unmissable investment opportunity.',
          ],
        },
        {
          slug: 'location-strategy',
          title: 'Why Location Remains the Most Critical Investment Factor',
          date: '02 Apr 2026',
          tag: 'RE Insights',
          excerpt: 'How we select project locations to ensure capital growth for our clients assets.',
          content: [
            'Location is not just coordinates; it is the future.',
            'At El Shihry, we study urban shifts ten years into the future before selecting project land.',
            'We focus on proximity to major axes, quality of surrounding services, and location scarcity in vital areas.',
          ],
        },
      ],
    },
    contactPage: {
      title: 'Connect with the Elite',
      description: 'We are here to design your next real estate experience. Our dedicated team awaits you.',
      formTitle: 'Request a Private Call',
      infoTitle: 'Regional Offices',
    },
    marquee: {
      first: 'EL SHIHRY DEVELOPMENTS / LUXURY REAL ESTATE / EL SHIHRY DEVELOPMENTS / LUXURY REAL ESTATE /',
      second: 'BEYOND IMAGINATION / CRAFTING LEGACIES / BEYOND IMAGINATION / CRAFTING LEGACIES /',
    },
    lifestyle: {
      titleFirst: 'The',
      titleSecond: 'Lifestyle',
      images: siteImages.lifestyle,
      items: ['Golden Facades', 'Royal Interiors', 'Skyline Views', 'Coastal Serenity'],
    },
    whyInvest: {
      eyebrow: 'Wealth Preservation',
      titleFirst: 'Future-Proof',
      titleSecond: 'Assets',
      description: 'Strategic investments designed to safeguard your legacy and yield unparalleled returns.',
      cols: [
        { title: 'Annual ROI', value: '15', desc: 'Projected annual return on premium properties.' },
        { title: 'Strategic Partners', value: 'Tier 1', desc: 'Alliances with global contractors and elite management.' },
        { title: 'Development', value: 'On Track', desc: 'Accelerated milestones securing early delivery.' },
      ],
    },
    footer: {
      description: 'The pinnacle of luxury real estate. Crafting the future of high-end living spaces with timeless precision.',
      links: [
        { hash: 'projects', href: { pathname: '/', hash: 'projects' }, label: 'Projects' },
        { hash: 'about', href: { pathname: '/', hash: 'about' }, label: 'About Us' },
          { hash: 'contact', href: { pathname: '/', hash: 'contact' }, label: 'Contact' },
      ],
      contactTitle: 'Contact',
      location: 'Villa 472, North El Choueifat, opposite Downtown, Fifth Settlement, New Cairo 11835, Egypt',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.',
    },
    contact: {
      sectionLabel: 'Contact',
      heading: "Let's Start the Right Conversation",
      description: 'Share your interest and our team will help you compare projects, payment options, and expected delivery timelines.',
      formHeading: 'Request a Call Back',
      formNote: 'We usually reply within one business day.',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      interestLabel: 'Interest',
      interestOptions: ['Select an interest', 'Apartment', 'Villa', 'Commercial Unit', 'Investment Opportunity'],
      button: 'Send Inquiry',
      detailsHeading: 'Direct Contact Details',
      addressLabel: 'Address',
      address: 'Villa 472, North El Choueifat, opposite Downtown, Fifth Settlement, New Cairo 11835, Egypt',
      mapLabel: 'View on Google Maps',
      phone: '010 20008256',
      email: 'esgroup@gmail.com',
      socialHeading: 'Follow Us',
      facebook: 'https://www.facebook.com/ElshihryDevelopments',
      instagram: 'https://www.instagram.com/elshihrydevelopments/',
      linkedin: 'https://www.linkedin.com/company/elshihrydevelopments',
      whatsapp: '201020008256',
    },
  },
};
