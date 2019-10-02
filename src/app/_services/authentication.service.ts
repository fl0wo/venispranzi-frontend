import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('login_ris')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        // '${config.apiUrl}/users/authenticate'
        return this.http.post<any>('http://172.22.8.160:3000/auth/login', { email : username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.data && user.ok) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('login_ris', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('login_ris');
        this.currentUserSubject.next(null);
    }
}
