import { Routes } from '@angular/router';
import { Login } from '../login/login';
import { EmployeeForm } from '../employee-form/employee-form';
import { EmployeeList } from '../employee/employee';

export const routes: Routes = [
    {path:'',component:Login},
    {path:'employees',component:EmployeeList},
    {path:'add',component:EmployeeForm},
    {path:'edit/:id',component:EmployeeForm}
];
