/*
  Warnings:

  - You are about to drop the column `brand` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `commission` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tracking` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `condition` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `garmentType` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "UserImpact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "totalContributions" INTEGER NOT NULL DEFAULT 0,
    "totalPurchases" INTEGER NOT NULL DEFAULT 0,
    "totalCo2Saved" REAL NOT NULL DEFAULT 0,
    "totalWaterSaved" REAL NOT NULL DEFAULT 0,
    "totalEnergySignificant" INTEGER NOT NULL DEFAULT 0,
    "reboundFactor" REAL NOT NULL DEFAULT 0.7,
    "netImpact" REAL NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "badges" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LogisticsRoute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routeId" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "pickupRequests" TEXT NOT NULL,
    "totalWeight" INTEGER NOT NULL DEFAULT 0,
    "totalStops" INTEGER NOT NULL DEFAULT 0,
    "optimizedRoute" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "driverId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contribution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tracking" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "metodo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalles" TEXT,
    "decision" TEXT,
    "pickupPoint" TEXT,
    "trackingState" TEXT NOT NULL DEFAULT 'pendiente',
    "adminUserId" TEXT,
    "classification" TEXT,
    "destination" TEXT,
    "certificateHash" TEXT,
    "certificateDate" DATETIME,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "recyclingPercentage" INTEGER NOT NULL DEFAULT 0,
    "repairPercentage" INTEGER NOT NULL DEFAULT 0,
    "cotton" INTEGER NOT NULL DEFAULT 0,
    "polyester" INTEGER NOT NULL DEFAULT 0,
    "wool" INTEGER NOT NULL DEFAULT 0,
    "other" INTEGER NOT NULL DEFAULT 0,
    "co2Saved" REAL NOT NULL DEFAULT 0,
    "waterSaved" REAL NOT NULL DEFAULT 0,
    "naturalResources" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" REAL,
    "methodology" TEXT,
    "uncertainty" TEXT,
    "region" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "imageUrls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contribution" ("co2Saved", "cotton", "createdAt", "detalles", "estado", "fecha", "id", "metodo", "naturalResources", "nome", "other", "polyester", "recyclingPercentage", "repairPercentage", "tipo", "totalItems", "tracking", "updatedAt", "waterSaved", "wool") SELECT "co2Saved", "cotton", "createdAt", "detalles", "estado", "fecha", "id", "metodo", "naturalResources", "nome", "other", "polyester", "recyclingPercentage", "repairPercentage", "tipo", "totalItems", "tracking", "updatedAt", "waterSaved", "wool" FROM "Contribution";
DROP TABLE "Contribution";
ALTER TABLE "new_Contribution" RENAME TO "Contribution";
CREATE UNIQUE INDEX "Contribution_tracking_key" ON "Contribution"("tracking");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tracking" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "garmentType" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "originalPrice" REAL NOT NULL,
    "commission" REAL NOT NULL,
    "finalPrice" REAL NOT NULL,
    "sellerName" TEXT NOT NULL,
    "sellerEmail" TEXT,
    "sellerPhone" TEXT,
    "estimatedWeight" REAL NOT NULL DEFAULT 0,
    "standardImpact" JSONB,
    "aiDetection" JSONB,
    "aiConfidence" REAL,
    "photo1Url" TEXT NOT NULL,
    "photo2Url" TEXT NOT NULL,
    "photo3Url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "publishedAt" DATETIME,
    "soldAt" DATETIME,
    "impactCo2" TEXT,
    "impactWater" TEXT,
    "impactEff" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("color", "condition", "country", "createdAt", "garmentType", "gender", "id", "impactCo2", "impactEff", "impactWater", "material", "name", "photo1Url", "photo2Url", "price", "sellerName", "size", "updatedAt") SELECT "color", "condition", "country", "createdAt", "garmentType", "gender", "id", "impactCo2", "impactEff", "impactWater", "material", "name", "photo1Url", "photo2Url", "price", "sellerName", "size", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserImpact_userId_key" ON "UserImpact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsRoute_routeId_key" ON "LogisticsRoute"("routeId");
