export interface HeroSlide {
  id: number
  tagIcon: string
  tagText: string
  titleLine1: string
  titleLine2: string
  titleHighlight: string
  description: string
  buttonText: string
  buttonCategory: string
  searchKeyword: string
  accentColor: string
  bgGradient: string
  imageUrl: string
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    tagIcon: '🍔',
    tagText: 'CRAFT BURGERS & SIDES',
    titleLine1: 'Stacked with Character.',
    titleLine2: 'Savor Every Layer.',
    titleHighlight: 'text-amber-400',
    description: 'Artisan dry-aged patties, brioche buns baked daily at dawn, and secret truffle remoulade from downtown kitchens.',
    buttonText: 'Explore Burgers →',
    buttonCategory: 'Burgers',
    searchKeyword: 'Smash Burger',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoZ8I0wEI93QDVMOvu6HXZbEhaWBaxDohh09lw_MmQ7MajTYmoKUZIrdPXxS--qAwCya95VaAU9AjRCvkTlE0EcaqGSw6yBoaAnoK-VhBd5gYHZ6q5mSS887vqvUbcF4pSNtRvewnsL6GJGZjeIL6V1y2yaPWwpFdgLt6zl87wI-AYDoV4-DWz1qyh6ECe1BODlIJewwssb0DcaNgNvML8aevOXgm8SKp-PxMhv_l4u61fyNkAulZi'
  },
  {
    id: 1,
    tagIcon: '🍕',
    tagText: 'WOOD-FIRED ARTISAN PIZZA',
    titleLine1: 'Slow-Matured Dough.',
    titleLine2: 'Blistered to Perfection.',
    titleHighlight: 'text-rose-400',
    description: 'San Marzano D.O.P. tomatoes, tear-fresh Fior di Latte, and 48-hour fermented crust fired at 900°F.',
    buttonText: 'Discover Pizza →',
    buttonCategory: 'Pizza',
    searchKeyword: 'Sourdough Pizza',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNghzqN-oU2BrD7zp2ZlD4LMOcSqAtBj7eoh8mqTp-fy6yajiGWwCpnE_sIOgkiPpbutKj5SCfJuKZ_VMob-2sVBpzWq13Tx7CYGoEMdeee60PPwjimJBPR7Gvd3efQjDWUulu3HdjQK7p7oEIG3r4IIjWyn7nBuFnoLdKwkSWEVCfuberqLjPntArM1kzzCgHW1GQdAcLhJFMp8OD6Zxk_h_m_ScVeir7q87dM_zizKeN72RezITJ'
  },
  {
    id: 2,
    tagIcon: '🥤',
    tagText: 'COLD-PRESSED & CRAFT BOTANICALS',
    titleLine1: 'Pure Botanicals.',
    titleLine2: 'Distinctive Refreshment.',
    titleHighlight: 'text-teal-300',
    description: 'Wild berry elixirs, organic citrus infusions, and small-batch iced brews made fresh to order.',
    buttonText: 'Browse Drinks →',
    buttonCategory: 'Others',
    searchKeyword: 'Cold-Pressed Elixir',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWnYYgPl5QcOIH6BRkSbk8L6Je8G4qrvQsnb78Z30_ER6K6uAJ7uxAUYf0VAKRGdd23FTjJ2cvvs5zAxfLGYs8lnPw37lUkj70mbYSapsf1A8h1NGxTFkHDWyiCahh6HgH_pwSeQRmkHlv8bTL0THVFLhjL5Z6YeE_L2qEhDjiTQm4DQbSu_CLRm9UsOZI7mLQ59qwkhYSXkgDTvjlBRBAi9ye3du-rW_av4xxwRrBoRyhhdUJsq38'
  },
  {
    id: 3,
    tagIcon: '🍰',
    tagText: 'PATISSERIE & SWEET FINALES',
    titleLine1: 'Molten Centers.',
    titleLine2: 'Delicate Pastry Delights.',
    titleHighlight: 'text-[#c7aaff]',
    description: 'Valrhona chocolate lava fondants, berry tarts, and Michelin-trained confections to complete your meal.',
    buttonText: 'Indulge in Desserts →',
    buttonCategory: 'Desserts',
    searchKeyword: 'Lava Fondant',
    accentColor: '#a855f7',
    bgGradient: 'from-[#6d28d9] to-[#8b5cf6] hover:from-[#5b21b6] hover:to-[#7c3aed] text-white',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA--svym4cWxRfMxg4pke63EY22Ll31e_6A559hw8MaFa2eTJ7psqNZgnmMSmYO4dWlGT7sjAjelym2U3-GuPu3RtI2t0MOAlyqgZnhdIDfH_ovdMweBuJeTVAM2AsZYlk1QjBxH-edCU9vq2NY5a2zkSNd9F9vHNCUO-u9ds-_JZSp2rXczf4y7N2-KSfam7N_ZQbgpIpxe1QZ4ZL9lY9OA1C1rm2G1NWKg-J-zUfX9kxd1AwyTe0o'
  }
]
