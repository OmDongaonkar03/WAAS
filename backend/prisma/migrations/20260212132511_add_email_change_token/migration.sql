-- CreateTable
CREATE TABLE `EmailChangeToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` TEXT NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `oldEmail` VARCHAR(191) NOT NULL,
    `newEmail` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EmailChangeToken_tokenHash_key`(`tokenHash`),
    INDEX `EmailChangeToken_userId_idx`(`userId`),
    INDEX `EmailChangeToken_oldEmail_idx`(`oldEmail`),
    INDEX `EmailChangeToken_newEmail_idx`(`newEmail`),
    INDEX `EmailChangeToken_tokenHash_idx`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
