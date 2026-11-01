import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getHeroSlides, saveHeroSlides } from "@/lib/db";
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

  const slides = getHeroSlides();
  const index = slides.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Slide not found." }, { status: 404 });
  }

  const form = await req.formData();
  const caption = form.get("caption")?.toString().trim();
  const orderRaw = form.get("order")?.toString().trim();
  const imageFile = form.get("image");

  if (!caption) {
    return NextResponse.json({ error: "Caption is required." }, { status: 400 });
  }

  const existing = slides[index];
  let imagePath = existing.image;

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imagePath = await saveUploadedImage(imageFile, "hero");
      deleteUploadedImage(existing.image);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Image upload failed." },
        { status: 400 }
      );
    }
  }

  slides[index] = {
    ...existing,
    caption,
    order: orderRaw ? Number(orderRaw) : existing.order,
    image: imagePath,
  };

  saveHeroSlides(slides);
  return NextResponse.json({ slide: slides[index] });
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

  const slides = getHeroSlides();
  const target = slides.find((s) => s.id === id);
  if (!target) {
    return NextResponse.json({ error: "Slide not found." }, { status: 404 });
  }

  deleteUploadedImage(target.image);
  saveHeroSlides(slides.filter((s) => s.id !== id));

  return NextResponse.json({ ok: true });
}