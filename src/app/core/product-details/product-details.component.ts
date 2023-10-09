import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  formData = new FormData();
  productId: number;
  userId: string | undefined;
  product: Product;
  role: string;
  visible: boolean = false;
  editMode: boolean = false;

  productform = this.fb.group({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    userId: ''
  });


  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
    private productService: ProductService, public accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (res) => {
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
        if (this.activatedRoute.snapshot.paramMap.get('id') == 'new') {
          this.editMode = false
        } else {
          this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
          this.editMode = true;
          this.getproduct(this.productId);
        }
      }
    });
  }

  getproduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        // console.log(response);

        this.productId = response.id;
        this.productform.setValue({
          name: response.name,
          description: response.description,
          price: response.price,
          categoryId: response.category.categoryId,
          userId: response.userId as string
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 401 || err.status == 404) {
        }
      }
    })
  }

  createProduct() {
    this.productform.controls.userId.setValue(this.userId as string);
    this.productService.createProduct(this.productform.value as Product).subscribe({
      next: (response) => {
        this.showSuccessMessage('Created');
        this.visible = true;
        this.router.navigateByUrl('');

      },
      error: (error) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  updateProduct() {
    this.product = this.productform.value as Product;
    this.product.id = this.productId;

    this.productService.updateProduct(this.productId, this.product).subscribe({
      next: (response) => {
        this.showSuccessMessage('Updated');
        this.visible = true;
      },
      error: (error) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  deleteProduct() {
    this.productService.deleteProduct(this.productId).subscribe({
      next: (response) => {
        this.showSuccessMessage('Deleted');
        this.router.navigateByUrl('');
      },
      error: (error) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  showSuccessMessage(operation: string) {
    this.toastr.success(`${operation} successfully`, 'Success');
  }

  showErrorMessage(error: string) {
    this.toastr.error(`${error}`, 'ERROR',);
  }
}
