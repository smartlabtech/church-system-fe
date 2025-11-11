import {
  FaUserCheck,
  FaBible,
  FaGift,
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaComments,
  FaSyncAlt,
  FaMobileAlt,
  FaClipboardCheck,
  FaStar,
  FaBullseye,
  FaQuestionCircle,
  FaAward
} from "react-icons/fa"

export const purposeCategories = [
  {
    id: "attendance",
    title: {
      ar: "الحضور والمتابعة",
      en: "Attendance & Follow-up"
    },
    icon: FaUserCheck,
    color: "primary",
    problems: [
      {
        title: {
          ar: "استمرارية تسجيل الحضور",
          en: "Attendance Tracking Continuity"
        },
        description: {
          ar: "ضمان استمرارية تسجيل الحضور في كل اجتماع حتى في حالة الغياب، مع متابعة دقيقة لنسب الحضور ومكافأة الملتزمين بنقاط الحضور",
          en: "Ensure continuous attendance tracking at every meeting even when absent, with accurate monitoring of attendance rates and rewarding consistent members with attendance points"
        },
        icon: FaUserCheck
      },
      {
        title: {
          ar: "متابعة الافتقاد",
          en: "Visit Tracking"
        },
        description: {
          ar: "معرفة آخر موعد افتقاد لكل شخص بسهولة، مع إمكانية التحديث الفوري والمشاركة بين جميع الخدام",
          en: "Easily track the last visit date for each person, with instant updates shared across all servants"
        },
        icon: FaCalendarAlt
      }
    ]
  },
  {
    id: "bible-study",
    title: {
      ar: "دراسة الكتاب المقدس",
      en: "Bible Study"
    },
    icon: FaBible,
    color: "accent",
    problems: [
      {
        title: {
          ar: "استمرارية مسابقة الكتاب المقدس",
          en: "Bible Quiz Continuity"
        },
        description: {
          ar: "إدارة مسابقات الكتاب المقدس بشكل مستمر مع تصحيح فوري ومتابعة النقاط أسبوعياً لكل مشترك",
          en: "Manage Bible quizzes continuously with instant correction and weekly score tracking for each participant"
        },
        icon: FaBible
      },
      {
        title: {
          ar: "معرفة النتائج الفورية",
          en: "Instant Results"
        },
        description: {
          ar: "عرض نتائج المسابقة فوراً للمشترك مع توضيح الإجابات الصحيحة والخاطئة، وإظهار الهدايا المتاحة للوصول إليها لتحفيز المشاركة المستمرة",
          en: "Display quiz results instantly with correct/incorrect answers, and show available rewards to motivate continuous participation"
        },
        icon: FaClipboardCheck
      }
    ]
  },
  {
    id: "rewards",
    title: {
      ar: "الهدايا والمكافآت",
      en: "Rewards & Incentives"
    },
    icon: FaGift,
    color: "secondary",
    problems: [
      {
        title: {
          ar: "اختيار الهدايا المناسبة",
          en: "Choosing Appropriate Rewards"
        },
        description: {
          ar: "نظام متجر نقاط ذكي يسمح للأعضاء باختيار هداياهم المفضلة، مما يضمن رضاهم التام ويوفر وقت الخدام",
          en: "Smart points store system allowing members to choose their preferred rewards, ensuring satisfaction and saving servants' time"
        },
        icon: FaGift
      },
      {
        title: {
          ar: "تحفيز المشاركة",
          en: "Participation Motivation"
        },
        description: {
          ar: "نظام نقاط شفاف يوضح للأعضاء إنجازاتهم والهدايا المتاحة، مما يحفزهم على المشاركة الفعالة والمستمرة",
          en: "Transparent points system showing members their achievements and available rewards, motivating active and continuous participation"
        },
        icon: FaAward
      }
    ]
  },
  {
    id: "participation",
    title: {
      ar: "المشاركة والحضور",
      en: "Participation & Engagement"
    },
    icon: FaUsers,
    color: "green",
    problems: [
      {
        title: {
          ar: "متابعة الأعضاء غير النشطين",
          en: "Tracking Inactive Members"
        },
        description: {
          ar: "رصد تلقائي للأعضاء الذين لم يشاركوا في الأنشطة والرحلات خلال العام، مع إمكانية التواصل المباشر معهم ودعوتهم للمشاركة",
          en: "Automatic tracking of members who haven't participated in activities or trips throughout the year, with direct communication options to invite them"
        },
        icon: FaUsers
      },
      {
        title: {
          ar: "إدارة الأعضاء الضيوف",
          en: "Guest Management"
        },
        description: {
          ar: "تسجيل ومتابعة الأعضاء الذين يحضرون فقط في المناسبات الخاصة، مع التحقق من انتمائهم والحفاظ على حقوق الأعضاء الدائمين",
          en: "Register and track members who only attend special events, verifying their affiliation while preserving regular members' rights"
        },
        icon: FaClipboardCheck
      }
    ]
  },
  {
    id: "communication",
    title: {
      ar: "التواصل والبيانات",
      en: "Communication & Data"
    },
    icon: FaSyncAlt,
    color: "cyan",
    problems: [
      {
        title: {
          ar: "مركزية البيانات",
          en: "Centralized Data"
        },
        description: {
          ar: "قاعدة بيانات موحدة ومحدثة فورياً يمكن الوصول إليها من أي مكان، مع مشاركة التحديثات تلقائياً بين جميع الخدام",
          en: "Unified, instantly updated database accessible from anywhere, with automatic updates shared across all servants"
        },
        icon: FaSyncAlt
      },
      {
        title: {
          ar: "سهولة التواصل",
          en: "Easy Communication"
        },
        description: {
          ar: "الوصول السريع لبيانات التواصل الصحيحة والمحدثة لأي عضو من خلال الهاتف المحمول دون الحاجة للبحث في ملفات متعددة",
          en: "Quick access to correct and updated contact information for any member via mobile without searching through multiple files"
        },
        icon: FaMobileAlt
      },
      {
        title: {
          ar: "دقة البيانات",
          en: "Data Accuracy"
        },
        description: {
          ar: "نظام تحقق من البيانات المدخلة مع إمكانية المراجعة والتعديل من قبل المسؤولين لضمان صحة المعلومات",
          en: "Data verification system with review and editing capabilities by administrators to ensure information accuracy"
        },
        icon: FaFileAlt
      }
    ]
  },
  {
    id: "events",
    title: {
      ar: "الفعاليات والأحداث",
      en: "Events & Activities"
    },
    icon: FaCalendarAlt,
    color: "violet",
    problems: [
      {
        title: {
          ar: "إدارة حجوزات الفعاليات",
          en: "Event Booking Management"
        },
        description: {
          ar: "نظام حجز مركزي للفعاليات والرحلات مع إدارة تلقائية للفرق والغرف، وتسهيل عملية التنظيم الكاملة",
          en: "Centralized event and trip booking system with automatic team and room management, simplifying the entire organization process"
        },
        icon: FaCalendarAlt
      },
      {
        title: {
          ar: "جمع التقييمات والاقتراحات",
          en: "Feedback Collection"
        },
        description: {
          ar: "منصة موحدة لجمع تقييمات الأعضاء بشكل منظم والعمل عليها بشكل مستمر، مع ضمان عدم فقدانها عند تغيير الخدام",
          en: "Unified platform to systematically collect and act on member feedback continuously, ensuring nothing is lost when servants change"
        },
        icon: FaStar
      }
    ]
  },
  {
    id: "engagement",
    title: {
      ar: "التفاعل والمشاركة",
      en: "Interaction & Engagement"
    },
    icon: FaComments,
    color: "orange",
    problems: [
      {
        title: {
          ar: "التقييم المستمر",
          en: "Continuous Evaluation"
        },
        description: {
          ar: "نظام تقييم دائم يتيح للشباب التعبير عن آرائهم واحتياجاتهم بشأن الاجتماعات والأنشطة بشكل مستمر",
          en: "Permanent evaluation system allowing youth to continuously express their opinions and needs regarding meetings and activities"
        },
        icon: FaComments
      },
      {
        title: {
          ar: "توثيق الأنشطة والأهداف",
          en: "Activities Documentation"
        },
        description: {
          ar: "منصة مركزية لتوثيق جميع أنشطة الاجتماع وأهدافها، بحيث يمكن لأي عضو جديد الاطلاع عليها بسهولة دون الحاجة لشرح فردي",
          en: "Central platform documenting all meeting activities and goals, allowing new members to easily access them without individual explanations"
        },
        icon: FaBullseye
      },
      {
        title: {
          ar: "صندوق الأسئلة الدائم",
          en: "Permanent Q&A Box"
        },
        description: {
          ar: "نظام دائم لجمع أسئلة واستفسارات الشباب لا يعتمد على شخص واحد، مما يضمن استمراريته وفعاليته على المدى الطويل",
          en: "Permanent system for collecting youth questions and inquiries not dependent on one person, ensuring long-term continuity and effectiveness"
        },
        icon: FaQuestionCircle
      }
    ]
  }
]
