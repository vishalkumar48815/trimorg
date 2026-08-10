CREATE TABLE IF NOT EXISTS "PendingSignup" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  "mobile" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "emailVerificationTokenHash" TEXT NOT NULL,
  "emailVerificationExpiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PendingSignup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PendingSignup_email_key" ON "PendingSignup"("email");
