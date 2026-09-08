import type { Locale } from "@/i18n/routing";
import type { ContentBlock, ContentPage, ContentPageSlug } from "../types";
import { CONTENT_PAGE_SLUGS, isContentPageSlug } from "../types";

type LocalizedPage = Omit<ContentPage, "slug">;

const UPDATED_AT = "2026-09-01";

function page(
  title: string,
  description: string,
  blocks: ContentBlock[],
): LocalizedPage {
  return { title, description, updatedAt: UPDATED_AT, blocks };
}

const EN: Record<ContentPageSlug, LocalizedPage> = {
  terms: page(
    "Terms of Service",
    "Terms governing the use of Linen Line Store and purchases.",
    [
      {
        type: "paragraph",
        text: "Welcome to Linen Line Store. By browsing or placing an order, you agree to these Terms of Service. Please read them carefully before completing a purchase.",
      },
      { type: "heading", level: 2, text: "Accounts & eligibility" },
      {
        type: "paragraph",
        text: "You are responsible for keeping account credentials secure and for all activity under your account. Orders may be placed as a guest or with a registered account.",
      },
      { type: "heading", level: 2, text: "Products & pricing" },
      {
        type: "list",
        items: [
          "Product images are illustrative; natural linen may show subtle variations in tone and texture.",
          "Prices are shown in the selected currency and may include or exclude duties depending on destination.",
          "We reserve the right to correct pricing or availability errors and cancel affected orders with notice.",
        ],
      },
      { type: "heading", level: 2, text: "Orders & fulfilment" },
      {
        type: "paragraph",
        text: "An order confirmation email acknowledges receipt; acceptance occurs when the order is prepared for shipment. Delivery estimates are guidance, not guarantees.",
      },
      {
        type: "callout",
        text: "For returns, exchanges, and shipping rules, see the dedicated Client Care pages linked in the footer.",
      },
    ],
  ),
  privacy: page(
    "Privacy Policy",
    "How Linen Line Store collects, uses, and protects personal data.",
    [
      {
        type: "paragraph",
        text: "Linen Line Store respects privacy. This policy explains what information is collected, why it is used, and the choices available to customers.",
      },
      { type: "heading", level: 2, text: "Information we collect" },
      {
        type: "list",
        items: [
          "Contact and delivery details provided at checkout or in the account profile.",
          "Order history, preferences, and support conversations with concierge.",
          "Technical data such as device type, approximate location, and cookies needed for the store to function.",
        ],
      },
      { type: "heading", level: 2, text: "How we use information" },
      {
        type: "paragraph",
        text: "Data is used to fulfil orders, provide customer care, improve the shopping experience, and—only with consent—send style updates and offers.",
      },
      { type: "heading", level: 2, text: "Sharing & retention" },
      {
        type: "paragraph",
        text: "We share data with trusted payment, logistics, and hosting partners only as needed to operate the boutique. Records are kept for as long as required for orders, legal obligations, and legitimate business needs.",
      },
      {
        type: "callout",
        text: "To request access, correction, or deletion of personal data, contact concierge@linenlinestore.com.",
      },
    ],
  ),
  cookies: page(
    "Cookie Settings",
    "How Linen Line Store uses cookies and similar technologies.",
    [
      {
        type: "paragraph",
        text: "Cookies help the store remember preferences, keep sessions secure, and understand how the boutique is used so experiences can be refined.",
      },
      { type: "heading", level: 2, text: "Types of cookies" },
      {
        type: "list",
        items: [
          "Essential — required for cart, checkout, and security.",
          "Preferences — language, currency, and display choices.",
          "Analytics — aggregated insights about page performance (non-essential).",
        ],
      },
      {
        type: "callout",
        text: "Browser settings can block or clear cookies; some store features may not work without essential cookies.",
      },
    ],
  ),
  "size-guide": page(
    "Abaya Sizing & Fit Guide",
    "Choose abaya length and bust width with confidence.",
    [
      {
        type: "paragraph",
        text: "Abaya sizing at Linen Line is based primarily on garment length paired with a modest bust width. Use the chart below as a starting point, then refine with height and preferred hemline.",
      },
      { type: "size-chart" },
      { type: "heading", level: 2, text: "How to measure" },
      {
        type: "list",
        style: "numbered",
        items: [
          "Length — from the highest shoulder point straight down to the preferred hem.",
          "Bust — under the arms across the fullest part, keeping the tape level.",
          "Height — overall height helps confirm the recommended size band.",
        ],
      },
      {
        type: "callout",
        text: "Need a custom length? Contact the styling concierge for bespoke adjustments.",
      },
    ],
  ),
  "fabric-care": page(
    "Linen Care Instructions",
    "How to care for premium linen and linen-blend abayas.",
    [
      {
        type: "paragraph",
        text: "Pure linen softens beautifully with wear. Gentle care preserves drape, colour, and longevity.",
      },
      { type: "heading", level: 2, text: "Washing" },
      {
        type: "list",
        items: [
          "Prefer cool or lukewarm hand wash; if machine washing, use a gentle cycle in a mesh bag.",
          "Use mild detergent; avoid bleach and optical brighteners.",
          "Wash similar colours together, especially deep neutrals and blacks.",
        ],
      },
      { type: "heading", level: 2, text: "Drying & ironing" },
      {
        type: "list",
        items: [
          "Reshape and air dry flat or on a wide hanger away from direct sun.",
          "Iron on linen setting while slightly damp, or steam for a soft finish.",
          "Embrace natural texture—linen’s character is part of its elegance.",
        ],
      },
    ],
  ),
  "track-order": page(
    "Track Your Order",
    "Follow shipment status for Linen Line orders.",
    [
      {
        type: "paragraph",
        text: "After dispatch, a tracking reference is sent by email. Signed-in customers can also follow progress under Orders in the account area.",
      },
      { type: "heading", level: 2, text: "What to expect" },
      {
        type: "list",
        items: [
          "Processing — the atelier prepares and quality-checks the piece.",
          "Shipped — the carrier has collected the parcel; tracking updates begin.",
          "Delivered — the order has arrived at the delivery address.",
        ],
      },
      {
        type: "callout",
        text: "Live carrier tracking and public order lookup will connect to the fulfilment endpoint when available. Until then, use account Orders or contact concierge with the order number.",
      },
    ],
  ),
  shipping: page(
    "Shipping & Duties",
    "Delivery options, timelines, and customs information.",
    [
      {
        type: "paragraph",
        text: "Linen Line ships across the GCC, Türkiye, and selected international destinations with carefully packed parcels.",
      },
      { type: "heading", level: 2, text: "Delivery estimates" },
      {
        type: "list",
        items: [
          "Türkiye & GCC metro areas — typically 2–5 business days after dispatch.",
          "Wider regional destinations — typically 4–8 business days.",
          "International — timelines vary by carrier and customs clearance.",
        ],
      },
      { type: "heading", level: 2, text: "Duties & taxes" },
      {
        type: "paragraph",
        text: "Depending on destination, duties or taxes may apply at checkout or upon arrival. Displayed totals clarify what is included before payment.",
      },
      {
        type: "callout",
        text: "Complimentary express shipping may apply on qualified order totals—see cart for eligibility.",
      },
    ],
  ),
  returns: page(
    "Returns & Exchanges",
    "Seamless size swaps and return guidelines.",
    [
      {
        type: "paragraph",
        text: "A 14-day return and exchange window begins on the delivery date for eligible full-price items in original condition with tags attached.",
      },
      { type: "heading", level: 2, text: "Eligibility" },
      {
        type: "list",
        items: [
          "Unworn, unwashed pieces with original packaging where provided.",
          "Size exchanges are prioritised when stock allows.",
          "Final-sale, customised, or intimate-layer items may be excluded.",
        ],
      },
      { type: "heading", level: 2, text: "How to start" },
      {
        type: "paragraph",
        text: "Contact concierge with the order number and preferred outcome (exchange or refund). Return shipping instructions will be provided.",
      },
    ],
  ),
  faq: page(
    "Frequently Asked Questions",
    "Answers to common questions about sizing, shipping, and care.",
    [
      {
        type: "faq",
        items: [
          {
            question: "How do I choose the right abaya length?",
            answer:
              "Match the size chart length to height and preferred hemline. When between sizes, consider whether a longer drape or a neater ankle finish is preferred, or ask concierge for guidance.",
          },
          {
            question: "Do you offer custom lengths?",
            answer:
              "Yes. Bespoke length adjustments can be arranged through the styling concierge before or shortly after purchase, subject to atelier capacity.",
          },
          {
            question: "Which currencies are supported?",
            answer:
              "The boutique defaults to Turkish Lira (TRY) and supports additional regional currencies at checkout where available.",
          },
          {
            question: "How should linen abayas be stored?",
            answer:
              "Hang on a wide hanger in a breathable space, or fold lightly. Avoid prolonged compression and plastic covers that trap moisture.",
          },
        ],
      },
    ],
  ),
  about: page(
    "Our Heritage & Story",
    "The story behind Linen Line Store.",
    [
      {
        type: "paragraph",
        text: "Linen Line Store is a modest fashion boutique devoted to refined abayas crafted from fine linen and premium fabrics—modern silhouettes rooted in timeless elegance.",
      },
      { type: "heading", level: 2, text: "Craft & calm" },
      {
        type: "paragraph",
        text: "Each piece is designed for ease of movement, breathable comfort, and a quiet luxury that travels from everyday moments to formal gatherings.",
      },
    ],
  ),
  philosophy: page(
    "The Linen Philosophy",
    "Why linen sits at the heart of the collection.",
    [
      {
        type: "paragraph",
        text: "Linen is chosen for its honesty: breathable, enduring, and beautifully imperfect. It softens with time and carries a natural presence that suits modest dressing.",
      },
      {
        type: "list",
        items: [
          "Breathability for warm climates and long wear.",
          "A matte, refined hand-feel that photographs and drapes with grace.",
          "Materials selected with care for longevity over trend cycles.",
        ],
      },
    ],
  ),
  sustainability: page(
    "Artisanal Craftsmanship",
    "How Linen Line approaches craft and responsible making.",
    [
      {
        type: "paragraph",
        text: "Small-batch attention, thoughtful fabrics, and durable construction reduce waste and honour the makers behind each abaya.",
      },
      { type: "heading", level: 2, text: "Our commitments" },
      {
        type: "list",
        items: [
          "Prioritising quality fibres and finishes that last.",
          "Working with ateliers that uphold careful finishing standards.",
          "Designing versatile pieces meant to be worn for seasons, not weeks.",
        ],
      },
    ],
  ),
  boutiques: page(
    "Boutique Locations",
    "Visit Linen Line in person or book a styling appointment.",
    [
      {
        type: "paragraph",
        text: "Appointments and seasonal pop-ups are announced through the newsletter and social channels. Private styling sessions can be arranged with concierge.",
      },
      {
        type: "callout",
        text: "Boutique address details and booking will be served from the locations endpoint when available.",
      },
    ],
  ),
  contact: page(
    "Contact Our Team",
    "Reach the Linen Line concierge team.",
    [
      {
        type: "paragraph",
        text: "For sizing advice, order support, or styling questions, the concierge team is ready to help.",
      },
      { type: "heading", level: 2, text: "Direct concierge" },
      {
        type: "list",
        items: [
          "Email — concierge@linenlinestore.com",
          "Hours — Monday to Saturday, 9:00–21:00 (GMT+3)",
          "WhatsApp — available from the site footer during concierge hours",
        ],
      },
    ],
  ),
};

const AR: Record<ContentPageSlug, LocalizedPage> = {
  terms: page(
    "الشروط والأحكام",
    "الشروط التي تنظّم استخدام متجر لينين لاين وعمليات الشراء.",
    [
      {
        type: "paragraph",
        text: "مرحباً بكم في متجر لينين لاين. باستخدام الموقع أو إتمام طلب، يتم القبول بهذه الشروط والأحكام. يُرجى قراءتها بعناية قبل الشراء.",
      },
      { type: "heading", level: 2, text: "الحساب والأهلية" },
      {
        type: "paragraph",
        text: "تتحمل مسؤولية حماية بيانات الدخول وجميع النشاطات عبر الحساب. يمكن إتمام الطلبات كزائر أو بحساب مسجّل.",
      },
      { type: "heading", level: 2, text: "المنتجات والأسعار" },
      {
        type: "list",
        items: [
          "صور المنتجات للتوضيح؛ قد يظهر في الكتان الطبيعي تفاوت بسيط في اللون والملمس.",
          "تُعرض الأسعار بالعملة المختارة وقد تشمل أو تستثني الرسوم حسب وجهة الشحن.",
          "يحق للمتجر تصحيح أخطاء التسعير أو التوفر وإلغاء الطلبات المتأثرة مع إبلاغ العميل.",
        ],
      },
      { type: "heading", level: 2, text: "الطلبات والتنفيذ" },
      {
        type: "paragraph",
        text: "رسالة تأكيد الطلب تعني استلام الطلب؛ ويُعد القبول نافذاً عند تجهيز الشحنة. مواعيد التوصيل تقديرية وليست ضماناً.",
      },
      {
        type: "callout",
        text: "للاطلاع على الإرجاع والشحن، راجع صفحات خدمة العملاء في تذييل الموقع.",
      },
    ],
  ),
  privacy: page(
    "سياسة الخصوصية",
    "كيف يجمع متجر لينين لاين البيانات الشخصية ويستخدمها ويحميها.",
    [
      {
        type: "paragraph",
        text: "يحترم متجر لينين لاين الخصوصية. توضح هذه السياسة البيانات التي تُجمع، وأغراض استخدامها، والخيارات المتاحة للعملاء.",
      },
      { type: "heading", level: 2, text: "البيانات التي نجمعها" },
      {
        type: "list",
        items: [
          "بيانات التواصل والتوصيل عند الدفع أو في الملف الشخصي.",
          "سجل الطلبات والتفضيلات ومحادثات الدعم مع فريق العناية.",
          "بيانات تقنية مثل نوع الجهاز والموقع التقريبي وملفات الارتباط اللازمة لعمل المتجر.",
        ],
      },
      { type: "heading", level: 2, text: "كيف نستخدم البيانات" },
      {
        type: "paragraph",
        text: "تُستخدم البيانات لتنفيذ الطلبات وتقديم خدمة العملاء وتحسين التجربة، وإرسال التحديثات والعروض عند الموافقة فقط.",
      },
      { type: "heading", level: 2, text: "المشاركة والاحتفاظ" },
      {
        type: "paragraph",
        text: "تتم مشاركة البيانات مع شركاء الدفع والشحن والاستضافة بالقدر اللازم لتشغيل البوتيك، وتُحفظ للمدة التي تتطلبها الطلبات والالتزامات النظامية.",
      },
      {
        type: "callout",
        text: "لطلب الاطلاع أو التصحيح أو الحذف، راسلوا concierge@linenlinestore.com.",
      },
    ],
  ),
  cookies: page(
    "إعدادات ملفات الارتباط",
    "كيف يستخدم متجر لينين لاين ملفات الارتباط والتقنيات المشابهة.",
    [
      {
        type: "paragraph",
        text: "تساعد ملفات الارتباط على تذكّر التفضيلات وتأمين الجلسات وفهم استخدام المتجر لتحسين التجربة.",
      },
      { type: "heading", level: 2, text: "أنواع الملفات" },
      {
        type: "list",
        items: [
          "أساسية — للسلة والدفع والأمان.",
          "تفضيلات — اللغة والعملة وخيارات العرض.",
          "تحليلات — رؤى مجمّعة عن أداء الصفحات (اختيارية).",
        ],
      },
      {
        type: "callout",
        text: "يمكن حظر أو مسح ملفات الارتباط من المتصفح؛ قد لا تعمل بعض الميزات دون الملفات الأساسية.",
      },
    ],
  ),
  "size-guide": page(
    "دليل مقاسات وأطوال العبايات",
    "اختيار طول العباية وعرض الصدر بثقة.",
    [
      {
        type: "paragraph",
        text: "يعتمد المقاس في لينين لاين أساساً على طول القطعة مع عرض صدر محتشم. استخدموا الجدول أدناه كنقطة انطلاق ثم راعوا الطول المفضل.",
      },
      { type: "size-chart" },
      { type: "heading", level: 2, text: "طريقة القياس" },
      {
        type: "list",
        style: "numbered",
        items: [
          "الطول — من أعلى نقطة في الكتف حتى الحافة المفضلة.",
          "الصدر — تحت الإبطين عند أعرض نقطة مع إبقاء الشريط مستوياً.",
          "الطول الكلي للجسم — يساعد على تأكيد نطاق المقاس المناسب.",
        ],
      },
      {
        type: "callout",
        text: "للطول المخصص، تواصلوا مع فريق الاستشارة للمساعدة في التعديلات.",
      },
    ],
  ),
  "fabric-care": page(
    "إرشادات العناية بالكتان",
    "العناية بعبايات الكتان والخلطات الفاخرة.",
    [
      {
        type: "paragraph",
        text: "يصبح الكتان النقي أنعم مع الارتداء. العناية اللطيفة تحافظ على الانسيابية واللون وطول العمر.",
      },
      { type: "heading", level: 2, text: "الغسيل" },
      {
        type: "list",
        items: [
          "يُفضّل الغسيل اليدوي البارد أو الفاتر؛ وعند الغسالة استخدموا برنامجاً لطيفاً مع كيس شبكي.",
          "استخدموا منظفاً خفيفاً وتجنبوا المبيض.",
          "افصلوا الألوان المتشابهة، خاصة الداكنة والأسود.",
        ],
      },
      { type: "heading", level: 2, text: "التجفيف والكي" },
      {
        type: "list",
        items: [
          "أعيدوا تشكيل القطعة وجففوها بعيداً عن الشمس المباشرة.",
          "اكووا على إعداد الكتان وهي رطبة قليلاً، أو استخدموا البخار.",
          "الملمس الطبيعي جزء من أناقة الكتان.",
        ],
      },
    ],
  ),
  "track-order": page(
    "تتبع الشحنة",
    "متابعة حالة شحن طلبات لينين لاين.",
    [
      {
        type: "paragraph",
        text: "بعد الشحن يُرسل رقم التتبع عبر البريد. ويمكن للعملاء المسجّلين متابعة الحالة من قسم الطلبات في الحساب.",
      },
      { type: "heading", level: 2, text: "المراحل المتوقعة" },
      {
        type: "list",
        items: [
          "قيد التجهيز — تجهيز وفحص القطعة.",
          "تم الشحن — استلام الناقل للطرد وبدء تحديثات التتبع.",
          "تم التوصيل — وصول الطلب إلى عنوان التسليم.",
        ],
      },
      {
        type: "callout",
        text: "سيتم ربط التتبع الحي بخدمة التنفيذ لاحقاً. حتى ذلك الحين، استخدموا طلبات الحساب أو راسلوا فريق العناية برقم الطلب.",
      },
    ],
  ),
  shipping: page(
    "معلومات الشحن والتوصيل",
    "خيارات التوصيل والمدد والمعلومات الجمركية.",
    [
      {
        type: "paragraph",
        text: "يشحن متجر لينين لاين إلى دول الخليج وتركيا ووجهات دولية مختارة بطرد معبأ بعناية.",
      },
      { type: "heading", level: 2, text: "مدد التوصيل التقديرية" },
      {
        type: "list",
        items: [
          "تركيا ومدن الخليج الرئيسية — عادةً ٢–٥ أيام عمل بعد الشحن.",
          "وجهات إقليمية أوسع — عادةً ٤–٨ أيام عمل.",
          "دولي — يختلف حسب الناقل والتخليص الجمركي.",
        ],
      },
      { type: "heading", level: 2, text: "الرسوم والضرائب" },
      {
        type: "paragraph",
        text: "قد تُطبق رسوم أو ضرائب حسب الوجهة عند الدفع أو عند الوصول. يوضح الإجمالي ما هو مشمول قبل إتمام الدفع.",
      },
      {
        type: "callout",
        text: "قد يتوفر شحن سريع مجاني على الطلبات المؤهلة—راجعوا السلة للأهلية.",
      },
    ],
  ),
  returns: page(
    "سياسة الاستبدال والاسترجاع",
    "إرشادات الاستبدال والإرجاع السلس.",
    [
      {
        type: "paragraph",
        text: "تتوفر نافذة ١٤ يوماً للإرجاع أو الاستبدال من تاريخ التوصيل للمنتجات المؤهلة بحالتها الأصلية مع البطاقات.",
      },
      { type: "heading", level: 2, text: "الأهلية" },
      {
        type: "list",
        items: [
          "قطع غير مرتداة وغير مغسولة مع التغليف الأصلي إن وُجد.",
          "يُفضّل استبدال المقاس عند توفر المخزون.",
          "قد تُستثنى القطع المخفّضة أو المخصصة أو الطبقات الداخلية.",
        ],
      },
      { type: "heading", level: 2, text: "بدء الطلب" },
      {
        type: "paragraph",
        text: "تواصلوا مع فريق العناية برقم الطلب والنتيجة المفضلة (استبدال أو استرجاع). ستُرسل تعليمات الإرجاع.",
      },
    ],
  ),
  faq: page(
    "الأسئلة الشائعة",
    "إجابات عن المقاسات والشحن والعناية.",
    [
      {
        type: "faq",
        items: [
          {
            question: "كيف يُختار طول العباية المناسب؟",
            answer:
              "طابقوا طول الجدول مع الطول الكلي والحافة المفضلة. عند التردد بين مقاسين، راعوا الرغبة في انسيابية أطول أو نهاية أقرب للكاحل، أو اطلبوا مساعدة فريق الاستشارة.",
          },
          {
            question: "هل تتوفر أطوال مخصصة؟",
            answer:
              "نعم. يمكن ترتيب تعديلات الطول عبر فريق الاستشارة قبل الشراء أو بعده بوقت قصير حسب طاقة الورشة.",
          },
          {
            question: "ما العملات المدعومة؟",
            answer:
              "المتجر يعتمد الليرة التركية افتراضياً ويدعم عملات إقليمية إضافية عند الدفع عند التوفر.",
          },
          {
            question: "كيف تُخزَّن عبايات الكتان؟",
            answer:
              "علّقوها على شماعة عريضة في مكان جيد التهوية، أو اطووها برفق. تجنبوا الضغط الطويل والأغطية البلاستيكية التي تحبس الرطوبة.",
          },
        ],
      },
    ],
  ),
  about: page(
    "قصتنا وهويتنا",
    "قصة متجر لينين لاين.",
    [
      {
        type: "paragraph",
        text: "لينين لاين بوتيك للأزياء المحتشمة يقدّم عبايات راقية من الكتان الفاخر والأقمشة المميزة—قصّات عصرية بجذور أنيقة خالدة.",
      },
      { type: "heading", level: 2, text: "الحِرفية والهدوء" },
      {
        type: "paragraph",
        text: "تُصمَّم كل قطعة لراحة الحركة والتنفّس، ولأناقة هادئة تناسب اليومي والمناسبات.",
      },
    ],
  ),
  philosophy: page(
    "فلسفة الكتان الطبيعي",
    "لماذا يقع الكتان في قلب المجموعة.",
    [
      {
        type: "paragraph",
        text: "يُختار الكتان لصدقه: يتنفس، يدوم، ويحمل جمالاً طبيعياً غير متكلّف. يلين مع الوقت ويناسب اللباس المحتشم.",
      },
      {
        type: "list",
        items: [
          "تنفس مناسب للمناخ الدافئ والارتداء الطويل.",
          "ملمس مطفي راقٍ ينسدل بأناقة.",
          "مواد مختارة للعمر الطويل لا لدورات الموضة القصيرة.",
        ],
      },
    ],
  ),
  sustainability: page(
    "الحِرفية والاستدامة",
    "نهج لينين لاين في الحِرفية والصنع المسؤول.",
    [
      {
        type: "paragraph",
        text: "الاهتمام بالدفعات الصغيرة والأقمشة المدروسة والتشطيب المتين يقلل الهدر ويكرّم صنّاع كل عباية.",
      },
      { type: "heading", level: 2, text: "التزاماتنا" },
      {
        type: "list",
        items: [
          "أولوية للألياف والتشطيبات التي تدوم.",
          "العمل مع ورش تلتزم بمعايير تشطيب دقيقة.",
          "تصميم قطع متعددة الاستخدام لتُرتدى مواسم لا أسابيع.",
        ],
      },
    ],
  ),
  boutiques: page(
    "مواقع البوتيكات",
    "زيارة لينين لاين أو حجز موعد استشارة.",
    [
      {
        type: "paragraph",
        text: "تُعلن المواعيد والفعاليات الموسمية عبر النشرة والقنوات الاجتماعية. يمكن ترتيب جلسات استشارة خاصة مع فريق العناية.",
      },
      {
        type: "callout",
        text: "تفاصيل العناوين والحجز ستُعرض من خدمة المواقع عند توفرها.",
      },
    ],
  ),
  contact: page(
    "تواصل مع فريقنا",
    "التواصل مع فريق عناية لينين لاين.",
    [
      {
        type: "paragraph",
        text: "لاستشارات المقاس أو دعم الطلبات أو أسئلة التنسيق، فريق العناية جاهز للمساعدة.",
      },
      { type: "heading", level: 2, text: "التواصل المباشر" },
      {
        type: "list",
        items: [
          "البريد — concierge@linenlinestore.com",
          "الساعات — من الاثنين إلى السبت، ٩:٠٠–٢١:٠٠ (توقيت GMT+3)",
          "واتساب — متاح من تذييل الموقع خلال ساعات العناية",
        ],
      },
    ],
  ),
};

const TR: Record<ContentPageSlug, LocalizedPage> = {
  terms: page(
    "Kullanım Koşulları",
    "Linen Line Store kullanımı ve alışverişe ilişkin koşullar.",
    [
      {
        type: "paragraph",
        text: "Linen Line Store’a hoş geldiniz. Siteyi kullanarak veya sipariş vererek bu Kullanım Koşulları’nı kabul etmiş olursunuz. Lütfen satın almadan önce dikkatle okuyunuz.",
      },
      { type: "heading", level: 2, text: "Hesaplar ve uygunluk" },
      {
        type: "paragraph",
        text: "Hesap bilgilerinizin güvenliğinden ve hesabınız altındaki tüm işlemlerden siz sorumlusunuz. Siparişler misafir olarak veya kayıtlı hesapla verilebilir.",
      },
      { type: "heading", level: 2, text: "Ürünler ve fiyatlandırma" },
      {
        type: "list",
        items: [
          "Ürün görselleri tanıtıcıdır; doğal ketende ton ve doku farklılıkları görülebilir.",
          "Fiyatlar seçilen para biriminde gösterilir; gümrük/vergiler varış ülkesine göre değişebilir.",
          "Fiyat veya stok hatalarını düzeltme ve etkilenen siparişleri bildirimle iptal etme hakkımız saklıdır.",
        ],
      },
      { type: "heading", level: 2, text: "Siparişler ve teslimat" },
      {
        type: "paragraph",
        text: "Sipariş onay e-postası talebin alındığını bildirir; kabul, siparişin kargoya hazırlanmasıyla gerçekleşir. Teslimat süreleri tahmini olup garanti değildir.",
      },
      {
        type: "callout",
        text: "İade, değişim ve kargo kuralları için alt bilgideki Müşteri Hizmetleri sayfalarına bakınız.",
      },
    ],
  ),
  privacy: page(
    "Gizlilik Politikası",
    "Linen Line Store’un kişisel verileri nasıl topladığı, kullandığı ve koruduğu.",
    [
      {
        type: "paragraph",
        text: "Linen Line Store gizliliğe önem verir. Bu politika hangi bilgilerin toplandığını, neden kullanıldığını ve müşterilere sunulan seçenekleri açıklar.",
      },
      { type: "heading", level: 2, text: "Topladığımız bilgiler" },
      {
        type: "list",
        items: [
          "Ödeme veya hesap profilinde paylaşılan iletişim ve teslimat bilgileri.",
          "Sipariş geçmişi, tercihler ve danışman ekibiyle yapılan destek yazışmaları.",
          "Cihaz türü, yaklaşık konum ve mağazanın çalışması için gerekli çerezler gibi teknik veriler.",
        ],
      },
      { type: "heading", level: 2, text: "Bilgileri nasıl kullanırız" },
      {
        type: "paragraph",
        text: "Veriler siparişleri yerine getirmek, müşteri hizmeti sunmak, deneyimi geliştirmek ve yalnızca onayla stil güncellemeleri ile teklifler göndermek için kullanılır.",
      },
      { type: "heading", level: 2, text: "Paylaşım ve saklama" },
      {
        type: "paragraph",
        text: "Veriler yalnızca butiğin işletilmesi için güvenilir ödeme, lojistik ve barındırma ortaklarıyla paylaşılır; siparişler, yasal yükümlülükler ve meşru iş ihtiyaçları süresince saklanır.",
      },
      {
        type: "callout",
        text: "Erişim, düzeltme veya silme talepleri için concierge@linenlinestore.com adresine yazınız.",
      },
    ],
  ),
  cookies: page(
    "Çerez Ayarları",
    "Linen Line Store’un çerezleri ve benzer teknolojileri nasıl kullandığı.",
    [
      {
        type: "paragraph",
        text: "Çerezler tercihleri hatırlamaya, oturumları güvende tutmaya ve deneyimi iyileştirmek için mağaza kullanımını anlamaya yardımcı olur.",
      },
      { type: "heading", level: 2, text: "Çerez türleri" },
      {
        type: "list",
        items: [
          "Zorunlu — sepet, ödeme ve güvenlik için gereklidir.",
          "Tercihler — dil, para birimi ve görüntüleme seçimleri.",
          "Analitik — sayfa performansına dair toplu içgörüler (zorunlu değildir).",
        ],
      },
      {
        type: "callout",
        text: "Tarayıcı ayarlarından çerezler engellenebilir veya silinebilir; zorunlu çerezler olmadan bazı özellikler çalışmayabilir.",
      },
    ],
  ),
  "size-guide": page(
    "Abaya Beden ve Ölçü Rehberi",
    "Abaya boyu ve göğüs genişliğini güvenle seçin.",
    [
      {
        type: "paragraph",
        text: "Linen Line’da beden, mütevazı bir göğüs genişliğiyle birlikte öncelikle giysi boyuna göre belirlenir. Aşağıdaki tabloyu başlangıç noktası olarak kullanın.",
      },
      { type: "size-chart" },
      { type: "heading", level: 2, text: "Nasıl ölçülür" },
      {
        type: "list",
        style: "numbered",
        items: [
          "Boy — omuzun en yüksek noktasından tercih edilen eteğe kadar.",
          "Göğüs — kolların altından en geniş noktada, mezürü düz tutarak.",
          "Boy uzunluğu — önerilen beden aralığını doğrulamaya yardımcı olur.",
        ],
      },
      {
        type: "callout",
        text: "Özel boy ister misiniz? Stil danışmanıyla iletişime geçerek ayarlama talep edebilirsiniz.",
      },
    ],
  ),
  "fabric-care": page(
    "Keten Bakım Talimatları",
    "Premium keten ve keten karışımı abayaların bakımı.",
    [
      {
        type: "paragraph",
        text: "Saf keten kullanımla yumuşar. Nazik bakım dökümü, rengi ve ömrü korur.",
      },
      { type: "heading", level: 2, text: "Yıkama" },
      {
        type: "list",
        items: [
          "Serin veya ılık elde yıkama tercih edin; makinede hassas program ve file torba kullanın.",
          "Hafif deterjan kullanın; ağartıcıdan kaçının.",
          "Özellikle koyu tonları ve siyahı benzer renklerle yıkayın.",
        ],
      },
      { type: "heading", level: 2, text: "Kurutma ve ütü" },
      {
        type: "list",
        items: [
          "Şekillendirip doğrudan güneşten uzak kurutun.",
          "Hafif nemliyken keten ayarında ütüleyin veya buhar kullanın.",
          "Doğal doku ketenin zarafetinin bir parçasıdır.",
        ],
      },
    ],
  ),
  "track-order": page(
    "Siparişinizi Takip Edin",
    "Linen Line siparişlerinin kargo durumunu izleyin.",
    [
      {
        type: "paragraph",
        text: "Kargoya verildikten sonra takip numarası e-posta ile gönderilir. Giriş yapan müşteriler ilerlemeyi hesaplarındaki Siparişler bölümünden de izleyebilir.",
      },
      { type: "heading", level: 2, text: "Beklenen aşamalar" },
      {
        type: "list",
        items: [
          "Hazırlanıyor — parça hazırlanır ve kalite kontrolünden geçer.",
          "Kargoda — taşıyıcı paketi aldı; takip güncellemeleri başlar.",
          "Teslim edildi — sipariş teslimat adresine ulaştı.",
        ],
      },
      {
        type: "callout",
        text: "Canlı kargo takibi ileride fulfillment uç noktasına bağlanacaktır. Şimdilik hesap Siparişleri’ni kullanın veya sipariş numaranızla danışmana yazın.",
      },
    ],
  ),
  shipping: page(
    "Kargo ve Gümrük",
    "Teslimat seçenekleri, süreler ve gümrük bilgileri.",
    [
      {
        type: "paragraph",
        text: "Linen Line, GCC, Türkiye ve seçili uluslararası noktalara özenle paketlenmiş gönderiler yapar.",
      },
      { type: "heading", level: 2, text: "Teslimat tahminleri" },
      {
        type: "list",
        items: [
          "Türkiye ve GCC büyükşehirleri — genellikle kargodan sonra 2–5 iş günü.",
          "Daha geniş bölgesel noktalar — genellikle 4–8 iş günü.",
          "Uluslararası — taşıyıcıya ve gümrük sürecine göre değişir.",
        ],
      },
      { type: "heading", level: 2, text: "Vergi ve harçlar" },
      {
        type: "paragraph",
        text: "Varış ülkesine göre vergiler ödeme sırasında veya varışta uygulanabilir. Toplam tutar, ödemeden önce nelerin dahil olduğunu gösterir.",
      },
      {
        type: "callout",
        text: "Uygun sipariş tutarlarında ücretsiz ekspres kargo sunulabilir—uygunluk için sepete bakınız.",
      },
    ],
  ),
  returns: page(
    "İade ve Değişim",
    "Beden değişimi ve iade yönergeleri.",
    [
      {
        type: "paragraph",
        text: "Uygun tam fiyatlı ürünler için teslimattan itibaren 14 günlük iade/değişim süresi geçerlidir; ürünler orijinal durumda ve etiketli olmalıdır.",
      },
      { type: "heading", level: 2, text: "Uygunluk" },
      {
        type: "list",
        items: [
          "Giyilmemiş, yıkanmamış ve mümkünse orijinal ambalajlı parçalar.",
          "Stok uygunsa beden değişimine öncelik verilir.",
          "Son indirim, kişiselleştirilmiş veya iç katman ürünler kapsam dışı olabilir.",
        ],
      },
      { type: "heading", level: 2, text: "Nasıl başlanır" },
      {
        type: "paragraph",
        text: "Sipariş numarası ve tercih (değişim veya iade) ile danışmana yazın. İade kargo talimatları iletilecektir.",
      },
    ],
  ),
  faq: page(
    "Sıkça Sorulan Sorular",
    "Beden, kargo ve bakım hakkında sık sorulanlar.",
    [
      {
        type: "faq",
        items: [
          {
            question: "Doğru abaya boyunu nasıl seçerim?",
            answer:
              "Tablo boyunu boyunuz ve tercih ettiğiniz etek ucuyla eşleştirin. İki beden arasındaysanız daha uzun döküm veya daha net ayak bileği bitişi tercihine göre seçin; gerekirse danışmandan yardım isteyin.",
          },
          {
            question: "Özel boy sunuyor musunuz?",
            answer:
              "Evet. Atölye kapasitesine bağlı olarak stil danışmanı üzerinden özel boy ayarlamaları yapılabilir.",
          },
          {
            question: "Hangi para birimleri desteklenir?",
            answer:
              "Butik varsayılan olarak Türk Lirası (TRY) kullanır ve uygun olduğunda ek bölgesel para birimlerini destekler.",
          },
          {
            question: "Keten abayalar nasıl saklanmalı?",
            answer:
              "Geniş askıda nefes alan bir alanda asın veya hafifçe katlayın. Uzun süreli baskıdan ve nem tutan plastik örtülerden kaçının.",
          },
        ],
      },
    ],
  ),
  about: page(
    "Miracımız ve Hikâyemiz",
    "Linen Line Store’un hikâyesi.",
    [
      {
        type: "paragraph",
        text: "Linen Line Store, ince keten ve premium kumaşlardan üretilmiş zarif abayalara odaklanan bir mütevazı moda butiğidir—zamansız zarafete kök salmış modern silüetler.",
      },
      { type: "heading", level: 2, text: "Ustalık ve sükûnet" },
      {
        type: "paragraph",
        text: "Her parça hareket özgürlüğü, nefes alan konfor ve günlükten özel davetlere uzanan sakin bir lüks için tasarlanır.",
      },
    ],
  ),
  philosophy: page(
    "Keten Felsefesi",
    "Koleksiyonun merkezinde neden keten var.",
    [
      {
        type: "paragraph",
        text: "Keten dürüstlüğü için seçilir: nefes alır, dayanır ve güzel bir doğallık taşır. Zamanla yumuşar ve mütevazı giyime yakışır.",
      },
      {
        type: "list",
        items: [
          "Sıcak iklimler ve uzun kullanım için nefes alabilirlik.",
          "Zarif dökümlenen mat, rafine bir tutuş.",
          "Trend döngülerinden çok uzun ömür için seçilen malzemeler.",
        ],
      },
    ],
  ),
  sustainability: page(
    "Zanaatkâr Üretim",
    "Linen Line’ın ustalık ve sorumlu üretime yaklaşımı.",
    [
      {
        type: "paragraph",
        text: "Küçük partilere özen, bilinçli kumaşlar ve dayanıklı dikim israfı azaltır ve her abayanın arkasındaki emeği onurlandırır.",
      },
      { type: "heading", level: 2, text: "Taahhütlerimiz" },
      {
        type: "list",
        items: [
          "Uzun ömürlü lif ve finish önceliği.",
          "Titiz bitiş standartlarına bağlı atölyelerle çalışma.",
          "Haftalar değil, sezonlar boyunca giyilecek çok yönlü parçalar.",
        ],
      },
    ],
  ),
  boutiques: page(
    "Butik Konumları",
    "Linen Line’ı ziyaret edin veya stil randevusu alın.",
    [
      {
        type: "paragraph",
        text: "Randevular ve sezonluk pop-up’lar bülten ve sosyal kanallarda duyurulur. Özel stil seansları danışman ekibiyle ayarlanabilir.",
      },
      {
        type: "callout",
        text: "Adres ve rezervasyon bilgileri konumlar uç noktası hazır olduğunda sunulacaktır.",
      },
    ],
  ),
  contact: page(
    "Ekibimizle İletişim",
    "Linen Line danışman ekibine ulaşın.",
    [
      {
        type: "paragraph",
        text: "Beden danışmanlığı, sipariş desteği veya stil soruları için ekibimiz yardıma hazırdır.",
      },
      { type: "heading", level: 2, text: "Doğrudan iletişim" },
      {
        type: "list",
        items: [
          "E-posta — concierge@linenlinestore.com",
          "Saatler — Pazartesi–Cumartesi, 09:00–21:00 (GMT+3)",
          "WhatsApp — danışman saatlerinde site alt bilgisinden erişilebilir",
        ],
      },
    ],
  ),
};

const BY_LOCALE: Record<Locale, Record<ContentPageSlug, LocalizedPage>> = {
  en: EN,
  ar: AR,
  tr: TR,
};

export function getMockContentPage(
  slug: string,
  locale: Locale,
): ContentPage | null {
  if (!isContentPageSlug(slug)) return null;

  const localized = BY_LOCALE[locale]?.[slug] ?? BY_LOCALE.en[slug];
  if (!localized) return null;

  return { slug, ...localized };
}

export function getAllContentPageSlugs(): ContentPageSlug[] {
  return [...CONTENT_PAGE_SLUGS];
}
