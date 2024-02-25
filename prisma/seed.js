const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("test1234!", 10);

    const newUser = await prisma.user.create({
        data: {
            name: "test1",
            email: "test1",
            password: hashedPassword,
        },
    });

    console.log("Created user:", newUser);
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
