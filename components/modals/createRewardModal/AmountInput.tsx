import { cn } from '@/lib/utils';
import InlineActions from './Inlineactions';

interface AmountInputProps {
  /** Label shown above the input e.g. "Cross $X in sales" */
  optionLabel: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Inline $ amount input shown inside a dropdown when an option
 * requiring a dollar value is selected (e.g. "Cross $X in sales").
 */
export default function AmountInput({
  optionLabel, placeholder, value, error, onChange, onSave, onCancel,
}: AmountInputProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-pink-500 mb-2">{optionLabel}</p>

      <div className={cn(
        'flex items-center border rounded-xl bg-white overflow-hidden',
        error ? 'border-red-400' : 'border-pink-500 ring-2 ring-pink-200'
      )}>
        <span className="pl-3.5 pr-1 text-sm text-gray-500 font-medium select-none">$</span>
        <input
          type="number"
          min={1}
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          className="flex-1 py-2.5 pr-3 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
        />
      </div>

      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}

      <InlineActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}