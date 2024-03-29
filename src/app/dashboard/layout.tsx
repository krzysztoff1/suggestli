import { Nav } from "../../components/dashboard/nav";
import { TopBar } from "../../components/dashboard/top-bar";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <TopBar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Nav />
        {children}
      </main>
    </div>
  );
}
