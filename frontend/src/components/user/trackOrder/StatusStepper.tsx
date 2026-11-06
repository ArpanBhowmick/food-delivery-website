import { MapPin, ChefHat, Navigation2 } from "lucide-react";

interface UserActiveOrderProps {
  selectedAddress?: string;
  onTrackOrder?: () => void;
}

export default function StatusStepper({
  selectedAddress = "123 Main St, City",
  onTrackOrder = () => {},
}: UserActiveOrderProps) {
  return (
    <section id="active-order-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10">
      <div className="bg-white rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm border border-purple-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-5 lg:gap-6 relative overflow-hidden ring-1 ring-purple-100/60">
        {/* Order Info */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 overflow-hidden shrink-0 shadow-xs border border-purple-100">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPYSO5M3JcmeHMMexFwTYcf4QmpFyel8FABJ9z04DzlB024YVepV0jwD-aSMKngih1x1vD5-ECsErnbqr3ohLlo1ZibrmdP8zwVajarmbCW6eza_btkRtN5u8hPWBG8sV9DX7LvgBB2aTOTmOamkrhyxAEWLpLafjnFtwZ3wdv0y8Eet7DhqJIeM5iGZEZMn5vo5lYtsroA7GNCaANa1lSf0n0re-f4rhaRJw8YUhdkg3BxUhly6Px"
              alt="Bella Napoli Pizza"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Preparation
              </span>
              <span className="text-[12px] font-semibold text-slate-400">
                Order #Z-84920
              </span>
            </div>
            <h3 className="text-[17px] sm:text-[19px] font-bold text-[#0f172a] truncate">
              Bella Napoli Pizzeria
            </h3>
            <p className="text-[13px] text-slate-600 truncate">
              2 items: Margherita Pizza x1, Truffle Fries x1
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 text-[12px] pt-0.5">
              <MapPin className="w-4 h-4 text-[#6d28d9] shrink-0" />
              <span className="truncate">Delivering to {selectedAddress}</span>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="flex-1 w-full min-w-0 max-w-full lg:max-w-xl py-3 px-3 sm:px-4 rounded-2xl bg-[#f8f7ff] border border-purple-100/80 flex flex-col justify-center space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] sm:text-[12px] md:text-[13px]">
            <span className="text-[#6d28d9] font-bold flex items-center gap-1.5 min-w-0">
              <ChefHat className="w-4 h-4 text-[#6d28d9] shrink-0" />
              <span className="truncate">Preparing your order</span>
            </span>
            <span className="text-slate-500 font-medium text-[10px] sm:text-[11px] md:text-[12px] whitespace-nowrap">
              Est. delivery in 18 mins
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="h-1.5 sm:h-2 rounded-full bg-[#6d28d9]" />
            <div className="h-1.5 sm:h-2 rounded-full bg-[#6d28d9] relative overflow-hidden">
              <div className="w-full h-full bg-[#a855f7] animate-pulse" />
            </div>
            <div className="h-1.5 sm:h-2 rounded-full bg-purple-100" />
          </div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium">
            <span className="text-[#6d28d9] font-semibold">Confirmed</span>
            <span className="text-[#6d28d9] font-bold">Preparing</span>
            <span>Out for delivery</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center lg:flex-col justify-stretch sm:justify-end gap-2 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onTrackOrder}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Navigation2 className="w-4 h-4" />
            <span>Track Order</span>
          </button>
        </div>
      </div>
    </section>
  );
}
