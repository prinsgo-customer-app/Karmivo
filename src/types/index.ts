export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  mobile: string;
  profilePhoto?: string;
  role: 'CUSTOMER' | 'PARTNER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

export interface AppConfig {
  appName: string;
  tagline: string;
  logoUrl?: string;
  features: {
    wallet: boolean;
    subscription: boolean;
    referral: boolean;
    advertisement: boolean;
    googleLogin: boolean;
    facebookLogin: boolean;
    otpLogin: boolean;
    passwordLogin: boolean;
  };
  homeSections: string[]; // e.g. ['banner', 'search', 'categories', 'offers']
  supportPhone?: string;
  supportEmail?: string;
  emergencyNumbers: { label: string; number: string }[];
  referralRewardAmount?: number;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  linkUrl?: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  icon?: string;
  description?: string;
  active: boolean;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  pricingUnit: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  estimatedTime?: string;
  active: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  serviceId: string;
  status: 'REQUESTED' | 'SEARCHING' | 'ASSIGNED' | 'ACCEPTED' | 'ARRIVING' | 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCEL_REQUESTED' | 'CANCELLED' | 'PAYMENT_PENDING' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED';
  location: string;
  amount: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Address {
  id: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  fullAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  serviceId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
