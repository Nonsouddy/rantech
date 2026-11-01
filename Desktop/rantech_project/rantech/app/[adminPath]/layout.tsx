import { notFound } from "next/navigation";

export default async function AdminPathLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ 
    adminPath: string }>;
}) {
  const { adminPath } = await params;

  // If the URL segment doesn't match your secret admin path,
  //Change ADMIN_ROUTE
  // in .env.local any time you suspect this path has leaked.
  if (!process.env.ADMIN_ROUTE || adminPath !== process.env.ADMIN_ROUTE) {
    notFound();
  }

  return <div className="min-h-screen bg-ink">{children}</div>;
}