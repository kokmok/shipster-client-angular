import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/auth/auth-service';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, Message, NgIf],
    templateUrl: 'login.html'
})
export class Login {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    email: string = '';

    password: string = '';

    checked: boolean = false;
    error: boolean = false;

    submit() {
        this.error = false;
        this.authService.login(this.email, this.password).subscribe((user) => {
            if (user) {
                this.router.navigate(['/']);
            }
            this.error = true;
        }, error1 => {
            this.error = true;
            console.log('error');
        });
    }
}
