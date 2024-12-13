import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_BASE_URL}/auth`;
  constructor(private http: HttpClient) {}

  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      credentials,
    );
  }

  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1]; // Extract payload
      const decodedPayload = atob(payload); // Decode base64
      return JSON.parse(decodedPayload); // Parse JSON
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  getUserId(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? parseInt(decodedToken.sub) : null;
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }
}
