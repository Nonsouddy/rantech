import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getProjects, saveProjects } from "@/lib/db";
import { saveUploadedImage, deleteUploadedImage } from "@/lib/upload";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;

  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const form = await req.formData();
  const title = form.get("title")?.toString().trim();
  const category = form.get("category")?.toString().trim();
  const location = form.get("location")?.toString().trim();
  const year = form.get("year")?.toString().trim();
  const description = form.get("description")?.toString().trim();
  const imageFile = form.get("image");

  if (!title || !category || !location || !year || !description) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const existing = projects[index];
  let imagePath = existing.image;

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imagePath = await saveUploadedImage(imageFile, "projects");
      deleteUploadedImage(existing.image);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Image upload failed." },
        { status: 400 }
      );
    }
  }

  projects[index] = {
    ...existing,
    title,
    category,
    location,
    year,
    description,
    image: imagePath,
  };

  saveProjects(projects);
  return NextResponse.json({ project: projects[index] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;

  const projects = getProjects();
  const target = projects.find((p) => p.id === id);
  if (!target) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  deleteUploadedImage(target.image);
  saveProjects(projects.filter((p) => p.id !== id));

  return NextResponse.json({ ok: true });
}