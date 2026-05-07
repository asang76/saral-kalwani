// ─── View ─────────────────────────────────────────────────────────────────────
export type View = 'main' | 'tier-select';

// ─── Form ─────────────────────────────────────────────────────────────────────
export interface CreateRewardForm {
  rewardEvent: string;
  rewardEventAmount: string;
  rewardEventCount: string;
  rewardEventDuration: string;
  rewardWith: string;
  rewardWithAmount: string;
  selectedTier: string;
  timeBound: boolean;
  endDate: string;
}

export const EMPTY_FORM: CreateRewardForm = {
  rewardEvent: '', rewardEventAmount: '', rewardEventCount: '', rewardEventDuration: '',
  rewardWith: '', rewardWithAmount: '', selectedTier: '', timeBound: false, endDate: '',
};

// ─── Errors ───────────────────────────────────────────────────────────────────
export interface FormErrors {
  rewardEvent?: string;
  rewardEventAmount?: string;
  rewardEventCount?: string;
  rewardEventDuration?: string;
  rewardWith?: string;
  rewardWithAmount?: string;
  selectedTier?: string;
  endDate?: string;
}

// ─── Dropdown option ──────────────────────────────────────────────────────────
export interface DropdownOption {
  label: string;
  needsAmount: boolean;
  needsPostsInput: boolean;
  needsTier: boolean;
  amountPlaceholder?: string;
  amountError?: string;
  buildLabel?: (primary: string, secondary?: string) => string;
  disabled?: (form: CreateRewardForm) => boolean;
}

// ─── Duration ─────────────────────────────────────────────────────────────────
export const DURATION_OPTIONS = ['14 days', '1 month', '2 months', '3 months', '1 year'] as const;
export type Duration = (typeof DURATION_OPTIONS)[number];

// ─── Tiers ────────────────────────────────────────────────────────────────────
export const COMMISSION_TIERS = [
  'Bronze Tier', 'Silver Tier', 'Gold Tier', 'Platinum Tier', 'Diamond Tier',
] as const;

// ─── Today ────────────────────────────────────────────────────────────────────
export const TODAY = new Date().toISOString().split('T')[0];

// ─── Events that disable "Upgrade Commission Tier" ────────────────────────────
const TIER_DISABLED_EVENTS = ['Posts X times every Y period', 'Is Onboarded'] as const;

// ─── Reward event options ─────────────────────────────────────────────────────
export const REWARD_EVENT_OPTIONS: DropdownOption[] = [
  {
    label: 'Cross $X in sales',
    needsAmount: true, needsPostsInput: false, needsTier: false,
    amountPlaceholder: 'e.g. 100',
    amountError: 'Enter the sales target amount to continue',
    buildLabel: (amt) => `Cross $${amt} in sales`,
  },
  {
    label: 'Posts X times every Y period',
    needsAmount: false, needsPostsInput: true, needsTier: false,
    buildLabel: (count, duration) => `Posts ${count} times every ${duration}`,
  },
  { label: 'Is Onboarded', needsAmount: false, needsPostsInput: false, needsTier: false },
];

// ─── Reward with options ──────────────────────────────────────────────────────
export const REWARD_WITH_OPTIONS: DropdownOption[] = [
  {
    label: 'Flat $X bonus',
    needsAmount: true, needsPostsInput: false, needsTier: false,
    amountPlaceholder: 'e.g. 100',
    amountError: 'Enter the bonus amount to continue',
    buildLabel: (amt) => `Flat $${amt} Bonus`,
  },
  {
    label: 'Upgrade Commission Tier',
    needsAmount: false, needsPostsInput: false, needsTier: true,
    buildLabel: (tier) => `Upgrade to (${tier})`,
    disabled: (form) => (TIER_DISABLED_EVENTS as readonly string[]).includes(form.rewardEvent),
  },
];