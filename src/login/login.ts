import { Component } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading :boolean=false;
  errorMsg ='';
  form!:FormGroup;
  constructor( private fb:FormBuilder,private http:HttpClient,private router:Router,private toastr:ToastrService){}

  ngOnInit(){
    this.form =this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    })
  }
  login(){
    if(this.form.invalid) return;
    this.loading =true
    this.errorMsg =""
    

    this.http.post<any>('http://localhost:3000/login',this.form.value).subscribe({
      next:(res) =>{
        localStorage.setItem('token',res.token);

 this.toastr.success('Login Successful ✅');

setTimeout(() => {
  this.loading = false;
  this.router.navigate(['/employees']);
}, 1500);
      },
      error:(err) =>{
        this.loading =false;
        const msg =err.error?.message || 'Login Failed';
        this.errorMsg =msg
        this.toastr.error(msg)
      }
    })
  }

}
