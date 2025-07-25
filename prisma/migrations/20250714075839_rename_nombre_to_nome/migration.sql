/*
  Warnings:

  - You are about to drop the column `nombre` on the `Contribution` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Contribution` table without a default value. This is not possible if the table is not empty.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contribution" ("createdAt", "detalles", "estado", "fecha", "id", "metodo", "tipo", "tracking", "updatedAt") SELECT "createdAt", "detalles", "estado", "fecha", "id", "metodo", "tipo", "tracking", "updatedAt" FROM "Contribution";
DROP TABLE "Contribution";
ALTER TABLE "new_Contribution" RENAME TO "Contribution";
CREATE UNIQUE INDEX "Contribution_tracking_key" ON "Contribution"("tracking");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
