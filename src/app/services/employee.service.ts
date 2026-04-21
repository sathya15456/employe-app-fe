
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private api = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getEmployees(page: number, limit: number, search: string, sortBy?: string, sortOrder?: string): Observable<Employee[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search);

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<Employee[]>(this.api, {
      ...this.getHeaders(),
      params
    });
  }

  addEmployees(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.api, emp, this.getHeaders());
  }

  updateEmployee(id: string, emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.api}/${id}`, emp, this.getHeaders());
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, this.getHeaders());
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.api}/${id}`, this.getHeaders());
  }
}