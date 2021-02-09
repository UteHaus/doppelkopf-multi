import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/authenticate`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.updateLocalUserStorage(user);
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  setLanguage(languageKey: string): Observable<void> {
    const user = this.userSubject.value;
    user.languageKey = languageKey;
    this.userSubject.next(user);
    return this.http.put<void>(
      `${environment.apiUrl}/users/${this.userValue.id}/language?language=${languageKey}`,
      {}
    );
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: string, params): Observable<unknown> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
      map((x) => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          this.updateLocalUserStorage(user);
          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      })
    );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }

  private updateLocalUserStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
