import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { UpdateAboutDto } from './dto/update-about.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AboutService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService,
    ) {}
    
    async getAbout() {
        const about = await this.prisma.about.findFirst();
        if (!about) {
            throw new NotFoundException('About information not found');
        }

        return about;
    }

    async updateAbout(dto: UpdateAboutDto) {
        const about = await this.prisma.about.findFirst();
        if (!about) {
            return this.prisma.about.create({
                data: {
                    name: dto.name || 'Yout Name',
                    title: dto.title || 'Your Title',
                    bio: dto.bio || 'Your bio',
                    email: dto.email || 'your@email.com',
                    phone: dto.phone || '+62',
                    instagram: dto.instagram || '@username',
                    github: dto.github || '',
                    linkedin: dto.linkedin || '',
                    profileImage: dto.profileImage || '',
                }
            });
        }

        return this.prisma.about.update({
            where: { id: about.id },
            data: dto,
        });
    }

    async updateProfileImage(file: Express.Multer.File) {
        const about = await this.prisma.about.findFirst();

        if (!about) {
            throw new NotFoundException('About information not found');
        }

        if (about.profileImage) {
            try {
                await this.cloudinaryService.deleteImage(about.profileImage);
            } catch (error) {
                console.log('Error deleting old image:', error);
            }
        }

        const uploadedImageUrl = await this.cloudinaryService.uploadImage(file);

        return this.prisma.about.update({
            where: { id: about.id },
            data: { profileImage: uploadedImageUrl },
        });
    }
}