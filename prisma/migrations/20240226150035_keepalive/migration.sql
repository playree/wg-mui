/*
  Warnings:

  - You are about to drop the column `persistentKeepalive` on the `Peer` table. All the data in the column will be lost.
  - Added the required column `keepalive` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Peer" (
    "ip" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "allowedIPs" TEXT,
    "keepalive" INTEGER NOT NULL,
    "remarks" TEXT,
    "isDeleting" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Peer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Peer" ("allowedIPs", "createdAt", "ip", "isDeleting", "privateKey", "publicKey", "remarks", "updatedAt", "userId") SELECT "allowedIPs", "createdAt", "ip", "isDeleting", "privateKey", "publicKey", "remarks", "updatedAt", "userId" FROM "Peer";
DROP TABLE "Peer";
ALTER TABLE "new_Peer" RENAME TO "Peer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
