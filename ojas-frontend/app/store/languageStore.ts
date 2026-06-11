import { create } from 'zustand';

export type Language = 'en' | 'hi' | 'pa' | 'it' | 'zh' | 'fr';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (typeof window !== 'undefined' ? (localStorage.getItem('language') as Language) : 'en') || 'en',
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    set({ language: lang });
  },
}));

export const translations = {
  en: {
    // Nav links
    dashboard: "Dashboard",
    rituals: "Rituals",
    prakriti: "Prakriti",
    cycle: "Cycle",
    music: "Music",
    aahar: "Aahar",
    sleep: "Sleep",
    jyotish: "Jyotish",
    wellness: "Wellness",
    insights: "Insights",
    logout: "Logout",
    login: "Login",
    register: "Register",
    signIn: "Sign In",
    
    // Dinacharya Phases
    "phase.morning": "Morning",
    "phase.afternoon": "Afternoon",
    "phase.evening": "Evening",
    "phase.night": "Night",
    
    // Profile Panel Headers
    profilePanel: "Profile Settings",
    editProfile: "Edit Profile",
    save: "Save",
    cancel: "Cancel",
    
    // Account settings
    account: "Account",
    changeEmail: "Change Email",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
    newEmail: "New Email",
    password: "Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmDeleteMessage: "This action is permanent and cannot be undone",
    deleteButton: "Delete Permanently",
    
    // App Settings
    settings: "Settings",
    dayMode: "Day Mode",
    nightMode: "Night Mode",
    notifications: "Notification Preferences",
    receiveNotifications: "Receive notifications",
    
    // Language
    language: "Language",
    preferredLanguage: "Preferred Language",
    
    // Support & Info
    getHelp: "Get Help",
    supportForm: "Support Contact Form",
    subject: "Subject",
    message: "Message",
    submitMessage: "Send Message",
    supportSuccess: "Thank you! We will get back to you shortly.",
    
    learnMore: "Learn More",
    tutorials: "Tutorials — how to use the app",
    usagePolicy: "Usage Policy",
    privacyPolicy: "Privacy Policy",
    
    // Additional Profile info
    fullName: "Full Name",
    emailAddress: "Email Address",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    rituals: "अनुष्ठान",
    prakriti: "प्रकृति",
    cycle: "चक्र",
    music: "संगीत",
    aahar: "आहार",
    sleep: "नींद",
    jyotish: "ज्योतिष",
    wellness: "कल्याण",
    insights: "अंतर्दृष्टि",
    logout: "लॉग आउट",
    login: "लॉग इन",
    register: "पंजीकरण",
    signIn: "साइन इन",
    
    // Dinacharya Phases
    "phase.morning": "सुबह",
    "phase.afternoon": "दोपहर",
    "phase.evening": "शाम",
    "phase.night": "रात",
    
    profilePanel: "प्रोफ़ाइल सेटिंग्स",
    editProfile: "प्रोफ़ाइल संपादित करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    
    account: "खाता",
    changeEmail: "ईमेल बदलें",
    changePassword: "पासवर्ड बदलें",
    deleteAccount: "खाता हटाएं",
    newEmail: "नया ईमेल",
    password: "पासवर्ड",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmDeleteMessage: "यह क्रिया स्थायी है और इसे पूर्ववत नहीं किया जा सकता",
    deleteButton: "स्थायी रूप से हटाएं",
    
    settings: "सेटिंग्स",
    dayMode: "दिन मोड",
    nightMode: "रात मोड",
    notifications: "अधिसूचना प्राथमिकताएं",
    receiveNotifications: "अधिसूचनाएं प्राप्त करें",
    
    language: "भाषा",
    preferredLanguage: "पसंदीदा भाषा",
    
    getHelp: "मदद लें",
    supportForm: "सहायता संपर्क फ़ॉर्म",
    subject: "विषय",
    message: "संदेश",
    submitMessage: "संदेश भेजें",
    supportSuccess: "धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।",
    
    learnMore: "अधिक जानें",
    tutorials: "ट्यूटोरियल — ऐप का उपयोग कैसे करें",
    usagePolicy: "उपयोग नीति",
    privacyPolicy: "गोपनीयता नीति",
    
    fullName: "पूरा नाम",
    emailAddress: "ईमेल पता",
  },
  pa: {
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    rituals: "ਰੀਤੀ ਰਿਵਾਜ",
    prakriti: "ਪ੍ਰਕ੍ਰਿਤੀ",
    cycle: "ਚੱਕਰ",
    music: "ਸੰਗੀਤ",
    aahar: "ਆਹਾਰ",
    sleep: "ਨੀਂਦ",
    jyotish: "ਜਯੋਤਿਸ਼",
    wellness: "ਕਲਿਆਣ",
    insights: "ਸੂਝ-ਬੂਝ",
    logout: "ਲੌਗ ਆਉਟ",
    login: "ਲੌਗਇਨ",
    register: "ਰਜਿਸਟਰ",
    signIn: "ਸਾਈਨ ਇਨ",
    
    // Dinacharya Phases
    "phase.morning": "ਸਵੇਰ",
    "phase.afternoon": "ਦੁਪਹਿਰ",
    "phase.evening": "ਸ਼ਾਮ",
    "phase.night": "ਰਾਤ",
    
    profilePanel: "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ",
    editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
    save: "ਸੰਭਾਲੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    
    account: "ਖਾਤਾ",
    changeEmail: "ਈਮੇਲ ਬਦਲੋ",
    changePassword: "ਪਾਸਵਰਡ ਬਦਲੋ",
    deleteAccount: "ਖਾਤਾ ਮਿਟਾਓ",
    newEmail: "ਨਵੀਂ ਈਮੇਲ",
    password: "ਪਾਸਵਰਡ",
    currentPassword: "ਮੌਜੂਦਾ ਪਾਸਵਰਡ",
    newPassword: "ਨਵਾਂ ਪਾਸਵਰਡ",
    confirmDeleteMessage: "ਇਹ ਕਾਰਵਾਈ ਸਥਾਈ ਹੈ ਅਤੇ ਇਸਨੂੰ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ",
    deleteButton: "ਸਥਾਈ ਤੌਰ 'ਤੇ ਮਿਟਾਓ",
    
    settings: "ਸੈਟਿੰਗਾਂ",
    dayMode: "ਦਿਨ ਮੋਡ",
    nightMode: "ਰਾਤ ਮੋਡ",
    notifications: "ਨੋਟੀਫਿਕੇਸ਼ਨ ਤਰਜੀਹਾਂ",
    receiveNotifications: "ਨੋਟੀਫਿਕੇਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ",
    
    language: "ਭਾਸ਼ਾ",
    preferredLanguage: "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
    
    getHelp: "ਮਦਦ ਲਓ",
    supportForm: "ਸਹਾਇਤਾ ਸੰਪਰਕ ਫਾਰਮ",
    subject: "ਵਿਸ਼ਾ",
    message: "ਸੰਦੇਸ਼",
    submitMessage: "ਸੰਦੇਸ਼ ਭੇਜੋ",
    supportSuccess: "ਧੰਨਵਾਦ! ਅਸੀਂ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਾਂਗੇ।",
    
    learnMore: "ਹੋਰ ਜਾਣੋ",
    tutorials: "ਟਿਊਟੋਰਿਅਲ — ਐਪ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ",
    usagePolicy: "ਵਰਤੋਂ ਨੀਤੀ",
    privacyPolicy: "ਗੋਪਨੀਯਤਾ ਨੀਤੀ",
    
    fullName: "ਪੂਰਾ ਨਾਮ",
    emailAddress: "ਈਮੇਲ ਪਤਾ",
  },
  it: {
    dashboard: "Cruscotto",
    rituals: "Rituali",
    prakriti: "Prakriti",
    cycle: "Ciclo",
    music: "Musica",
    aahar: "Aahar",
    sleep: "Sonno",
    jyotish: "Jyotish",
    wellness: "Benessere",
    insights: "Approfondimenti",
    logout: "Disconnettersi",
    login: "Accedi",
    register: "Registrati",
    signIn: "Accedi",
    
    // Dinacharya Phases
    "phase.morning": "Mattina",
    "phase.afternoon": "Pomeriggio",
    "phase.evening": "Sera",
    "phase.night": "Notte",
    
    profilePanel: "Impostazioni Profilo",
    editProfile: "Modifica Profilo",
    save: "Salva",
    cancel: "Annulla",
    
    account: "Account",
    changeEmail: "Cambia Email",
    changePassword: "Cambia Password",
    deleteAccount: "Elimina Account",
    newEmail: "Nuova Email",
    password: "Password",
    currentPassword: "Password Corrente",
    newPassword: "Nuova Password",
    confirmDeleteMessage: "Questa azione è permanente e non può essere annullata",
    deleteButton: "Elimina Permanentemente",
    
    settings: "Impostazioni",
    dayMode: "Modalità Giorno",
    nightMode: "Modalità Notte",
    notifications: "Preferenze Notifiche",
    receiveNotifications: "Ricevi notifiche",
    
    language: "Lingua",
    preferredLanguage: "Lingua preferita",
    
    getHelp: "Aiuto",
    supportForm: "Modulo di Supporto",
    subject: "Oggetto",
    message: "Messaggio",
    submitMessage: "Invia Messaggio",
    supportSuccess: "Grazie! Ti risponderemo al più presto.",
    
    learnMore: "Ulteriori informazioni",
    tutorials: "Tutorial — come usare l'applicazione",
    usagePolicy: "Politica di Utilizzo",
    privacyPolicy: "Informativa sulla Privacy",
    
    fullName: "Nome Completo",
    emailAddress: "Indirizzo Email",
  },
  zh: {
    dashboard: "仪表板",
    rituals: "仪式",
    prakriti: "体质",
    cycle: "生理周期",
    music: "音乐",
    aahar: "食育",
    sleep: "睡眠",
    jyotish: "吠陀占星",
    wellness: "健康",
    insights: "洞察",
    logout: "登出",
    login: "登录",
    register: "注册",
    signIn: "登录",
    
    // Dinacharya Phases
    "phase.morning": "早晨",
    "phase.afternoon": "中午/下午",
    "phase.evening": "傍晚/黄昏",
    "phase.night": "夜晚",
    
    profilePanel: "个人设置",
    editProfile: "编辑资料",
    save: "保存",
    cancel: "取消",
    
    account: "账户",
    changeEmail: "更改邮箱",
    changePassword: "修改密码",
    deleteAccount: "注销账户",
    newEmail: "新电子邮箱",
    password: "密码",
    currentPassword: "当前密码",
    newPassword: "新密码",
    confirmDeleteMessage: "此操作不可逆，且无法撤销",
    deleteButton: "永久删除",
    
    settings: "设置",
    dayMode: "日间模式",
    nightMode: "夜间模式",
    notifications: "通知偏好",
    receiveNotifications: "接收通知",
    
    language: "语言",
    preferredLanguage: "偏好语言",
    
    getHelp: "获取帮助",
    supportForm: "支持联系表单",
    subject: "主题",
    message: "内容",
    submitMessage: "发送消息",
    supportSuccess: "谢谢！我们会尽快回复您。",
    
    learnMore: "了解更多",
    tutorials: "使用教程",
    usagePolicy: "使用条款",
    privacyPolicy: "隐私政策",
    
    fullName: "姓名",
    emailAddress: "电子邮箱",
  },
  fr: {
    dashboard: "Tableau de bord",
    rituals: "Rituels",
    prakriti: "Prakriti",
    cycle: "Cycle",
    music: "Musique",
    aahar: "Aahar",
    sleep: "Sommeil",
    jyotish: "Jyotish",
    wellness: "Bien-être",
    insights: "Perspectives",
    logout: "Se déconnecter",
    login: "Connexion",
    register: "S'inscrire",
    signIn: "Se connecter",
    
    // Dinacharya Phases
    "phase.morning": "Matin",
    "phase.afternoon": "Après-midi",
    "phase.evening": "Soirée",
    "phase.night": "Nuit",
    
    profilePanel: "Paramètres de Profil",
    editProfile: "Modifier le Profil",
    save: "Enregistrer",
    cancel: "Annuler",
    
    account: "Compte",
    changeEmail: "Modifier l'Email",
    changePassword: "Modifier le Mot de Passe",
    deleteAccount: "Supprimer le Compte",
    newEmail: "Nouvel Email",
    password: "Mot de passe",
    currentPassword: "Mot de Passe Actuel",
    newPassword: "Nouveau Mot de Passe",
    confirmDeleteMessage: "Cette action est définitive et ne peut pas être annulée",
    deleteButton: "Supprimer Définitivement",
    
    settings: "Paramètres",
    dayMode: "Mode Jour",
    nightMode: "Mode Nuit",
    notifications: "Préférences de Notification",
    receiveNotifications: "Recevoir des notifications",
    
    language: "Langue",
    preferredLanguage: "Langue préférée",
    
    getHelp: "Obtenir de l'aide",
    supportForm: "Formulaire de Contact de Support",
    subject: "Sujet",
    message: "Message",
    submitMessage: "Envoyer le Message",
    supportSuccess: "Merci! Nous vous répondrons sous peu.",
    
    learnMore: "En savoir plus",
    tutorials: "Tutoriels — comment utiliser l'application",
    usagePolicy: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialité",
    
    fullName: "Nom Complet",
    emailAddress: "Adresse Email",
  }
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  const t = (key: keyof typeof translations['en']) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };
  return { t, language };
};
