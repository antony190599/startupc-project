import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/main/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import { getSession } from "@/lib/auth/utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
