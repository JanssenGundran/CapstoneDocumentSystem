import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id?: number;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';


  constructor(private http: HttpClient) {}

  register(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    if (error.error && error.error.message) {
      errorMsg = error.error.message;
    }
    return throwError(() => new Error(errorMsg));
  }
}
