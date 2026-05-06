import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAppSelector } from '@/hooks/redux';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const stats = useAppSelector((s) => s.stats.items);
  const { enabled } = useAppSelector((s) => s.gamification);

  return (
    <DashboardLayout title="Home">
      <div className="max-w-[920px] mx-auto space-y-5">

        {/* Welcome banner */}
        <div className="relative bg-brand-gradient rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute -right-6 -top-6 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-16 -bottom-12 w-28 h-28 rounded-full bg-white/[0.07] pointer-events-none" />
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1 relative z-10">
            Dashboard
          </p>
          <h2 className="font-sora text-2xl font-bold mb-1.5 tracking-tight relative z-10">
            Welcome back, Alex 👋
          </h2>
          <p className="text-white/80 text-sm leading-relaxed relative z-10">
            Here&apos;s what&apos;s happening with your campaigns today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-brand-border p-5"
            >
              <p className="text-xs text-gray-400 font-medium mb-2 font-dm">{s.label}</p>
              <p className="font-sora text-[22px] font-bold text-gray-900 tracking-tight mb-1.5">
                {s.value}
              </p>
              <span
                className={cn(
                  'text-xs font-semibold',
                  s.up ? 'text-emerald-500' : 'text-red-500'
                )}
              >
                {s.change} vs last month
              </span>
            </div>
          ))}
        </div>

        {/* Gamification CTA card */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 shrink-0">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-sora text-[15px] font-semibold text-gray-900">
                  Set up Gamification
                </h3>
                {enabled && <Badge variant="success">Active</Badge>}
              </div>
              <p className="text-[13px] text-gray-500">
                Reward ambassadors, set milestones, and customise incentives.
              </p>
            </div>
          </div>
          <Link href="/gamification">
            <Button size="sm" className="shrink-0">
              {enabled ? 'Manage →' : 'Get Started →'}
            </Button>
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
