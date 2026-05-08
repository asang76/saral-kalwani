import { Trash2, Clock, Gift } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { removeReward } from '../../store/slices/RewardsSlice';
import { cn } from '@/lib/utils';

function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function RewardsList() {
  const dispatch = useAppDispatch();
  const rewards = useAppSelector((s) => s.rewards?.items);

  if (rewards?.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-sora text-[24px] font-semibold text-gray-900 tracking-tight">
          Rewards Created
        </h3>
        <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
          {rewards?.length} {rewards?.length === 1 ? 'reward' : 'rewards'}
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {rewards?.map((reward) => (
          <div
            key={reward.id}
            className={cn(
              'bg-white rounded-2xl border border-brand-border p-4',
              'flex items-start justify-between gap-4',
              'shadow-card hover:shadow-card-hover transition-all duration-200'
            )}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 shrink-0">
              <Gift size={17} className="text-pink-500" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* When */}
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">When</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{reward?.event}</p>

              {/* Reward with */}
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mt-2.5 mb-0.5">Reward</p>
              <p className="text-sm font-semibold text-pink-500 truncate">{reward?.rewardWith}</p>

              {/* Time bound badge */}
              {reward.timeBound && reward.endDate && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Clock size={12} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-400">
                    Ends on{' '}
                    <span className="font-semibold text-gray-600">
                      {formatDate(reward?.endDate)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => dispatch(removeReward(reward.id))}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
              aria-label="Remove reward"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}