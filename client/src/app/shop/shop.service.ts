import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(
    private http: HttpClient,
  ) { }

  getProducts(shopParams: ShopParams) {
    let httpParams = new HttpParams();

    if (shopParams.brandId !== 0) {
      httpParams = httpParams.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId !== 0) {
      httpParams = httpParams.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search) {
      httpParams = httpParams.append('search', shopParams.search);
    }

    httpParams = httpParams.append('sort', shopParams.sort);
    httpParams = httpParams.append('pageIndex', shopParams.pageNumber.toString());
    httpParams = httpParams.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'products', { observe: 'response', params: httpParams })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes() {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
