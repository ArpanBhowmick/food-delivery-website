import {
  Banknote,
  Check,
  Clock,
  CreditCard,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Payment details
const mockPayment = {
  method: "upi",
  methodLabel: "UPI",
  statusLabel: "Paid",
  reference: "UPI · xxxxxx4821",
  paidAt: "Today, 7:32 PM",
};

// Pricing summary
const mockPricing = {
  itemTotal: 726,
  deliveryFee: 0,
  discount: 50,
  totalAmount: 676,
};

// Payment icons
const paymentIcons: Record<string, LucideIcon> = {
  cod: Banknote,
  upi: Smartphone,
  card: CreditCard,
};

// Info row component
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="truncate text-sm font-medium text-slate-700">{value}</p>
    </div>
  </div>
);

export default function PaymentInformationCard() {
  const PaymentIcon = paymentIcons[mockPayment.method] ?? Banknote;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-slate-900">
          Payment Information
        </h2>
        <Badge
          variant="outline"
          className="cursor-default rounded-lg border-0 bg-green-100 px-3 py-1 text-green-800"
        >
          {mockPayment.statusLabel}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
          <PaymentIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {mockPayment.methodLabel}
          </p>
          <p className="text-xs text-slate-500">{mockPayment.reference}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <InfoRow
          icon={CreditCard}
          label="Payment method"
          value={mockPayment.methodLabel}
        />
        <InfoRow
          icon={Check}
          label="Payment status"
          value={mockPayment.statusLabel}
        />
        <InfoRow icon={Clock} label="Paid at" value={mockPayment.paidAt} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="text-slate-600">Amount paid</span>
        <span className="font-bold text-slate-900">
          ₹{mockPricing.totalAmount}
        </span>
      </div>
    </Card>
  );
}