import { Check, ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMMISSION_TIERS } from './types';

interface TierSelectPanelProps {
  selectedTier: string;
  error?: string;
  onTierChange: (tier: string) => void;
  onBack: () => void;
  onSave: () => void;
}

/**
 * Replaces the main modal body when "Upgrade Commission Tier" is selected.
 * Shows a native select + visual clickable tier list.
 */
export default function TierSelectPanel({
  selectedTier, error, onTierChange, onBack, onSave,
}: TierSelectPanelProps) {
  return (
    <div className="space-y-4">
      {/* Native select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-800 font-dm">
          Upgrade to <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={selectedTier}
            onChange={(e) => onTierChange(e.target.value)}
            className={cn(
              'w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm bg-white',
              'border transition-all focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500',
              error ? 'border-red-400'
                : selectedTier ? 'border-pink-500 ring-2 ring-pink-200'
                : 'border-gray-200',
              selectedTier ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            <option value="" disabled>Select a tier</option>
            {COMMISSION_TIERS.map((tier) => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Visual tier list */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {COMMISSION_TIERS.map((tier, i) => (
          <div
            key={tier}
            onClick={() => onTierChange(tier)}
            className={cn(
              'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors',
              i !== COMMISSION_TIERS.length - 1 && 'border-b border-gray-200',
              selectedTier === tier
                ? 'bg-pink-50 text-pink-500 font-semibold'
                : 'text-gray-700 hover:bg-pink-50'
            )}
          >
            <span>{tier}</span>
            {selectedTier === tier && <Check size={14} className="text-pink-500" />}
          </div>
        ))}
      </div>

      {/* Go Back + Save */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
        >
          Save
        </button>
      </div>
    </div>
  );
}