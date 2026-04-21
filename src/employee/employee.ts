import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../app/services/employee.service';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  imports: [CommonModule,ReactiveFormsModule,MatPaginatorModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class EmployeeList {

  employees: any[] = [];
    loading = false;

form!:FormGroup
  isEdit = false;
  id: any;
  page =1;
  limit =5;
  totalitems =0
  search = new FormControl('');
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
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
    this.loadEmployees();

    this.search.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.page = 1;
        this.loadEmployees(value || '');
      });
  
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.isEdit = true;
      this.service.getById(this.id).subscribe(res => {
  this.form.patchValue({
      name: res.name,
      email: res.email,
      role: res.role,
      joiningDate: res.joiningDate
    });
  });
    }
  }
  
  loadEmployees(search: string = '') {
    this.loading = true;

    this.service.getEmployees(this.page, this.limit, search, this.sortBy, this.sortOrder)
      .subscribe({
        next: (res: any) => {
          console.log(res,'data');

          this.employees = res.data;
          this.totalitems = res.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading employees:', err);
          this.loading = false;
          this.toastr.error('Failed to load employees', 'Error');
        }
      });
  }



    onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;

    this.loadEmployees(this.search.value || '');
  }

  sort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.page = 1; 
    this.loadEmployees(this.search.value || '');
  }
  submit() {
    debugger
    if (this.form.invalid) return;

    this.loading = true;

    if (this.isEdit) {
      debugger
      this.service.updateEmployee(this.id, this.form.value)
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
      this.service.addEmployees(this.form.value)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Employee added successfully!', 'Success');
            this.loadEmployees(this.search.value || '')
            this.form.reset()
          },
          error: (err) => {
            console.error('Error adding employee:', err);
            this.loading = false;
            this.toastr.error('Failed to add employee', 'Error');
          }
        });

    }
  }
    add() {
      debugger
    this.router.navigate(['/add']);
  }

  edit(emp: any) {
    debugger
  this.router.navigate(['/edit',emp._id ]);
  }

  delete(id: any) {
    debugger
    if (confirm('Are you sure?')) {
      this.loading = true;
      this.service.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees(this.search.value || '');
          this.toastr.success('Employee deleted successfully!', 'Success');
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          this.loading = false;
          this.toastr.error('Failed to delete employee', 'Error');
        }
      });
    }
  }

}
