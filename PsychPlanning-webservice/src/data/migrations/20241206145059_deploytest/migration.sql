-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `voornaam` VARCHAR(255) NOT NULL,
    `naam` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `telefoon` VARCHAR(255) NOT NULL,
    `roles` JSON NOT NULL,
    `straat` VARCHAR(191) NULL,
    `nr` INTEGER NULL,
    `postcode` INTEGER NULL,
    `stad` VARCHAR(191) NULL,
    `geboortedatum` DATETIME(0) NULL,
    `huisarts` VARCHAR(191) NULL,
    `ervaring` INTEGER NULL,

    UNIQUE INDEX `idx_user_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,
    `duur` INTEGER NOT NULL,
    `prijs` DOUBLE NOT NULL,
    `beschrijving` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `services_naam_key`(`naam`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `afspraken` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `datum` DATETIME(0) NOT NULL,
    `formulier_nodig` BOOLEAN NOT NULL,
    `opmerking` VARCHAR(191) NULL,
    `klant_id` INTEGER UNSIGNED NOT NULL,
    `psycholoog_id` INTEGER UNSIGNED NOT NULL,
    `service_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beschikbaarheden` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `psycholoog_id` INTEGER UNSIGNED NOT NULL,
    `datum_start` DATETIME(0) NOT NULL,
    `datum_eind` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PsycholoogServices` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_PsycholoogServices_AB_unique`(`A`, `B`),
    INDEX `_PsycholoogServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `afspraken` ADD CONSTRAINT `afspraken_klant_id_fkey` FOREIGN KEY (`klant_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `afspraken` ADD CONSTRAINT `afspraken_psycholoog_id_fkey` FOREIGN KEY (`psycholoog_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `afspraken` ADD CONSTRAINT `afspraken_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beschikbaarheden` ADD CONSTRAINT `beschikbaarheden_psycholoog_id_fkey` FOREIGN KEY (`psycholoog_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PsycholoogServices` ADD CONSTRAINT `_PsycholoogServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PsycholoogServices` ADD CONSTRAINT `_PsycholoogServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
