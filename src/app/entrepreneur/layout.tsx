import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";

export default function EntrepreneurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["entrepreneur"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
