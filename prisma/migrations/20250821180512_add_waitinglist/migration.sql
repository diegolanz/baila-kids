-- CreateTable
CREATE TABLE "WaitingList" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "parentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" "SchoolLocation" NOT NULL,
    "requestedDay" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);
