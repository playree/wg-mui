/*
  Warnings:

  - You are about to drop the column `allowedIPs` on the `Peer` table. All the data in the column will be lost.
  - You are about to drop the column `keepalive` on the `Peer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Peer" (
    "ip" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "remarks" TEXT,
    "isDeleting" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Peer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Peer" ("createdAt", "ip", "isDeleting", "privateKey", "publicKey", "remarks", "updatedAt", "userId") SELECT "createdAt", "ip", "isDeleting", "privateKey", "publicKey", "remarks", "updatedAt", "userId" FROM "Peer";
DROP TABLE "Peer";
ALTER TABLE "new_Peer" RENAME TO "Peer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
