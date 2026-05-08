import Image from "next/image";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CreateRewardModal from "@/components/modals/CreateRewardModal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toggleGamification } from "@/store/slices/gamificationSlice";
import { openModal } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

import layers from "../public/assets/layers.png";
import bgGamification from "../public/assets/bg-gamifiction.png";
import RewardsList from "@/components/modals/RewardList";

export default function GamificationPage() {
  const dispatch = useAppDispatch();
  const { enabled, features } = useAppSelector((s) => s.gamification);
  const modalOpen = useAppSelector((s) => s.ui.modalOpen);

  const handleEnableClick = () => {
    if (!enabled) {
      dispatch(openModal("enable-gamification"));
    } else {
      dispatch(toggleGamification());
    }
  };

  const handleFeatureClick = (title: string) => {
    if (!enabled) return;
    if (title === "Set Milestones") {
      dispatch(openModal("add-milestone"));
    } else {
      dispatch(openModal("create-reward"));
    }
  };

  return (
    <DashboardLayout title="Gamification">
      <div className="max-w-[920px] mx-auto space-y-5">
        {/* ── Hero card ──────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl border border-brand-border overflow-hidden">
          <Image
            src={bgGamification}
            alt="Gamification"
            fill={true}
            className=" absolute w-full opacity-80 pointer-events-none"
          />

          {/* Content */}
          <div className="relative px-12 py-16 text-center">
            {enabled && (
              <div className="flex justify-center mb-4">
                <Badge variant="success">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gamification Active
                </Badge>
              </div>
            )}

            <h2 className="font-sora text-[28px] font-bold text-gray-900 tracking-tight mb-3">
              Gamify your Campaign
            </h2>
            <p className="text-[15px] text-gray-500 leading-relaxed max-w-[340px] mx-auto mb-8">
              Enable gamification to start crafting your custom reward system.
            </p>

            <Button
              size="lg"
              variant={enabled ? "secondary" : "primary"}
              onClick={handleEnableClick}
              className="min-w-[220px]"
            >
              {enabled ? "✓ Gamification Enabled" : "Enable Gamification"}
            </Button>

            {!enabled && (
              <p className="mt-3 text-xs text-gray-400">
                No credit card required · Cancel any time
              </p>
            )}
          </div>
        </div>

        {/* ── Feature cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-5 realtive">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.title)}
              className="bg-white rounded-2xl border p-8 text-center relative"
            >
              <Image
                src={layers}
                alt="Layers"
                className="w-full absolute top-0 left-0 z-0 opacity-30"
              />
              {/* Icon */}
              <div
                className={cn(
                  "w-16 h-16 rounded-[18px] bg-gradient-to-br mx-auto mb-5 ",
                  "flex items-center justify-center",
                  "border-8 border-pink-200",
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl ",
                    feature.innerBg,
                  )}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={30}
                    height={20}
                  />
                </div>
              </div>

              <h3 className="font-sora text-[15px] font-semibold text-gray-900 mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {feature.description}
              </p>

              {feature.active && (
                <div className="mt-4">
                  <Badge variant="pink">Enabled</Badge>
                </div>
              )}

              {!enabled && (
                <p className="mt-3 text-[11px] text-gray-400">
                  Enable gamification to unlock
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
        <RewardsList />
      <CreateRewardModal isOpen={modalOpen === "enable-gamification"} />
    </DashboardLayout>
  );
}
