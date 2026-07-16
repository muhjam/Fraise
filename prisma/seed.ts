import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@getrai.id";
    const password = "Password123%";
    const passwordHash = await bcrypt.hash(password, 12);

    console.log("🌱 Seeding super admin account...");

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash,
            role: "SUPER_ADMIN",
            name: "Super Admin",
        },
    });

    console.log(`✅ Created user: ${user.email} (role: ${user.role})`);
    console.log("🗑  Deleting seeded account...");

    await prisma.user.delete({ where: { id: user.id } });

    console.log("✅ Seed account deleted. Database is clean.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
