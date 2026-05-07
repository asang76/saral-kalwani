import { Check, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionRowProps {
  label: string;
  isSelected: boolean;
  isDisabled: boolean;
  /** Show pencil edit icon — for selected tier options on hover */
  showEditIcon?: boolean;
  onClick: () => void;
  onEditClick?: () => void;
}

/**
 * A single row inside a SmartDropdown panel.
 * Handles selected highlight, disabled state, checkmark, and pencil edit icon.
 */
export default function OptionRow({
  label, isSelected, isDisabled, showEditIcon, onClick, onEditClick,
}: OptionRowProps) {
  return (
    <div
      onClick={() => !isDisabled && onClick()}
      className={cn(
        'flex items-center justify-between px-4 py-2.5 text-sm transition-colors select-none',
        isDisabled
          ? 'text-gray-300 cursor-not-allowed'
          : isSelected
          ? 'text-pink-500 font-semibold cursor-pointer'
          : 'text-gray-700 hover:bg-pink-50 cursor-pointer'
      )}
    >
      <span>{label}</span>

      <div className="flex items-center gap-1.5">
        {/* Pencil edit icon — shown on hover for tier option */}
        {showEditIcon && onEditClick && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEditClick(); }}
            className="p-1 rounded-md hover:bg-pink-50"
            aria-label="Edit selection"
          >
            <Pencil size={12} className="text-pink-500" />
          </button>
        )}

        {/* Checkmark for selected non-disabled options */}
        {isSelected && !isDisabled && (
          <Check size={14} className="text-pink-500 shrink-0" />
        )}
      </div>
    </div>
  );
}