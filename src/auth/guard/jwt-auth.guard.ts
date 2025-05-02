import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly authService: AuthService){
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.split(' ')[1];
        if (token) {
            try{
            const data = this.authService.checkToken(token);
            
            request.tokenPayLoad = data; 
            
            return true;    
            } catch (error) {
                    return false;
                }
        }
       
    }

}