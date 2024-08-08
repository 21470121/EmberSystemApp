import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ScannerService {

    baseUrl = 'https://localhost:7167/api/';

    constructor(private http: HttpClient) { }
   
    verifyOrder(orderNumber: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}Order/ScanQR/` + orderNumber, { });
    }

    completeOrder(orderNumber: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}Order/CompleteOrder/` + orderNumber, { });
    }
  }