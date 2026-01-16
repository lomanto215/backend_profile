import { IsString, isEmail, IsOptional } from "class-validator";

export class UpdateAboutDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    instagram?: string;

    @IsString()
    @IsOptional()
    github?: string;

    @IsString()
    @IsOptional()
    linkedin?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;
}