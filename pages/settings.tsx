import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { disableGamification } from '@/store/slices/gamificationSlice';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { enabled } = useAppSelector((s) => s.gamification);

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-[920px] mx-auto space-y-5">

        {/* Profile section */}
        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <h2 className="font-sora text-[15px] font-semibold text-gray-900 mb-5">
            Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-gradient shrink-0">
              <span className="font-sora font-bold text-white text-lg">AJ</span>
            </div>
            <div>
              <p className="font-sora font-semibold text-gray-900 text-sm">Alex Johnson</p>
              <p className="text-xs text-gray-400 mt-0.5">alex@saral.app</p>
            </div>
          </div>
        </div>

        {/* Gamification settings */}
        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-sora text-[15px] font-semibold text-gray-900">
              Gamification
            </h2>
            {enabled
              ? <Badge variant="success">Active</Badge>
              : <Badge variant="default">Inactive</Badge>
            }
          </div>
          <p className="text-[13px] text-gray-500 mb-5">
            Manage your gamification settings and reward configurations.
          </p>
          {enabled && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => dispatch(disableGamification())}
            >
              Disable Gamification
            </Button>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
