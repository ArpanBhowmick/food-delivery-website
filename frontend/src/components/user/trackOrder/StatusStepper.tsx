import { Fragment } from "react";
import {
  Check,
  ChefHat,
  Home,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";

// Tracking types

type TrackingStepKey = "placed" | "preparing" | "outForDelivery" | "delivered";

interface TrackingStep {
  key: TrackingStepKey;
  label: string;
  caption: string;
  icon: LucideIcon;
}

// Progress timeline
const trackingSteps: TrackingStep[] = [
  {
    key: "placed",
    label: "Order Placed",
    caption: "Order confirmed",
    icon: Package,
  },
  {
    key: "preparing",
    label: "Preparing",
    caption: "Being freshly cooked",
    icon: ChefHat,
  },
  {
    key: "outForDelivery",
    label: "Out for Delivery",
    caption: "Rider on the way",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    caption: "Enjoy your meal",
    icon: Home,
  },
];

export default function StatusStepper({
  current,
}: {
  current: TrackingStepKey;
}) {
  const currentIndex = trackingSteps.findIndex((step) => step.key === current);

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[680px] items-start">
        {trackingSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <Fragment key={step.key}>
              {index > 0 && (
                <li
                  aria-hidden
                  className={`mt-6 h-0.5 flex-1 rounded-full ${
                    index <= currentIndex ? "bg-[#12c669]" : "bg-slate-200"
                  }`}
                />
              )}

              <li className="flex w-44 flex-col items-center px-1 text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    isComplete
                      ? "bg-[#12c669] text-white"
                      : isCurrent
                        ? "bg-[#fc5a32] text-white ring-4 ring-[#fc5a32]/20"
                        : "border-2 border-slate-200 bg-white text-slate-300"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                <p
                  className={`mt-3 text-sm font-semibold ${
                    isCurrent
                      ? "text-slate-900"
                      : isComplete
                        ? "text-slate-700"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>

                <p
                  className={`mt-0.5 text-xs ${
                    isCurrent ? "font-medium text-[#fc5a32]" : "text-slate-400"
                  }`}
                >
                  {step.caption}
                </p>

                {isCurrent && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#fc5a32]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#fc5a32]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fc5a32]" />
                    In progress
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
