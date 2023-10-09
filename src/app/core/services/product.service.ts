import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createProduct(Product: any) {
    return this.http.post<any>(`${this.baseUrl}Product`, Product);
  }

  getAllProducts(UserId: string, searchTerm?: string) {
    if ((searchTerm == undefined) || (searchTerm == null)) {
      return this.http.get<Product[]>(`${this.baseUrl}Product?UserId=${UserId}`);
    } else {
      return this.http.get<Product[]>(`${this.baseUrl}Product?UserId=${UserId}&searchTerm=${searchTerm}`);
    }
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<Product>(`${this.baseUrl}Product/${id}`);
  }

  updateProduct(productId: number, Product: Product) {
    return this.http.put<Product>(`${this.baseUrl}Product/${productId}`, Product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Product/${id}`);
  }
}
