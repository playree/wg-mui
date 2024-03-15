-- CreateTable
CREATE TABLE "LinkGoogle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sub" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "onetimeId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LinkGoogle_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkGoogle_sub_key" ON "LinkGoogle"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "LinkGoogle_onetimeId_key" ON "LinkGoogle"("onetimeId");
