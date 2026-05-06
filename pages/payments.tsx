import DashboardLayout from '@/components/layout/DashboardLayout';

export default function PaymentsPage() {
  return (
    <DashboardLayout title="Payments">
      <div className="max-w-[920px] mx-auto flex items-center justify-center h-96 bg-white rounded-2xl border border-brand-border">
        <div className="text-center space-y-2">
          <span className="text-4xl">💳</span>
          <p className="font-sora text-base font-semibold text-gray-700">Payments coming soon</p>
          <p className="text-sm text-gray-400">Track payouts and transactions here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
