-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "sellerName" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "photo1Url" TEXT NOT NULL,
    "photo2Url" TEXT NOT NULL,
    "garmentType" TEXT,
    "color" TEXT,
    "gender" TEXT,
    "size" TEXT,
    "material" TEXT,
    "country" TEXT,
    "condition" TEXT,
    "brand" TEXT,
    "impactCo2" TEXT,
    "impactWater" TEXT,
    "impactEff" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
