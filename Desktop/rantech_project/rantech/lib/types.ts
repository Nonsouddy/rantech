export type AdminRole = "super_admin" | "admin";

export type Admin = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
};

export type PublicAdmin = Omit<Admin, "passwordHash">;

export type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  createdAt: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  caption: string;
  order: number;
  createdAt: string;
};

export type Submission = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
  confirmationSent: boolean;
  confirmationSentAt: string | null;
};