import { Controller, Post, Body, Headers, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgetDto } from './dto/forget.dto';
import { ResetDto } from './dto/reset.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
      private readonly userService: UserService
  ) {}

 /* @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }*/

  @Post('login')
  async login(@Body() {email, password}: LoginDto) {
    const user = await this.authService.login(email, password);
    return this.authService.login(email, password);
  }  
  @Post('register')
  async register(@Body() {name, email, password, telephone}: RegisterDto){
    return this.authService.register(name, email, password, telephone)
  }

  @Post('forget')
  async forget(@Body() {email}: ForgetDto){
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() {password, token}: ResetDto){
    return this.authService.reset(password, token)
  }

@UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Req() req){

    return {me: 'ok'}
  }
  
}