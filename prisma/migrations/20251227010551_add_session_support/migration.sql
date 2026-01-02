-- CreateEnum
CREATE TYPE "Session" AS ENUM ('FALL_2024', 'SPRING_2026');

-- AlterTable
ALTER TABLE "ClassSection" ADD COLUMN     "session" "Session" NOT NULL DEFAULT 'FALL_2024';

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "session" "Session" NOT NULL DEFAULT 'FALL_2024';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "session" "Session" NOT NULL DEFAULT 'FALL_2024';

-- AlterTable
ALTER TABLE "WaitingList" ADD COLUMN     "session" "Session" NOT NULL DEFAULT 'FALL_2024';
