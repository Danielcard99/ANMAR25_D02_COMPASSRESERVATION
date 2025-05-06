import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { users } from 'generated/prisma';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';


@Injectable()
export class AuthService {

  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}


  async createToken(user: users){
    return {
      accessToken: this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email
    },{
      expiresIn: '1h',
      subject: String(user.id),
      issuer: this.issuer,
      audience: this.audience
    })
    }
  }
  
  async checkToken(token: string){

    try{
    const data = await this.jwtService.verify(token, {
      audience: this.audience,
      issuer: this.issuer,
    });

    return data;
    } catch(e){
      throw new UnauthorizedException('Invalid token');
    }
  }

  isValidToken(token: string){
    try{
    this.checkToken(token);
      return true;
  } catch(e){
      return false;
    }
  } 
  
  async login(email: string, password: string){
    const user = await this.prisma.users.findFirst({
      where: {email} 
    });

    if (!user){
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid){
      throw new UnauthorizedException('Email or password incorrect');
    }

    return this.createToken(user);
  }
  
  async forget(email: string){
    const user = await this.prisma.users.findFirst({
      where: {email} 
    });

    if (!user){
      throw new UnauthorizedException('Email incorrect');
    }


    return true;
  }
  
  async reset(password: string, token: string){
    
    const id = 0;
    
    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
      },
    })

    return this.createToken(user);
  }
  
  async register(name: string, email: string, password: string, telephone: string){
   
    const data = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      telephone
    }
   
    const user = await this.prisma.users.create({
      data: data
    })

    return this.createToken(user);
  }
}