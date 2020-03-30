import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { PoPageLogin, PoPageLoginLiterals } from '@portinari/portinari-templates';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading: Boolean = false;
  pLiterals: PoPageLoginLiterals = {
    loginHint: 'Caso ainda não possua um e-mail de acesso, entre em contato com o administrador do sistema.',
    rememberUserHint: 'Ative esta opção para não precisar realizar o login novamente em futuros acessos.'
  }

  constructor(public loginService: LoginService, private router: Router) { }

  ngOnInit() { }

  login(formData: PoPageLogin) {
    this.isLoading = true;
    this.loginService.login(formData.login, formData.password, formData.rememberUser, (success, error) => {
      if(success) {
        this.router.navigateByUrl('')
      } else {
        alert('erro no login')
      }
      this.isLoading = false;
    })
  }
}
