import { MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;
}
