import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EnableGamificationModal from '@/components/modals/EnableGamificationModal';
import AddMilestoneModal from '@/components/modals/AddMilestoneModal';
import CreateRewardModal from '@/components/modals/CreateRewardModal';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleGamification } from '@/store/slices/gamificationSlice';
import { openModal } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

export default function GamificationPage() {
  const dispatch = useAppDispatch();
  const { enabled, features } = useAppSelector((s) => s.gamification);
  const modalOpen = useAppSelector((s) => s.ui.modalOpen);

  const handleEnableClick = () => {
    if (!enabled) {
      dispatch(openModal('enable-gamification'));
    } else {
      dispatch(toggleGamification());
    }
  };

  const handleFeatureClick = (title: string) => {
    if (!enabled) return;
    if (title === 'Set Milestones') {
      dispatch(openModal('add-milestone'));
    } else {
      // "Reward Your Ambassadors" and "Customise Incentives" both open CreateRewardModal
      dispatch(openModal('create-reward'));
    }
  };

  return (
    <DashboardLayout title="Gamification">
      <div className="max-w-[920px] mx-auto space-y-5">

        {/* ── Hero card ──────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl border border-brand-border overflow-hidden">
          {/* Dot-grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(155,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(155,92,246,0.07) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Decorative floating squares */}
          <div className="absolute top-5 left-16 w-[90px] h-[90px] rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 opacity-70 pointer-events-none" />
          <div className="absolute top-5 left-36 w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 opacity-50 pointer-events-none" />
          <div className="absolute top-5 right-16 w-[90px] h-[90px] rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 opacity-60 pointer-events-none" />
          <div className="absolute bottom-6 right-10 w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 opacity-50 pointer-events-none" />

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
              variant={enabled ? 'secondary' : 'primary'}
              onClick={handleEnableClick}
              className="min-w-[220px]"
            >
              {enabled ? '✓ Gamification Enabled' : 'Enable Gamification'}
            </Button>

            {!enabled && (
              <p className="mt-3 text-xs text-gray-400">
                No credit card required · Cancel any time
              </p>
            )}
          </div>
        </div>

        {/* ── Feature cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.title)}
              className={cn(
                'bg-white rounded-2xl border p-8 text-center',
                'transition-all duration-200 shadow-card',
                enabled
                  ? 'cursor-pointer hover:-translate-y-1 hover:shadow-card-hover'
                  : 'cursor-default opacity-75',
                feature.active
                  ? 'border-brand-purple/40 ring-2 ring-brand-purple/10'
                  : 'border-brand-border'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-16 h-16 rounded-[18px] bg-gradient-to-br mx-auto mb-5',
                  'flex items-center justify-center',
                  'border-2 border-purple-100',
                  feature.outerBg
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl',
                    feature.innerBg
                  )}
                >
                  {feature.icon}
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
                  <Badge variant="purple">Enabled</Badge>
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

      {/* ── Modals ─────────────────────────────────────────────── */}
      
      <AddMilestoneModal isOpen={modalOpen === 'add-milestone'} />
      <CreateRewardModal isOpen={modalOpen === 'enable-gamification'} />
    </DashboardLayout>
  );
}