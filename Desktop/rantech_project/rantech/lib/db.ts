import fs from "fs";
import path from "path";
import type { Admin, Project, HeroSlide, Submission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureFile<T>(filename: string, fallback: T): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

function readJSON<T>(filename: string, fallback: T): T {
  ensureFile(filename, fallback);
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  ensureFile(filename, data);
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ---------- Admins ----------
export function getAdmins(): Admin[] {
  return readJSON<Admin[]>("admins.json", []);
}

export function saveAdmins(admins: Admin[]): void {
  writeJSON("admins.json", admins);
}

export function findAdminByEmail(email: string): Admin | undefined {
  return getAdmins().find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function findAdminById(id: string): Admin | undefined {
  return getAdmins().find((a) => a.id === id);
}

// ---------- Projects ----------
export function getProjects(): Project[] {
  return readJSON<Project[]>("projects.json", []);
}

export function saveProjects(projects: Project[]): void {
  writeJSON("projects.json", projects);
}

// ---------- Hero slides ----------
export function getHeroSlides(): HeroSlide[] {
  const slides = readJSON<HeroSlide[]>("hero-slides.json", []);
  return slides.sort((a, b) => a.order - b.order);
}

export function saveHeroSlides(slides: HeroSlide[]): void {
  writeJSON("hero-slides.json", slides);
}

// ---------- Submissions ----------
export function getSubmissions(): Submission[] {
  const subs = readJSON<Submission[]>("submissions.json", []);
  return subs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveSubmissions(subs: Submission[]): void {
  writeJSON("submissions.json", subs);
}

export function hasSuperAdmin(): boolean {
  return getAdmins().some((a) => a.role === "super_admin");
}