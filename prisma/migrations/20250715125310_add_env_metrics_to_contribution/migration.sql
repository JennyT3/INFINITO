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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contribution" ("createdAt", "detalles", "estado", "fecha", "id", "metodo", "nome", "tipo", "tracking", "updatedAt") SELECT "createdAt", "detalles", "estado", "fecha", "id", "metodo", "nome", "tipo", "tracking", "updatedAt" FROM "Contribution";
DROP TABLE "Contribution";
ALTER TABLE "new_Contribution" RENAME TO "Contribution";
CREATE UNIQUE INDEX "Contribution_tracking_key" ON "Contribution"("tracking");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
