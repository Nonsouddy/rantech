import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import AdminsManager from "@/components/admin/AdminsManager";

export default async function AdminsPage({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const session = await getSessionFromCookies();

  if (!session) {
    redirect(`/${adminPath}`);
  }
  if (session.role !== "super_admin") {
    redirect(`/${adminPath}/dashboard`);
  }

  return <AdminsManager currentAdminId={session.id} />;
}