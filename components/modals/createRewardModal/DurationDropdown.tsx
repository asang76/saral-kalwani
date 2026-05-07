import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DURATION_OPTIONS, type Duration } from './types';

interface DurationDropdownProps {
  value: string;
  onChange: (val: Duration) => void;
}

/**
 * Compact inline dropdown for selecting a time duration.
 * Used inside PostsInput. Closes on outside click.
 */
export default function DurationDropdown({ value, onChange }: DurationDropdownProps) {
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