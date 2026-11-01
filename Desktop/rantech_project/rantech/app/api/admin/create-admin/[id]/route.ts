import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getAdmins, saveAdmins, findAdminById } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only the super admin can remove admins." },
      { status: 403 }
    );
  }

  const { id } = await params;

  if (id === session.id) {
    return NextResponse.json(
      { error: "You can't delete your own account." },
      { status: 400 }
    );
  }

  const target = findAdminById(id);
  if (!target) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  if (target.role === "super_admin") {
    return NextResponse.json(
      { error: "Super admin accounts can't be deleted from the dashboard." },
      { status: 403 }
    );
  }

  const admins = getAdmins().filter((a) => a.id !== id);
  saveAdmins(admins);

  return NextResponse.json({ ok: true });
}