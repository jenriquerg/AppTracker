import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    IftaLabelModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        const role = res.user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'delivery') {
          this.router.navigate(['/delivery']);
        } else {
          this.error = 'Rol no reconocido';
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Credenciales incorrectas o error en el servidor';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
