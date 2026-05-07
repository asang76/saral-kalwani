import { Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearNotifications } from '@/store/slices/uiSlice';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[64px] px-8 bg-white border-b border-brand-border">
      <h1 className="font-sora text-[17px] font-semibold text-gray-900 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          onClick={() => dispatch(clearNotifications())}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-brand-pink-bg hover:bg-brand-pink-soft transition-colors"
          aria-label={`${notifications} notifications`}
          title="Clear notifications"
        >
          <Bell size={17} className="text-brand-pink" strokeWidth={1.8} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[17px] h-[17px] rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-white">
              {notifications > 9 ? '9+' : notifications}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-gradient cursor-pointer select-none">
          <span className="font-sora font-bold text-white text-xs">AJ</span>
        </div>
      </div>
    </header>
  );
}
