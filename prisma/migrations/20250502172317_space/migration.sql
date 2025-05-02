-- CreateTable
CREATE TABLE `space` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `space_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
