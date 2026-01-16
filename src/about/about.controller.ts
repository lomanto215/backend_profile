import { 
  Controller, 
  Get, 
  Patch, 
  Post,
  Body, 
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout() {
    return this.aboutService.getAbout();
  }

  @Patch()
  updateAbout(@Body() dto: UpdateAboutDto) {
    return this.aboutService.updateAbout(dto);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed (jpg, png, webp)');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return this.aboutService.updateProfileImage(file);
  }
}