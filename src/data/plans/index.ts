export type AIProvider = 'auto' | 'groq' | 'deepseek' | 'gemini' | 'claude' | 'openai' | 'custom';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  questionLimit: number;
  providers: AIProvider[];
  features: string[];
  badge?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export const PLANS: PricingPlan[] = [
  // {
  //   id: 'free-trial',
  //   name: 'FREE Trial',
  //   description: 'Mulai uji coba gratis untuk eksplorasi fitur',
  //   price: 0,
  //   currency: 'Rp',
  //   questionLimit: 10,
  //   providers: ['auto'],
  //   features: [
  //     'Hanya bisa membuat 10 soal',
  //     'Provider Tersedia: Auto',
  //     'Dasar-dasar tes bahasa',
  //     'Akses fitur dasar',
  //     'Support terbatas'
  //   ]
  // },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Paket terjangkau untuk kebutuhan harian',
    price: 10000,
    currency: 'Rp',
    questionLimit: 50,
    providers: ['auto', 'groq', 'deepseek', 'gemini'],
    features: [
      'Hanya bisa membuat 50 soal',
      'Provider Tersedia: Hanya Auto (Groq, Deepseek, Gemini)',
      'Akses semua skill tes',
      'Priority support',
      'Export hasil tes'
    ],
    badge: 'Best Value',
    isPopular: true
  },
  {
    id: 'eksklusif',
    name: 'Eksklusif',
    description: 'Paket lengkap untuk pengguna serius',
    price: 50000,
    originalPrice: 100000,
    currency: 'Rp',
    questionLimit: 200,
    providers: ['auto', 'groq', 'deepseek', 'gemini', 'custom'],
    features: [
      'Bisa membuat 200++ soal',
      'Provider Tersedia: Auto, Groq, Deepseek, Gemini, Custom API KEY',
      'Semua fitur Premium',
      'Custom API key support',
      'Analytics lanjutan',
      'Priority email support'
    ],
    isRecommended: true
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Paket premium untuk kebutuhan profesional',
    price: 200000,
    currency: 'Rp',
    questionLimit: 1000,
    providers: ['auto', 'groq', 'deepseek', 'gemini', 'claude', 'openai', 'custom'],
    features: [
      'Bisa membuat 1000++ soal',
      'Provider Tersedia: Auto, Groq, Deepseek, Gemini, Claude, Open AI, dan Custom API KEY',
      'Semua provider AI terbaik',
      'Custom API key support',
      'Analytics lengkap & reporting',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom integration support'
    ],
    badge: 'Premium'
  }
];

export function formatPrice(plan: PricingPlan): string {
  if (plan.price === 0) {
    return `${plan.currency}0`;
  }
  return `${plan.currency}${plan.price.toLocaleString('id-ID')}`;
}

export function formatPriceWithDiscount(plan: PricingPlan): { current: string; original?: string } {
  if (plan.price === 0) {
    return { current: `${plan.currency}0` };
  }
  
  const current = `${plan.currency}${plan.price.toLocaleString('id-ID')}`;
  
  if (plan.originalPrice) {
    const original = `${plan.currency}${plan.originalPrice.toLocaleString('id-ID')}`;
    return { current, original };
  }
  
  return { current };
}

export function getPlanById(id: string): PricingPlan | undefined {
  return PLANS.find(plan => plan.id === id);
}

export function getProviderDisplayName(provider: AIProvider): string {
  const providerNames: Record<AIProvider, string> = {
    auto: 'Auto',
    groq: 'Groq',
    deepseek: 'Deepseek',
    gemini: 'Gemini',
    claude: 'Claude',
    openai: 'OpenAI',
    custom: 'Custom API Key'
  };
  return providerNames[provider];
}

export function getProvidersDisplay(providers: AIProvider[]): string {
  return providers.map(provider => getProviderDisplayName(provider)).join(', ');
}