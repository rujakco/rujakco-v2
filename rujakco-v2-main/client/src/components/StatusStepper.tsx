/*
 * RUJAK.Co — Experience Layer: Order Status Stepper
 * Horizontal 4-stage stepper mirroring Fore's
 * "Pembayaran → Diproses → Dikirim → Selesai" tracker.
 */

import { Clock3, ClipboardList, Bike, CheckCheck, X } from "lucide-react";

export type OrderStage = "pending_payment" | "paid" | "prepping" | "delivering" | "completed" | "cancelled";

const STAGES: { key: OrderStage[]; label: string; icon: typeof Clock3 }[] = [
  { key: ["pending_payment"], label: "Pembayaran", icon: Clock3 },
  { key: ["paid", "prepping"], label: "Diproses", icon: ClipboardList },
  { key: ["delivering"], label: "Dikirim", icon: Bike },
  { key: ["completed"], label: "Selesai", icon: CheckCheck },
];

const ORDER: OrderStage[] = ["pending_payment", "paid", "prepping", "delivering", "completed"];

export default function StatusStepper({ status }: { status: OrderStage }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1 h-px bg-paper-border" />
        <div className="flex items-center gap-2 text-chili">
          <div className="w-8 h-8 rounded-full bg-chili/10 border border-chili/30 flex items-center justify-center">
            <X className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">Dibatalkan</span>
        </div>
        <div className="flex-1 h-px bg-paper-border" />
      </div>
    );
  }

  const currentIndex = ORDER.indexOf(status);
  const activeStageIndex = STAGES.findIndex((s) => s.key.includes(status));

  return (
    <div className="flex items-start w-full">
      {STAGES.map((stage, i) => {
        const Icon = stage.icon;
        const stageOrderIndex = ORDER.indexOf(stage.key[stage.key.length - 1]);
        const isDone = currentIndex > stageOrderIndex || i < activeStageIndex;
        const isActive = i === activeStageIndex;
        const isFilled = isDone || isActive;

        return (
          <div key={stage.label} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div className={`flex-1 h-px ${i === 0 ? "opacity-0" : isDone ? "bg-forest" : "bg-paper-border"}`} />
              <div
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isFilled
                    ? "bg-forest border-forest text-white"
                    : "bg-white border-paper-border text-ink-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div
                className={`flex-1 h-px ${
                  i === STAGES.length - 1 ? "opacity-0" : isDone ? "bg-forest" : "bg-paper-border"
                }`}
              />
            </div>
            <span
              className={`mt-1.5 text-[11px] font-medium text-center ${
                isFilled ? "text-forest" : "text-ink-muted"
              }`}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
