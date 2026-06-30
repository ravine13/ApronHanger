import logger from './lib/logger';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();
async function main() {
  logger.info("Seeding database (minimal — no demo jobs or applicants)...");

const adminPassword = await bcrypt.hash("admin123", 10);

console.log("Creating admin...");

const admin = await prisma.adminUser.upsert({
  where: {
    email: "admin@apronhanger.in",
  },
  update: {
    name: "ApronHanger Admin",
    passwordHash: adminPassword,
    tokenVersion: 0,
  },
  create: {
    name: "ApronHanger Admin",
    email: "admin@apronhanger.in",
    passwordHash: adminPassword,
    tokenVersion: 0,
  },
});

console.log("Admin created:", admin);

  logger.info("Demo admin ready:");
  logger.info("Email: admin@apronhanger.in");
  logger.info("Password: admin123");

  const existing = await prisma.hospital.findFirst();

  if (existing) {
    logger.info("Hospital already exists; skipping hospital seed.");
    return;
  }

  await prisma.hospital.create({
    data: {
      name: "Demo Multispeciality Hospital",
      shortName: "Demo Hospital",
      type: "Multispeciality Hospital",
      city: "Kolkata",
      state: "West Bengal",
      address: "",
      phone: "",
      email: "recruitment@demo-hospital.in",
      website: "",
      registrationNumber: "",
      beds: 0,
      founded: 2000,
      about:
        "Complete your hospital profile in Settings after signing in as a recruiter.",
      specialties: JSON.stringify([
        "General Medicine",
        "Cardiology",
        "Nursing",
      ]),
      verified: false,
      verifiedOn: null,
      verifiedBy: null,
    },
  });

  logger.info("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });