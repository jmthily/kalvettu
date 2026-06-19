import { AuthGuard } from "@/components/AuthGuard";
import { DashboardNav } from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-cream-50">
        <DashboardNav />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
