-- CreateEnum
CREATE TYPE "SchoolLocation" AS ENUM ('KATY', 'SUGARLAND');

-- CreateEnum
CREATE TYPE "ClassFrequency" AS ENUM ('ONCE_A_WEEK', 'TWICE_A_WEEK');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "parentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" "SchoolLocation" NOT NULL,
    "frequency" "ClassFrequency" NOT NULL,
    "selectedDays" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "liabilityAccepted" BOOLEAN NOT NULL DEFAULT false,
    "waiverName" TEXT,
    "waiverAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
