import { IsEmail } from "class-validator";

export class ForgetDto{
    @IsEmail()
    email: string;
}