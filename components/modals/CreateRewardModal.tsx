import { useState, useRef, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { useAppDispatch } from '@/hooks/redux';
import { closeModal } from '@/store/slices/uiSlice';
import { ChevronDown, ChevronUp, Check, Calendar, Pencil, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type View = 'main' | 'tier-select';

interface CreateRewardForm {
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

interface FormErrors {
  rewardEvent?: string;
  rewardEventAmount?: string;
  rewardEventCount?: string;
  rewardEventDuration?: string;
  rewardWith?: string;
  rewardWithAmount?: string;
  selectedTier?: string;
  endDate?: string;
}

interface CreateRewardModalProps {
  isOpen: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DURATION_OPTIONS = ['14 days', '1 month', '2 months', '3 months', '1 year'] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

const COMMISSION_TIERS = ['Bronze Tier', 'Silver Tier', 'Gold Tier', 'Platinum Tier', 'Diamond Tier'] as const;

const EMPTY_FORM: CreateRewardForm = {
  rewardEvent: '', rewardEventAmount: '', rewardEventCount: '', rewardEventDuration: '',
  rewardWith: '', rewardWithAmount: '', selectedTier: '', timeBound: false, endDate: '',
};

const TODAY = new Date().toISOString().split('T')[0];

interface DropdownOption {
  label: string;
  needsAmount: boolean;
  needsPostsInput: boolean;
  needsTier: boolean;
  amountPlaceholder?: string;
  amountError?: string;
  buildLabel?: (val: string, extra?: string) => string;
  disabled?: (form: CreateRewardForm) => boolean;
}

const REWARD_EVENT_OPTIONS: DropdownOption[] = [
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

const REWARD_WITH_OPTIONS: DropdownOption[] = [
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
    disabled: (form) => ['Posts X times every Y period', 'Is Onboarded'].includes(form.rewardEvent),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getEventDisplayValue(form: CreateRewardForm): string {
  const opt = REWARD_EVENT_OPTIONS.find((o) => o.label === form.rewardEvent);
  if (!opt) return '';
  if (opt.needsAmount && form.rewardEventAmount && opt.buildLabel)
    return opt.buildLabel(form.rewardEventAmount);
  if (opt.needsPostsInput && form.rewardEventCount && form.rewardEventDuration && opt.buildLabel)
    return opt.buildLabel(form.rewardEventCount, form.rewardEventDuration);
  return opt.label;
}

function getRewardDisplayValue(form: CreateRewardForm): string {
  const opt = REWARD_WITH_OPTIONS.find((o) => o.label === form.rewardWith);
  if (!opt) return '';
  if (opt.needsAmount && form.rewardWithAmount && opt.buildLabel)
    return opt.buildLabel(form.rewardWithAmount);
  if (opt.needsTier && form.selectedTier && opt.buildLabel)
    return opt.buildLabel(form.selectedTier);
  return '';
}

function formatDateDisplay(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── DurationDropdown ─────────────────────────────────────────────────────────
function DurationDropdown({ value, onChange }: { value: string; onChange: (val: Duration) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-40 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm bg-white',
          'border transition-all focus:outline-none',
          open ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200',
          value ? 'text-gray-900' : 'text-gray-400'
        )}
      >
        <span className="truncate">{value || 'Duration'}</span>
        {open
          ? <ChevronUp size={14} className="text-gray-400 shrink-0 ml-1" />
          : <ChevronDown size={14} className="text-gray-400 shrink-0 ml-1" />}
      </button>
      {open && (
        <ul className="absolute z-50 top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {DURATION_OPTIONS.map((d) => (
            <li
              key={d}
              onClick={() => { onChange(d); setOpen(false); }}
              className={cn(
                'px-3 py-2.5 text-sm cursor-pointer transition-colors',
                value === d
                  ? 'bg-pink-50 text-pink-600 font-semibold'
                  : 'text-gray-700 hover:bg-pink-50'
              )}
            >
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Inline action buttons (Save + Cancel) ────────────────────────────────────
function InlineActions({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex-1 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
      >
        Save
      </button>
    </div>
  );
}

// ─── SmartDropdown ────────────────────────────────────────────────────────────
interface SmartDropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  selectedLabel: string;
  displayValue: string;
  form: CreateRewardForm;
  amount: string;
  amountError?: string;
  postsCount: string;
  postsDuration: string;
  postsCountError?: string;
  isOpen: boolean;
  error?: string;
  hoveredRow?: boolean;
  onToggle: () => void;
  onSelect: (opt: DropdownOption) => void;
  onAmountChange: (val: string) => void;
  onAmountSave: () => void;
  onAmountCancel: () => void;
  onPostsCountChange: (val: string) => void;
  onPostsDurationChange: (val: Duration) => void;
  onPostsSave: () => void;
  onPostsCancel: () => void;
  onEditTier?: () => void;
}

function SmartDropdown({
  label, placeholder, options, selectedLabel, displayValue, form,
  amount, amountError, postsCount, postsDuration, postsCountError,
  isOpen, error, hoveredRow, onToggle, onSelect, onAmountChange,
  onAmountSave, onAmountCancel, onPostsCountChange, onPostsDurationChange,
  onPostsSave, onPostsCancel, onEditTier,
}: SmartDropdownProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-800 font-dm">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm bg-white',
            'border transition-all duration-150 focus:outline-none',
            error && !isOpen ? 'border-red-400'
              : isOpen ? 'border-pink-500 ring-2 ring-pink-200'
              : 'border-gray-200',
            displayValue ? 'text-gray-900' : 'text-gray-400'
          )}
        >
          <span>{displayValue || placeholder}</span>
          {isOpen
            ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
            : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-visible">
            {options.map((opt) => {
              const isSelected = selectedLabel === opt.label;
              const isDisabled = opt.disabled?.(form) ?? false;
              const showAmountInput = isSelected && opt.needsAmount;
              const showPostsInput = isSelected && opt.needsPostsInput;

              return (
                <div key={opt.label}>
                  {/* Option row — hide when sub-input is active */}
                  {!showAmountInput && !showPostsInput && (
                    <div
                      onClick={() => !isDisabled && onSelect(opt)}
                      className={cn(
                        'flex items-center justify-between px-4 py-2.5 text-sm transition-colors select-none',
                        isDisabled ? 'text-gray-300 cursor-not-allowed'
                          : isSelected ? 'text-pink-500 font-semibold cursor-pointer'
                          : 'text-gray-700 hover:bg-pink-50 cursor-pointer'
                      )}
                    >
                      <span>{opt.label}</span>
                      <div className="flex items-center gap-1.5">
                        {isSelected && opt.needsTier && hoveredRow && onEditTier && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onEditTier(); }}
                            className="p-1 rounded-md hover:bg-pink-50"
                          >
                            <Pencil size={12} className="text-pink-500" />
                          </button>
                        )}
                        {isSelected && !isDisabled && (
                          <Check size={14} className="text-pink-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* $ amount input — replaces the option row */}
                  {showAmountInput && (
                    <div className="px-4 py-3">
                      <p className="text-xs font-medium text-pink-500 mb-2">{opt.label}</p>
                      <div className={cn(
                        'flex items-center border rounded-xl bg-white overflow-hidden',
                        amountError ? 'border-red-400' : 'border-pink-500 ring-2 ring-pink-200'
                      )}>
                        <span className="pl-3.5 pr-1 text-sm text-gray-500 font-medium select-none">$</span>
                        <input
                          type="number" min={1} autoFocus
                          placeholder={opt.amountPlaceholder}
                          value={amount}
                          onChange={(e) => onAmountChange(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') onAmountSave(); }}
                          className="flex-1 py-2.5 pr-3 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
                        />
                      </div>
                      {amountError && <p className="text-[11px] text-red-500 mt-1">{amountError}</p>}
                      <InlineActions onSave={onAmountSave} onCancel={onAmountCancel} />
                    </div>
                  )}

                  {/* Posts count + duration — replaces the option row */}
                  {showPostsInput && (
                    <div className="px-4 py-3">
                      <p className="text-xs font-medium text-pink-500 mb-2">{opt.label}</p>
                      <div className="flex gap-2 items-start">
                        <div className={cn(
                          'flex-1 border rounded-xl overflow-hidden bg-white',
                          postsCountError ? 'border-red-400' : 'border-pink-500 ring-2 ring-pink-200'
                        )}>
                          <input
                            type="number" min={1} autoFocus placeholder="e.g. 4"
                            value={postsCount}
                            onChange={(e) => onPostsCountChange(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') onPostsSave(); }}
                            className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
                          />
                        </div>
                        <DurationDropdown value={postsDuration} onChange={onPostsDurationChange} />
                      </div>
                      {postsCountError && <p className="text-[11px] text-red-500 mt-1">{postsCountError}</p>}
                      <InlineActions onSave={onPostsSave} onCancel={onPostsCancel} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && !isOpen && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ─── TierSelectPanel ──────────────────────────────────────────────────────────
function TierSelectPanel({ selectedTier, error, onTierChange, onBack, onSave }: {
  selectedTier: string; error?: string;
  onTierChange: (tier: string) => void; onBack: () => void; onSave: () => void;
}) {
  return (
    <div className="space-y-4">
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

      {/* Tier list */}
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

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ label, hint, checked, onChange }: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-t border-b border-dashed border-gray-200">
      <div>
        <p className="text-sm font-medium text-gray-800 font-dm">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-pink-200',
          checked ? 'bg-pink-500' : 'bg-gray-200'
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function CreateRewardModal({ isOpen }: CreateRewardModalProps) {
  const dispatch = useAppDispatch();

  const [view, setView] = useState<View>('main');
  const [form, setForm] = useState<CreateRewardForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [openDropdown, setOpenDropdown] = useState<'event' | 'reward' | null>(null);
  const [rewardRowHovered, setRewardRowHovered] = useState(false);
  const [draftTier, setDraftTier] = useState('');

  const patch = (p: Partial<CreateRewardForm>) => setForm((f) => ({ ...f, ...p }));
  const clearErr = (keys: (keyof FormErrors)[]) =>
    setErrors((e) => { const n = { ...e }; keys.forEach((k) => delete n[k]); return n; });

  const eventDisplayValue = getEventDisplayValue(form);
  const rewardDisplayValue = getRewardDisplayValue(form);
  const selectedRewardOpt = REWARD_WITH_OPTIONS.find((o) => o.label === form.rewardWith);

  const toggleDropdown = (id: 'event' | 'reward') =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  const handleSelectEvent = (opt: DropdownOption) => {
    if (!opt.label) { patch({ rewardEvent: '', rewardEventCount: '', rewardEventDuration: '' }); setOpenDropdown(null); return; }
    const tierDisabled = ['Posts X times every Y period', 'Is Onboarded'].includes(opt.label);
    const tierWasSelected = form.rewardWith === 'Upgrade Commission Tier';
    patch({
      rewardEvent: opt.label,
      rewardEventAmount: form.rewardEvent === opt.label ? form.rewardEventAmount : '',
      rewardEventCount: form.rewardEvent === opt.label ? form.rewardEventCount : '',
      rewardEventDuration: form.rewardEvent === opt.label ? form.rewardEventDuration : '',
      rewardWith: tierDisabled && tierWasSelected ? '' : form.rewardWith,
      selectedTier: tierDisabled && tierWasSelected ? '' : form.selectedTier,
    });
    clearErr(['rewardEvent', 'rewardEventAmount', 'rewardEventCount']);
    if (!opt.needsAmount && !opt.needsPostsInput) setOpenDropdown(null);
  };

  const handleSaveEventAmount = () => {
    if (!form.rewardEventAmount || Number(form.rewardEventAmount) <= 0) {
      setErrors((e) => ({ ...e, rewardEventAmount: 'Enter the sales target amount to continue' })); return;
    }
    clearErr(['rewardEventAmount']); setOpenDropdown(null);
  };

  const handleCancelEventAmount = () => {
    patch({ rewardEvent: '', rewardEventAmount: '' });
    setOpenDropdown(null);
  };

  const handleSavePostsInput = () => {
    if (!form.rewardEventCount || Number(form.rewardEventCount) <= 0) {
      setErrors((e) => ({ ...e, rewardEventCount: 'Enter the posts count to continue' })); return;
    }
    if (!form.rewardEventDuration) {
      setErrors((e) => ({ ...e, rewardEventDuration: 'Select a duration' })); return;
    }
    clearErr(['rewardEventCount', 'rewardEventDuration']); setOpenDropdown(null);
  };

  const handleCancelPostsInput = () => {
    patch({ rewardEvent: '', rewardEventCount: '', rewardEventDuration: '' });
    setOpenDropdown(null);
  };

  const handleSelectReward = (opt: DropdownOption) => {
    if (!opt.label) return;
    if (opt.needsTier) {
      patch({ rewardWith: opt.label }); setDraftTier(form.selectedTier);
      setOpenDropdown(null); setView('tier-select'); return;
    }
    patch({ rewardWith: opt.label, rewardWithAmount: form.rewardWith === opt.label ? form.rewardWithAmount : '', selectedTier: '' });
    clearErr(['rewardWith', 'rewardWithAmount']);
    if (!opt.needsAmount) setOpenDropdown(null);
  };

  const handleSaveRewardAmount = () => {
    if (!form.rewardWithAmount || Number(form.rewardWithAmount) <= 0) {
      setErrors((e) => ({ ...e, rewardWithAmount: 'Enter the bonus amount to continue' })); return;
    }
    clearErr(['rewardWithAmount']); setOpenDropdown(null);
  };

  const handleCancelRewardAmount = () => {
    patch({ rewardWith: '', rewardWithAmount: '' });
    setOpenDropdown(null);
  };

  const handleSaveTier = () => {
    if (!draftTier) { setErrors((e) => ({ ...e, selectedTier: 'Please select a commission tier' })); return; }
    patch({ selectedTier: draftTier }); clearErr(['rewardWith', 'selectedTier']); setView('main');
  };

  const handleBackFromTier = () => {
    if (!form.selectedTier) patch({ rewardWith: '', selectedTier: '' });
    setView('main');
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    const evtOpt = REWARD_EVENT_OPTIONS.find((o) => o.label === form.rewardEvent);
    if (!form.rewardEvent) e.rewardEvent = 'Please select a reward event';
    if (evtOpt?.needsAmount && !form.rewardEventAmount) e.rewardEventAmount = 'Enter the sales target amount to continue';
    if (evtOpt?.needsPostsInput && !form.rewardEventCount) e.rewardEventCount = 'Enter the posts count to continue';
    if (evtOpt?.needsPostsInput && !form.rewardEventDuration) e.rewardEventDuration = 'Select a duration';
    if (!form.rewardWith) e.rewardWith = 'Please select a reward type';
    if (selectedRewardOpt?.needsAmount && !form.rewardWithAmount) e.rewardWithAmount = 'Enter the bonus amount to continue';
    if (selectedRewardOpt?.needsTier && !form.selectedTier) e.selectedTier = 'Please select a commission tier';
    if (form.timeBound && !form.endDate) e.endDate = 'Please pick an end date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log('Creating reward:', { event: eventDisplayValue, reward: rewardDisplayValue });
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal());
    setForm(EMPTY_FORM); setErrors({}); setOpenDropdown(null); setView('main'); setDraftTier('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={view === 'tier-select' ? 'Select a commission tier' : 'Create your reward system'}>

      {/* ── Tier Select Panel ── */}
      {view === 'tier-select' && (
        <TierSelectPanel
          selectedTier={draftTier}
          error={errors.selectedTier}
          onTierChange={(t) => { setDraftTier(t); clearErr(['selectedTier']); }}
          onBack={handleBackFromTier}
          onSave={handleSaveTier}
        />
      )}

      {/* ── Main Panel ── */}
      {view === 'main' && (
        <div className="space-y-5">

          {/* Reward event */}
          <SmartDropdown
            label="Reward event" placeholder="Select an event"
            options={REWARD_EVENT_OPTIONS} selectedLabel={form.rewardEvent}
            displayValue={eventDisplayValue} form={form}
            amount={form.rewardEventAmount} amountError={errors.rewardEventAmount}
            postsCount={form.rewardEventCount} postsDuration={form.rewardEventDuration}
            postsCountError={errors.rewardEventCount}
            isOpen={openDropdown === 'event'} error={errors.rewardEvent}
            onToggle={() => toggleDropdown('event')}
            onSelect={handleSelectEvent}
            onAmountChange={(v) => { patch({ rewardEventAmount: v }); clearErr(['rewardEventAmount']); }}
            onAmountSave={handleSaveEventAmount}
            onAmountCancel={handleCancelEventAmount}
            onPostsCountChange={(v) => { patch({ rewardEventCount: v }); clearErr(['rewardEventCount']); }}
            onPostsDurationChange={(v) => { patch({ rewardEventDuration: v }); clearErr(['rewardEventDuration']); }}
            onPostsSave={handleSavePostsInput}
            onPostsCancel={handleCancelPostsInput}
          />

          {/* Reward with */}
          <div onMouseEnter={() => setRewardRowHovered(true)} onMouseLeave={() => setRewardRowHovered(false)}>
            <SmartDropdown
              label="Reward with" placeholder="Select a reward"
              options={REWARD_WITH_OPTIONS} selectedLabel={form.rewardWith}
              displayValue={rewardDisplayValue} form={form}
              amount={form.rewardWithAmount} amountError={errors.rewardWithAmount}
              postsCount="" postsDuration=""
              isOpen={openDropdown === 'reward'} error={errors.rewardWith}
              hoveredRow={rewardRowHovered}
              onToggle={() => toggleDropdown('reward')}
              onSelect={handleSelectReward}
              onAmountChange={(v) => { patch({ rewardWithAmount: v }); clearErr(['rewardWithAmount']); }}
              onAmountSave={handleSaveRewardAmount}
              onAmountCancel={handleCancelRewardAmount}
              onPostsCountChange={() => {}} onPostsDurationChange={() => {}}
              onPostsSave={() => {}} onPostsCancel={() => {}}
              onEditTier={() => { setDraftTier(form.selectedTier); setView('tier-select'); }}
            />
          </div>

          {/* Toggle or hint */}
          {form.rewardEvent === 'Is Onboarded' ? (
            <p className="text-xs text-gray-400 -mt-1">Choose an end date to stop this reward automatically.</p>
          ) : (
            <Toggle
              label="Make the reward time bound"
              hint="Choose an end date to stop this reward automatically."
              checked={form.timeBound}
              onChange={(val) => { patch({ timeBound: val, endDate: '' }); setOpenDropdown(null); }}
            />
          )}

          {/* End date — today onwards only */}
          {form.timeBound && (
            <div className="flex flex-col gap-1.5 animate-slide-up">
              <label className="text-sm font-medium text-gray-800 font-dm">
                End date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={form.endDate}
                  min={TODAY}
                  onChange={(e) => { patch({ endDate: e.target.value }); clearErr(['endDate']); }}
                  className={cn(
                    'w-full pl-9 pr-4 py-3 rounded-xl text-sm text-gray-900 bg-white',
                    'border transition-all focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500',
                    errors.endDate ? 'border-red-400' : 'border-gray-200'
                  )}
                />
              </div>
              {form.endDate && <p className="text-xs text-gray-400">Reward stops on {formatDateDisplay(form.endDate)}</p>}
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Create Reward
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}