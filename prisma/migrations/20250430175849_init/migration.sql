-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
