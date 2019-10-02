import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {

  baseUrl = 'http://172.22.8.160:3000';

    getByToken(token: string): any {

        const headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', token);

        return this.http.get(this.baseUrl + `/auth/me`, {headers});
    }
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(this.baseUrl + '/users');
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + `/users/${id}`);
    }

    register(user: User) {
        return this.http.post(this.baseUrl + '/auth/register', user);
    }

    update(user: User) {
        return this.http.put(this.baseUrl + '/auth/register', user);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + '/auth/register');
    }

    getLastMenus(nMenus: number, token: string) {

        const headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', token);


        return this.http.get(this.baseUrl + '/menu/all', {headers});
    }
    pushNewMenu(fileList: FileList, token: string) {

        const file: File = fileList[0];
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        const headers = new HttpHeaders()
        // .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', token);


        return this.http.post(this.baseUrl + '/menu/pdf/upload', formData, {headers});
    }
}
