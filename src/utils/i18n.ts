import { create } from 'zustand';

// Simple scalable dictionary-based i18n
const translations = {
  en: {
    language: 'English',
    welcomeBack: 'Welcome Back!',
    loginToContinue: 'Login to continue',
    mobile: 'Mobile',
    email: 'Email',
    mobilePlaceholder: 'Mobile Number',
    emailPlaceholder: 'Email Address',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
    homeTitle: 'Services',
    profileTitle: 'Profile',
    walletTitle: 'Wallet',
    ordersTitle: 'Orders',
    notificationsTitle: 'Notifications',
    searchPlaceholder: 'Search for services...',
    currentLocation: 'Current Location',
    recentOrders: 'Recent Orders',
    popularServices: 'Popular Services',
    account: 'Account',
    preferences: 'Preferences',
    supportAndSafety: 'Support & Safety',
    logout: 'Logout',
    // ... add more as needed
  },
  hi: {
    language: 'Hindi',
    welcomeBack: 'वापसी पर स्वागत है!',
    loginToContinue: 'जारी रखने के लिए लॉगिन करें',
    mobile: 'मोबाइल',
    email: 'ईमेल',
    mobilePlaceholder: 'मोबाइल नंबर',
    emailPlaceholder: 'ईमेल पता',
    sendOtp: 'ओटीपी भेजें',
    verifyOtp: 'ओटीपी जांचें',
    homeTitle: 'सेवाएं',
    profileTitle: 'प्रोफ़ाइल',
    walletTitle: 'बटुआ',
    ordersTitle: 'आदेश',
    notificationsTitle: 'सूचनाएं',
    searchPlaceholder: 'सेवाओं की खोज करें...',
    currentLocation: 'वर्तमान स्थान',
    recentOrders: 'हाल के आदेश',
    popularServices: 'लोकप्रिय सेवाएं',
    account: 'खाता',
    preferences: 'प्राथमिकताएं',
    supportAndSafety: 'समर्थन और सुरक्षा',
    logout: 'लॉग आउट',
  },
  mr: {
    language: 'Marathi',
    welcomeBack: 'पुन्हा स्वागत आहे!',
    loginToContinue: 'पुढे जाण्यासाठी लॉग इन करा',
    mobile: 'मोबाईल',
    email: 'ईमेल',
    mobilePlaceholder: 'मोबाईल क्रमांक',
    emailPlaceholder: 'ईमेल पत्ता',
    sendOtp: 'OTP पाठवा',
    verifyOtp: 'OTP तपासा',
    homeTitle: 'सेवा',
    profileTitle: 'प्रोफाइल',
    walletTitle: 'पाकीट',
    ordersTitle: 'ऑर्डर',
    notificationsTitle: 'सूचना',
    searchPlaceholder: 'सेवा शोधा...',
    currentLocation: 'सध्याचे स्थान',
    recentOrders: 'अलीकडील ऑर्डर',
    popularServices: 'लोकप्रिय सेवा',
    account: 'खाते',
    preferences: 'प्राधान्ये',
    supportAndSafety: 'समर्थन आणि सुरक्षा',
    logout: 'बाहेर पडा',
  }
};

type LanguageCode = 'en' | 'hi' | 'mr';

interface I18nState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const useTranslation = create<I18nState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    // Fallback to English if translation is missing in selected language
    return translations[lang][key] || translations['en'][key] || key;
  }
}));
