import { Component, ViewChild } from '@angular/core';
import { Item } from '../../models/item';
import { ItemsService } from 'src/app/services/items.service';
import { MessageService } from '../../services/message.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent {
  items: Item[] = [];
  totalBoughtPrice!: number;

  displayedColumns: string[] = [
    'id',
    'name',
    'buyingPrice',
    'quantity',
    'totalPrice',
    'check',
    'edit',
    'delete',
  ];

  displayedColumnsSold: string[] = [
    'id',
    'name',
    'buyingPrice',
    'quantity',
    'totalPrice',
  ];

  dataSource!: MatTableDataSource<any>;
  boughtDataSource!: MatTableDataSource<any>;

  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(
    private localStorage: ItemsService,
    private messageService: MessageService,
    private modalService: MdbModalService
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => {
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.refreshProducts();
  }

  openModal(type: string) {
    this.modalRef = this.modalService.open(ModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: { myData: { mode: type } },
    });
  }

  refreshProducts(): void {
    this.dataSource = this.getItems('products');
    this.boughtDataSource = this.getItems('boughtProducts');
  }

  getItems(list: string): MatTableDataSource<any> {
    this.localStorage.getAll(list).subscribe((items) => (this.items = items));
    list === 'products'
      ? this.items.length > 0
        ? this.messageService.openSnackBar(
            'Products fetched successfully!',
            3000
          )
        : this.messageService.openSnackBar(
            'No products stored in local storage!',
            3000
          )
      : null;
    return new MatTableDataSource(this.calculateTotalPrice());
  }

  calculateTotalPrice(): Item[] {
    this.totalBoughtPrice = 0;
    const productsWithTotal = this.items.map((product) => {
      const totalPrice = product.quantity * product.buyingPrice;
      this.totalBoughtPrice += totalPrice;
      return { ...product, totalPrice };
    });
    return productsWithTotal;
  }

  addToBought(product: Item): void {
    this.localStorage.addToBoughtList(product);
    this.delete(product);
    this.refreshProducts();
  }

  delete(product: Item): void {
    this.localStorage.remove(product.id);
    this.refreshProducts();
  }

  clearList(key: string): void {
    this.localStorage.clearData(key);
    this.refreshProducts();
  }
}
