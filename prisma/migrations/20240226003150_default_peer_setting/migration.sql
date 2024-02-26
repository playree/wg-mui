-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WgConf" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "confDirPath" TEXT NOT NULL,
    "interfaceName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "listenPort" INTEGER NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "postUp" TEXT,
    "postDown" TEXT,
    "endPoint" TEXT NOT NULL,
    "dns" TEXT,
    "defaultAllowedIPs" TEXT,
    "defaultKeepalive" INTEGER NOT NULL DEFAULT 25,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WgConf" ("address", "confDirPath", "createdAt", "dns", "endPoint", "id", "interfaceName", "listenPort", "postDown", "postUp", "privateKey", "publicKey", "updatedAt") SELECT "address", "confDirPath", "createdAt", "dns", "endPoint", "id", "interfaceName", "listenPort", "postDown", "postUp", "privateKey", "publicKey", "updatedAt" FROM "WgConf";
DROP TABLE "WgConf";
ALTER TABLE "new_WgConf" RENAME TO "WgConf";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
