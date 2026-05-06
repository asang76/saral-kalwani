import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <DashboardLayout title="404 — Not Found">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <span className="text-6xl">🔍</span>
        <h1 className="font-sora text-2xl font-bold text-gray-900 tracking-tight">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button size="md">← Back to Home</Button>
        </Link>
      </div>
    </DashboardLayout>
  );
}
