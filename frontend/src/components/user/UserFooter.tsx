import { ShieldCheck } from "lucide-react";

interface FooterProps {
  onSelectMainCourses?: () => void;
  onCareLinkClick?: (item: string) => void;
}

const CUISINES = [
  "Snacks & Appetizers",
  "Hearty Main Courses",
  "Artisan Pizzas",
  "Craft Burgers",
  "South Indian Classics",
  "North Indian Delights",
];

const CARE_LINKS = [
  "Help Center & FAQs",
  "Track Live Order",
  "Food Quality Pledge",
  "Refund & Cancellation",
  "Partner with Zest",
];

export default function UserFooter({
  onSelectMainCourses,
  onCareLinkClick,
}: FooterProps) {
  return (
    <footer className="w-full bg-[#f3f0ff]/60 border-t border-purple-200/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-12 border-b border-purple-200 lg:grid-cols-4">
          {/* Brand Intro & Pledge */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5b21b6] via-[#6d28d9] to-[#8b5cf6] flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-[18px] -rotate-3 select-none">
                  Z
                </span>
              </div>
              <span className="text-[22px] font-extrabold text-[#1e1b4b] tracking-tight">
                Zest
              </span>
            </div>
            <p className="text-[13px] text-slate-600 max-w-sm leading-relaxed">
              Culinary craftsmanship paired with ultra-fast delivery. Savor
              artisanal meals, daily essentials, and local gourmet favorites
              brought warm to your doorstep.
            </p>
            <div className="flex items-center gap-2 text-[#5b21b6] text-[13px] font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>100% Freshness Guarantee & Food Safety Pledge</span>
            </div>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h4 className="text-[14px] font-bold text-[#0f172a] mb-4">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-600">
              {CUISINES.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => onSelectMainCourses?.()}
                    className="hover:text-[#6d28d9] transition-colors cursor-pointer text-left"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[14px] font-bold text-[#0f172a] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-600">
              {CARE_LINKS.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => onCareLinkClick?.(item)}
                    className="hover:text-[#6d28d9] transition-colors cursor-pointer text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <p>© 2026 Zest Technologies, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#6d28d9] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#6d28d9] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#6d28d9] transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
