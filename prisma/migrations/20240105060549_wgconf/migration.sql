-- CreateTable
CREATE TABLE "WgConf" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "confDirPath" TEXT NOT NULL,
    "interfaceName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "dns" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
