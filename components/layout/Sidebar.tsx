import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, BarChart2, Gift, FileText, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Insights', href: '/insights', icon: BarChart2 },
  { label: 'Gamification', href: '/gamification', icon: Gift },
  { label: 'Applications', href: '/applications', icon: FileText },
  { label: 'Payments', href: '/payments', icon: CreditCard },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="fixed top-0 left-0 z-50 flex flex-col h-screen w-[220px] bg-white border-r border-brand-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-7">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-gradient shrink-0">
          <span className="font-sora font-bold text-white text-base">S</span>
        </div>
        <span className="font-sora font-bold text-lg text-gray-900 tracking-tight">
          Saral
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link key={href} href={href}>
              <span
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl',
                  'text-sm transition-all duration-150 cursor-pointer select-none',
                  active
                    ? 'bg-brand-purple-soft text-brand-purple font-semibold'
                    : 'text-gray-500 font-normal hover:bg-brand-purple-bg hover:text-brand-purple'
                )}
              >
                <Icon
                  size={17}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-6">
        <Link href="/settings">
          <span
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl',
              'text-sm text-gray-500 cursor-pointer select-none',
              'hover:bg-brand-purple-bg hover:text-brand-purple transition-all duration-150',
              router.pathname === '/settings' &&
                'bg-brand-purple-soft text-brand-purple font-semibold'
            )}
          >
            <Settings size={17} strokeWidth={1.8} />
            Settings
          </span>
        </Link>
      </div>
    </aside>
  );
}
