import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Media } from "./media";
import { AppConfig } from "../../app.config";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  readonly headers: HttpHeaders;
  constructor(private readonly httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': Media.CONTENT_TYPE,
      'Authorization': `Bearer ${AppConfig.token}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Lỗi client-side hoặc network
      console.error('An error occurred:', error.error.message);
    } else {
      // Lỗi server-side
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Trả về một observable lỗi cho người dùng
    return throwError('Có lỗi xảy ra; vui lòng thử lại sau.');
  }

  get(url: string, parameters: Map<string, any> | null): Observable<any> {
    let param: string[] = [];

    if (parameters != null && parameters.size > 0) {
      param.push("?");
      let keys = Array.from(parameters.keys());
      let values = Array.from(parameters.values());
      for (let i = 0; i < keys.length; i++) {
        if (i === 0) {
          param.push(`${keys[i]}=${values[i]}`);
        } else {
          param.push(`&${keys[i]}=${values[i]}`);
        }
      }
      url = url + param.join('');
    }

    const headers = this.headers;
    return this.httpClient.get<any>(url, { headers }).pipe(catchError(this.handleError));
  }

  post(url: string, body: any, parameters: Map<string, any> | null): Observable<any> {
    console.log(AppConfig.token)
    let param: string[] = [];

    if (parameters != null && parameters.size > 0) {
      param.push("?");
      let keys = Array.from(parameters.keys());
      let values = Array.from(parameters.values());
      for (let i = 0; i < keys.length; i++) {
        if (i === 0) {
          param.push(`${keys[i]}=${values[i]}`);
        } else {
          param.push(`&${keys[i]}=${values[i]}`);
        }
      }
      url = url + param.join('');
    }

    const headers = this.headers;
    return this.httpClient.post<any>(url, body, { headers }).pipe(catchError(this.handleError));
  }

  put(url: string, data: any): Observable<any> {
    const headers = this.headers;
    return this.httpClient.put<any>(url, data, { headers }).pipe(catchError(this.handleError));
  }

  delete(url: string, parameters: Map<string, any> | null): Observable<any> {
    let param: string[] = [];

    if (parameters != null && parameters.size > 0) {
      param.push("?");
      let keys = Array.from(parameters.keys());
      let values = Array.from(parameters.values());
      for (let i = 0; i < keys.length; i++) {
        if (i === 0) {
          param.push(`${keys[i]}=${values[i]}`);
        } else {
          param.push(`&${keys[i]}=${values[i]}`);
        }
      }
      url = url + param.join('');
    }

    const headers = this.headers;
    return this.httpClient.delete<any>(url, { headers }).pipe(catchError(this.handleError));
  }

}
