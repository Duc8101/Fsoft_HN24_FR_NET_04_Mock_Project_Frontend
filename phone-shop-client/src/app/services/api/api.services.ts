import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private readonly httpClient: HttpClient) {

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

  get(url: string, parameters: Map<string, any> | null, headers: HttpHeaders | null): Observable<any> {
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

    if (headers === null) {
      return this.httpClient.get<any>(url).pipe(catchError(this.handleError));
    }
    return this.httpClient.get<any>(url, { headers }).pipe(catchError(this.handleError));
  }

  post(url: string, body: any, parameters: Map<string, any> | null, headers: HttpHeaders): Observable<any> {

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

    return this.httpClient.post<any>(url, body, { headers }).pipe(catchError(this.handleError));
  }

  put(url: string, data: any, headers: HttpHeaders): Observable<any> {
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
    return this.httpClient.delete<any>(url).pipe(catchError(this.handleError));
  }

}
