import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { hasSuperAdmin } from "@/lib/db";
import LoginForm from "@/components/admin/LoginForm";
import SetupForm from "../../components/admin/SetupForm";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const session = await getSessionFromCookies();

  if (session) {
    redirect(`/${adminPath}/dashboard`);
  }

  // No super admin has been created yet — show the one-time setup
  // screen instead of the login form.
  if (!hasSuperAdmin()) {
    return <SetupForm adminPath={adminPath} />;
  }

  return <LoginForm adminPath={adminPath} />;
}