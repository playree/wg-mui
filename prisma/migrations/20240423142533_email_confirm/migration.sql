-- CreateTable
CREATE TABLE "EmailConfirm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "onetimeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailConfirm_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirm_onetimeId_key" ON "EmailConfirm"("onetimeId");
