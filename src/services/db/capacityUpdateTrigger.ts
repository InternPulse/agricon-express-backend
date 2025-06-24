import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupTrigger() {
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION update_capacity()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (TG_OP = 'INSERT' AND NEW.active = TRUE) THEN
        UPDATE "Facility"
        SET "capacity" = "capacity" - 1
        WHERE id = NEW.facilityId;

      ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'FALSE' AND OLD.status = 'TRUE') THEN
        UPDATE "Facility"
        SET "capacity" = "capacity" + 1
        WHERE id = NEW.facilityId;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_capacity
    AFTER INSERT OR UPDATE ON "Booking"
    FOR EACH ROW
    EXECUTE FUNCTION update_capacity();
  `);
}

setupTrigger()
  .then(() => console.log('Trigger set up ✅'))
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
