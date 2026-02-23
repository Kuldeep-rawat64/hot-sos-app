import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private mockApiUrl = 'assets/mock/auth.json';

  constructor(private http: HttpClient) {}

  login(pin: string): Observable<AuthResponse> {
    // Check network availability first
    if (!navigator.onLine) {
      return of({ success: false, error: 'offline' });
    }

    return this.http.get<{ users: { pin: string; token: string }[] }>(this.mockApiUrl).pipe(
      map((data) => {
        const user = data.users.find((u) => u.pin === pin);
        if (user) {
          return { success: true, token: user.token };
        }
        return { success: false, error: 'invalid-pin' };
      }),
      catchError(() => of({ success: false, error: 'network-error' })),
    );
  }
}
