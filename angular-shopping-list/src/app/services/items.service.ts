import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  public add(product: Item) {
    let products: any[] = [];
    this.getAll('products').subscribe((product) => (products = product));
    product.id =
      products.length > 0
        ? Math.max(...products.map((product) => product.id)) + 1
        : 0;
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
  }

  public addToBoughtList(boughtProduct: Item) {
    let boughtProducts: any[] = [];
    this.getAll('boughtProducts').subscribe(
      (boughtProduct) => (boughtProducts = boughtProduct)
    );
    boughtProducts.push(boughtProduct);
    localStorage.setItem('boughtProducts', JSON.stringify(boughtProducts));
  }

  public getAll(list: string): Observable<Item[]> {
    const products = JSON.parse(localStorage.getItem(list) || '[]');
    return of(products);
  }

  public getOne(id: number): Observable<Item> {
    let products: any[] = [];
    this.getAll('products').subscribe((product) => (products = product));
    const product = products.find((p) => p.id === id);
    return of(product);
  }

  public update(product: Item) {
    let products: any[] = [];
    this.getAll('products').subscribe((product) => (products = product));
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
      localStorage.setItem('products', JSON.stringify(products));
    }
  }

  public remove(id: number) {
    let products: any[] = [];
    this.getAll('products').subscribe((product) => (products = product));
    const index = products.findIndex((p) => p.id === id);
    if (index >= 0) {
      products.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(products));
    }
  }

  public clearData(key: string) {
    localStorage.removeItem(key);
  }
}
