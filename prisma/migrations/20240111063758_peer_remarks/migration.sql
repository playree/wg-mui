/*
  Warnings:

  - Added the required column `remarks` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Peer" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "allowedIPs" TEXT NOT NULL,
    "persistentKeepalive" INTEGER,
    "remarks" TEXT NOT NULL,
    "isDeleting" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Peer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Peer" ("address", "allowedIPs", "createdAt", "isDeleting", "persistentKeepalive", "privateKey", "publicKey", "updatedAt", "userId") SELECT "address", "allowedIPs", "createdAt", "isDeleting", "persistentKeepalive", "privateKey", "publicKey", "updatedAt", "userId" FROM "Peer";
DROP TABLE "Peer";
ALTER TABLE "new_Peer" RENAME TO "Peer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
