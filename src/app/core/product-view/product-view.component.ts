
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AccountService } from 'src/app/account/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Product } from 'src/app/models/product';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {

  productId: number;
  userId: string | undefined;
  product: Product;
  authorizedState: boolean = true;


  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, public accountService: AccountService) { }

  ngOnInit(): void {
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        this.product = response;
        // console.log(this.product);
      },
      error: (err) => console.log(err)

    });
  }

}

