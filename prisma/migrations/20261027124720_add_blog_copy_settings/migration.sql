-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "blogDescription" TEXT NOT NULL DEFAULT 'Notes on clean food processing, natural ingredients, and the everyday habits that keep a household healthy — straight from our production floor.',
ADD COLUMN     "blogPlaceholderText" TEXT NOT NULL DEFAULT 'Mervida Journal',
ADD COLUMN     "blogTitle" TEXT NOT NULL DEFAULT 'The Journal';
