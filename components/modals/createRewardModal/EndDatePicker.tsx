import { useState, useRef, useEffect } from 'react';
import { DayPicker, useDayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateDisplay } from './utils';

import 'react-day-picker/style.css';

interface EndDatePickerProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onError: (msg: string) => void;
}

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function toISO(date: Date): string {
  // Use local date parts to avoid UTC timezone shift
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromISO(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ─── Custom Month Caption ─────────────────────────────────────────────────────
// Full control over [←] [Month Year] [→] layout
function CustomMonthCaption({ calendarMonth }: { calendarMonth: { date: Date } }) {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();

  const label = calendarMonth.date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className={cn(
          'w-9 h-9 flex items-center justify-center',
          'rounded-lg border border-gray-200 bg-white',
          'text-gray-500 hover:border-pink-300 hover:text-pink-500',
          'transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed'
        )}
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      {/* Month + Year label */}
      <span className="text-[15px] font-bold text-gray-900 font-sora">{label}</span>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className={cn(
          'w-9 h-9 flex items-center justify-center',
          'rounded-lg border border-gray-200 bg-white',
          'text-gray-500 hover:border-pink-300 hover:text-pink-500',
          'transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed'
        )}
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── EndDatePicker ────────────────────────────────────────────────────────────
export default function EndDatePicker({ value, error, onChange, onError }: EndDatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = fromISO(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    date.setHours(0, 0, 0, 0);
    if (date < TODAY) {
      onError('Please select today or a future date');
      return;
    }
    onChange(toISO(date));
    setOpen(false);
  };

  return (
    <div ref={ref} className="flex flex-col gap-1.5 animate-slide-up">
      <label className="text-sm font-medium text-gray-800 font-dm">
        End date <span className="text-red-500">*</span>
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-white text-left',
          'border-2 transition-all focus:outline-none',
          error ? 'border-red-400'
            : open ? 'border-pink-400'
            : 'border-pink-200',
          value ? 'text-gray-900' : 'text-gray-400'
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={open || value ? '#a855f7' : '#c4b5fd'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{value ? formatDateDisplay(value) : 'Select End Date'}</span>
      </button>

      {/* Calendar popover */}
      {open && (
        <div className="relative z-30">
          <div
            className="absolute top-1 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-slide-up"
            style={{ minWidth: 308 }}
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={{ before: TODAY }}
              showOutsideDays
              components={{
                MonthCaption: CustomMonthCaption,
              }}
              classNames={{
                root: 'w-full',
                months: 'w-full',
                month: 'w-full',
                month_caption: 'hidden', // handled by CustomMonthCaption
                nav: 'hidden',           // handled by CustomMonthCaption
                month_grid: 'w-full',
                weekdays: 'flex justify-between mb-1',
                weekday: 'w-10 text-center text-sm font-medium text-gray-400',
                week: 'flex justify-between mt-1',
                day: 'w-10 h-10 flex items-center justify-center',
                day_button: cn(
                  'w-10 h-10 rounded-xl text-sm font-medium transition-all',
                  'hover:bg-pink-50 hover:text-pink-600 focus:outline-none'
                ),
                selected: '!bg-pink-500 !text-white !rounded-xl hover:!bg-pink-600',
                today: 'font-bold text-pink-500',
                outside: 'text-gray-300',
                disabled: 'text-gray-200 cursor-not-allowed hover:bg-transparent hover:text-gray-200',
                hidden: 'invisible',
              }}
            />
          </div>
        </div>
      )}

      {value && !error && (
        <p className="text-xs text-gray-400">Reward stops on {formatDateDisplay(value)}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}