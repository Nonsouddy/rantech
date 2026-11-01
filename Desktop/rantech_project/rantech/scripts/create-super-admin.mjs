// Run with: node scripts/create-super-admin.mjs
// Creates (or promotes) a super admin in data/admins.json.
// This is a one-time setup script — do NOT expose admin creation
// publicly on the website except via the super admin's dashboard.

import fs from "fs";
import path from "path";
import readline from "readline";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");

function readAdmins() {
  if (!fs.existsSync(ADMINS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ADMINS_FILE, "utf-8"));
}

function writeAdmins(admins) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n=== RANTECH — Create Super Admin ===\n");

  const name = (await ask(rl, "Full name: ")).trim();
  const email = (await ask(rl, "Email: ")).trim().toLowerCase();
  const password = (await ask(rl, "Password (min 8 chars): ")).trim();

  rl.close();

  if (!name || !email || password.length < 8) {
    console.error("\nAborted: name, email and an 8+ char password are required.");
    process.exit(1);
  }

  const admins = readAdmins();

  if (admins.some((a) => a.email.toLowerCase() === email)) {
    console.error(`\nAn admin with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  admins.push({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    role: "super_admin",
    createdAt: new Date().toISOString(),
  });

  writeAdmins(admins);

  console.log(`\nSuper admin "${name}" <${email}> created successfully.`);
  console.log("You can now log in at your secret admin path.\n");
}

main();