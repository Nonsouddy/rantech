import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSessionFromCookies } from "@/lib/auth";
import { getHeroSlides, saveHeroSlides } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import type { HeroSlide } from "@/lib/types";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ slides: getHeroSlides() });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const form = await req.formData();
  const caption = form.get("caption")?.toString().trim();
  const orderRaw = form.get("order")?.toString().trim();
  const imageFile = form.get("image");

  if (!caption) {
    return NextResponse.json({ error: "Caption is required." }, { status: 400 });
  }
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return NextResponse.json({ error: "A slide image is required." }, { status: 400 });
  }

  let imagePath: string;
  try {
    imagePath = await saveUploadedImage(imageFile, "hero");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Image upload failed." },
      { status: 400 }
    );
  }

  const existing = getHeroSlides();
  const newSlide: HeroSlide = {
    id: crypto.randomUUID(),
    image: imagePath,
    caption,
    order: orderRaw ? Number(orderRaw) : existing.length + 1,
    createdAt: new Date().toISOString(),
  };

  existing.push(newSlide);
  saveHeroSlides(existing);

  return NextResponse.json({ slide: newSlide }, { status: 201 });
}