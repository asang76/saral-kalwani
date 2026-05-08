import { cn } from '@/lib/utils';

interface ToggleProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}


export default function Toggle({ label, hint, checked, onChange }: ToggleProps) {
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