import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../app/services/employee.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-employee-form',
  imports: [CommonModule,ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm {
form!:FormGroup

  isEdit = false;
  id: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    debugger
   this.form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    joiningDate: ['', Validators.required]
  });
    this.id = (this.route.snapshot.paramMap.get('id'));



      if (this.id) {
    this.isEdit = true;
    this.loading = true;

    this.service.getById(this.id).subscribe({
      next: (emp: any) => {
        if (emp.joiningDate) {
          emp.joiningDate = new Date(emp.joiningDate).toISOString().split('T')[0];
        }
        this.form.patchValue(emp);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employee', err);
        this.loading = false;
        this.toastr.error('Failed to load employee data', 'Error');
      }
    });
  }
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    if (this.isEdit) {
      this.service.updateEmployee(this.id, this.form.value as any)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Employee updated successfully!', 'Success');
            this.router.navigate(['/employees']);
          },
          error: (err) => {
            console.error('Error updating employee:', err);
            this.loading = false;
            this.toastr.error('Failed to update employee', 'Error');
          }
        });
    } else {
      this.service.addEmployees(this.form.value as any)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Employee added successfully!', 'Success');
            this.router.navigate(['/employees']);
          },
          error: (err) => {
            console.error('Error adding employee:', err);
            this.loading = false;
            this.toastr.error('Failed to add employee', 'Error');
          }
        });
    }
  }
}
