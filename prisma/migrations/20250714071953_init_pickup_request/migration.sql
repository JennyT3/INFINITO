-- CreateTable
CREATE TABLE "PickupRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "pickupDay" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
