// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function setupTrigger() {
//   // 1. Create or replace the trigger function
//   await prisma.$executeRawUnsafe(`
//     CREATE OR REPLACE FUNCTION update_capacity()
//     RETURNS TRIGGER AS $$
//     BEGIN
//       IF (TG_OP = 'INSERT' AND NEW.active = TRUE) THEN
//         UPDATE "Facility"
//         SET "capacity" = "capacity" - 1
//         WHERE id = NEW."facilityId";

//       ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'CANCELLED' AND (OLD.status = 'RESERVED' OR OLD.status = 'CONFIRMED')) THEN
//         UPDATE "Facility"
//         SET "capacity" = "capacity" + 1
//         WHERE id = NEW."facilityId";
//       END IF;

//       RETURN NEW;
//     END;
//     $$ LANGUAGE plpgsql;
//   `);

//   // 2. Drop the trigger if it exists
//   await prisma.$executeRawUnsafe(`
//     DROP TRIGGER IF EXISTS trg_update_capacity ON "Booking";
//   `);

//   // 3. Create the trigger
//   await prisma.$executeRawUnsafe(`
//     CREATE TRIGGER trg_update_capacity
//     AFTER INSERT OR UPDATE ON "Booking"
//     FOR EACH ROW
//     EXECUTE FUNCTION update_capacity();
//   `);
// }

// async function main() {
//   try {
//     await setupTrigger();
//     console.log('Trigger set up');
//   } catch (err) {
//     console.error('Error setting up trigger:', err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();
