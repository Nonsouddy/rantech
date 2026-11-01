import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import AdminShell from "../../../components/admin/AdminShell";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const session = await getSessionFromCookies();

  if (!session) {
    redirect(`/${adminPath}`);
  }

  return (
    <AdminShell adminPath={adminPath} session={session}>
      {children}
    </AdminShell>
  );
}