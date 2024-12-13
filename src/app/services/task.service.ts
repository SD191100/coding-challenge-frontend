import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5248/api/task'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken'); // Retrieve token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Attach token to Authorization header
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  addTask(task: any): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Retrieve token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Attach token to Authorization header
    });

    return this.http.post(`${this.apiUrl}`, task, { headers });
  }

  updateTask(taskId: number, task: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/${taskId}`, task, { headers });
  }

  deleteTask(taskId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl}/${taskId}`, { headers });
  }
}
