import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpRequestBuilder} from "@core/http/HttpRequestBuilder";

@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(
        private readonly http: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router
    ) {}

    request(): HttpRequestBuilder {
        return new HttpRequestBuilder(this.http, this.snackBar, this.router);
    }
}