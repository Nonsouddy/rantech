import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSessionFromCookies } from "@/lib/auth";
import { getProjects, saveProjects } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import type { Project } from "@/lib/types";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ projects: getProjects() });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return NextResponse.json({ error: "A project image is required." }, { status: 400 });
  }

  let imagePath: string;
  try {
    imagePath = await saveUploadedImage(imageFile, "projects");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Image upload failed." },
      { status: 400 }
    );
  }

  const newProject: Project = {
    id: crypto.randomUUID(),
    title,
    category,
    location,
    year,
    description,
    image: imagePath,
    createdAt: new Date().toISOString(),
  };

  const projects = getProjects();
  projects.unshift(newProject);
  saveProjects(projects);

  return NextResponse.json({ project: newProject }, { status: 201 });
}