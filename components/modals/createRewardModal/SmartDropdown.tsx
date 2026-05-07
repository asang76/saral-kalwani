import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import OptionRow from './Opitonrow';
import AmountInput from './AmountInput';
import PostsInput from './PostInput';
import type { DropdownOption, CreateRewardForm, Duration } from './types';

interface SmartDropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  /** Raw option label that is currently selected */
  selectedLabel: string;
  /** Formatted display value shown in the trigger button */
  displayValue: string;
  /** Full form state — passed to option.disabled() evaluators */
  form: CreateRewardForm;

  // Amount flow (needsAmount options)
  amount: string;
  amountError?: string;
  onAmountChange: (val: string) => void;
  onAmountSave: () => void;
  onAmountCancel: () => void;

  // Posts flow (needsPostsInput options)
  postsCount: string;
  postsDuration: string;
  postsCountError?: string;
  onPostsCountChange: (val: string) => void;
  onPostsDurationChange: (val: Duration) => void;
  onPostsSave: () => void;
  onPostsCancel: () => void;

  // Dropdown open state — controlled by Redux via parent
  isOpen: boolean;
  onToggle: () => void;

  // Field-level validation error (shown below trigger when closed)
  error?: string;

  // Tier edit pencil — shown on hover when tier is selected
  hoveredRow?: boolean;
  onEditTier?: () => void;

  // Called when user clicks an option row
  onSelect: (opt: DropdownOption) => void;
}

/**
 * A dropdown that renders one of three inline sub-inputs depending on
 * which option is selected:
 *   needsAmount     → AmountInput   ($ value)
 *   needsPostsInput → PostsInput    (count + duration)
 *   needsTier       → navigates to TierSelectPanel via parent
 *
 * Open/close state is managed externally (Redux) via isOpen + onToggle.
 */
export default function SmartDropdown({
  label, placeholder, options, selectedLabel, displayValue, form,
  amount, amountError, onAmountChange, onAmountSave, onAmountCancel,
  postsCount, postsDuration, postsCountError,
  onPostsCountChange, onPostsDurationChange, onPostsSave, onPostsCancel,
  isOpen, onToggle, error, hoveredRow, onEditTier, onSelect,
}: SmartDropdownProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-800 font-dm">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        {/* ── Trigger button ── */}
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

        {/* ── Dropdown panel ── */}
        {isOpen && (
          <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-visible">
            {options.map((opt) => {
              const isSelected = selectedLabel === opt.label;
              const isDisabled = opt.disabled?.(form) ?? false;
              const showAmount = isSelected && opt.needsAmount;
              const showPosts = isSelected && opt.needsPostsInput;

              return (
                <div key={opt.label}>
                  {/* Option row — hidden when its sub-input is active */}
                  {!showAmount && !showPosts && (
                    <OptionRow
                      label={opt.label}
                      isSelected={isSelected}
                      isDisabled={isDisabled}
                      showEditIcon={isSelected && opt.needsTier && hoveredRow}
                      onClick={() => onSelect(opt)}
                      onEditClick={onEditTier}
                    />
                  )}

                  {/* Amount sub-input */}
                  {showAmount && (
                    <AmountInput
                      optionLabel={opt.label}
                      placeholder={opt.amountPlaceholder}
                      value={amount}
                      error={amountError}
                      onChange={onAmountChange}
                      onSave={onAmountSave}
                      onCancel={onAmountCancel}
                    />
                  )}

                  {/* Posts sub-input */}
                  {showPosts && (
                    <PostsInput
                      count={postsCount}
                      duration={postsDuration}
                      countError={postsCountError}
                      onCountChange={onPostsCountChange}
                      onDurationChange={onPostsDurationChange}
                      onSave={onPostsSave}
                      onCancel={onPostsCancel}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Field-level error (only when dropdown is closed) */}
      {error && !isOpen && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}