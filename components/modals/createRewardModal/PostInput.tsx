import { cn } from '@/lib/utils';
import DurationDropdown from './DurationDropdown';
import InlineActions from './Inlineactions';
import type { Duration } from './types';

interface PostsInputProps {
  count: string;
  duration: string;
  countError?: string;
  onCountChange: (val: string) => void;
  onDurationChange: (val: Duration) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Inline input pair shown inside a dropdown when
 * "Posts X times every Y period" is selected.
 * Left: number input for post count.
 * Right: DurationDropdown for the period.
 */
export default function PostsInput({
  count, duration, countError,
  onCountChange, onDurationChange, onSave, onCancel,
}: PostsInputProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-pink-500 mb-2">Posts X times every Y period</p>

      <div className="flex gap-2 items-start">
        {/* Count input */}
        <div className={cn(
          'flex-1 border rounded-xl overflow-hidden bg-white',
          countError ? 'border-red-400' : 'border-pink-500 ring-2 ring-pink-200'
        )}>
          <input
            type="number"
            min={1}
            autoFocus
            placeholder="e.g. 4"
            value={count}
            onChange={(e) => onCountChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
            className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Duration picker */}
        <DurationDropdown value={duration} onChange={onDurationChange} />
      </div>

      {countError && <p className="text-[11px] text-red-500 mt-1">{countError}</p>}

      <InlineActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}