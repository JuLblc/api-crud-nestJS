import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
