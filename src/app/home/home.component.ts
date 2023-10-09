import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { ProductService } from '../core/services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productList: Product[] = [];
  userId: string | undefined;
  searchTerm: string;
  role: string;

  constructor(public accountService: AccountService, private productService: ProductService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (res) => {
        console.log(this.role);

        res?.roles.forEach(role => {
          if (role == "Customer") {
            this.role = "Customer";
          } else if (role == "Manager") {
            this.role = "Manager";
          } else {
            this.role = "Admin";
          }
        });
        this.userId = res?.userId;
        this.getAllProducts();
      }
    });
  }

  search(): void {
    if (!this.searchTerm) {
      this.getAllProducts();
    } else {
      this.getAllProducts(this.searchTerm);
    }
  }


  getAllProducts(searcTerm?: string) {
    this.productService.getAllProducts(this.userId as string, searcTerm).subscribe({
      next: (response) => this.productList = response,
      error: (err) => console.log(err)
    });
  }
}
