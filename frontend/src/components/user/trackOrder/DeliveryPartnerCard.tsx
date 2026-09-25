import { Bike, MapPin, PackageCheck, Phone, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type DeliveryStatus = "available" | "accepted" | "pickedUp" | "delivered";

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  available: "Assigned",
  accepted: "Accepted",
  pickedUp: "Picked up",
  delivered: "Delivered",
};

interface DeliveryPartner {
  name: string;
  mobile: string;
}

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

export default function DeliveryPartnerCard({
  deliveryAddress,
  deliveryPartner,
  deliveryStatus,
}: {
  deliveryAddress: string;
  deliveryPartner: DeliveryPartner | null;
  deliveryStatus?: DeliveryStatus | null;
}) {
  const statusLabel = deliveryStatus ? STATUS_LABELS[deliveryStatus] : null;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm gap-3">
      <h2 className="font-heading text-base font-semibold text-slate-900">
        Delivery Details
      </h2>

      <div className=" flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fc5a32]/10 text-[#fc5a32]">
          <Bike className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">Delivery Partner</p>
          <p className="truncate font-semibold text-slate-900">
            {deliveryPartner?.name ?? "—"}
          </p>
          
        </div>
      </div>

      <div className=" border-t border-slate-100" />

      <div className="space-y-3.5">
        <InfoRow
          icon={Phone}
          label="Contact number"
          value={deliveryPartner?.mobile ?? "—"}
        />

        <InfoRow
          icon={PackageCheck}
          label="Delivery status"
          value={statusLabel ?? "—"}
        />
      </div>

      <div className=" border-t border-slate-100 pt-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <MapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400">Delivery Address</p>
           
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {deliveryAddress}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}