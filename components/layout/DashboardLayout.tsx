import { ReactNode } from 'react';
import Head from 'next/head';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  title,
  pageTitle,
}: DashboardLayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} | Saral`}</title>
        <meta name="description" content="Saral — Campaign Management Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-brand-content font-dm">
        <Sidebar />
        <div className="ml-[220px] flex flex-col flex-1 min-h-screen">
          <Topbar title={pageTitle ?? title} />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
