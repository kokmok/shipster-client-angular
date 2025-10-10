import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@/auth/auth-service';

@Injectable({
    providedIn: 'root'
})
export class AuthGard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    canActivate(): boolean | UrlTree {
        return this.auth.isAuthenticated() ? true : this.router.createUrlTree(['/auth/login']);
    }
}
