import { PrismaClient as NewPrismaClient } from "@prisma/client";
import { PrismaClient as OldPrismaClient } from "../../generated/old-client";

const oldDb = new OldPrismaClient();
const newDb = new NewPrismaClient();

async function main() {
  const configs = await oldDb.appConfig.findMany();

  console.log(`Migrating ${configs.length} app config entries...`);

  for (const config of configs) {
    await newDb.appConfig.upsert({
      where: {
        key: config.key,
      },
      update: {
        value: config.value,
      },
      create: {
        key: config.key,
        value: config.value,
      },
    });
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  });