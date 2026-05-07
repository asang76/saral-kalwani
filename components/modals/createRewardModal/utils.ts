import type { CreateRewardForm } from './types';
import { REWARD_EVENT_OPTIONS, REWARD_WITH_OPTIONS } from './types';

/** Builds the display label shown in the Reward Event trigger button */
export function getEventDisplayValue(form: CreateRewardForm): string {
  const opt = REWARD_EVENT_OPTIONS.find((o) => o.label === form.rewardEvent);
  if (!opt) return '';
  if (opt.needsAmount && form.rewardEventAmount && opt.buildLabel)
    return opt.buildLabel(form.rewardEventAmount);
  if (opt.needsPostsInput && form.rewardEventCount && form.rewardEventDuration && opt.buildLabel)
    return opt.buildLabel(form.rewardEventCount, form.rewardEventDuration);
  return opt.label;
}

/** Builds the display label shown in the Reward With trigger button */
export function getRewardDisplayValue(form: CreateRewardForm): string {
  const opt = REWARD_WITH_OPTIONS.find((o) => o.label === form.rewardWith);
  if (!opt) return '';
  if (opt.needsAmount && form.rewardWithAmount && opt.buildLabel)
    return opt.buildLabel(form.rewardWithAmount);
  if (opt.needsTier && form.selectedTier && opt.buildLabel)
    return opt.buildLabel(form.selectedTier);
  return '';
}

/** Formats ISO date string → "10 Oct, 2025" */
export function formatDateDisplay(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}