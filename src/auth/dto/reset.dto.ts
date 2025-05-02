import { IsJWT, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ResetDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'password must have at least one number or letter',
    })
    password: string;

    @IsJWT()
    token: string;
}