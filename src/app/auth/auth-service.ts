import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, mergeMap, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '@/auth/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private currentUser$ = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private router: Router) {}

    /** Appelé au démarrage de l'app pour initialiser le user */
    init(): Observable<User | null> {
        return this.http.get<User>('/api/users/me').pipe(
            tap(user => this.currentUser$.next(user)),
            catchError(() => {
                this.currentUser$.next(null);
                return of(null);
            })
        );
    }

    get user(): Observable<User | null> {
        return this.currentUser$.asObservable();
    }

    /** Savoir si on est connecté */
    isAuthenticated(): boolean {
        return !!this.currentUser$.value;
    }

    logout(): void {
        this.currentUser$.next(null);
        this.router.navigate(['/auth/login']);
    }

    login(username: string, password: string) {
        return this.http.post<void>('/api/login_check', {username, password}).pipe(
            mergeMap(() => this.init()),
            catchError(() => {
                this.currentUser$.next(null);
                return of(null);
            })
        );
    }
}
