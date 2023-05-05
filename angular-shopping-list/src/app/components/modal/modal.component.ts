import { Component, Inject, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/services/items.service';
import { Item } from 'src/app/models/item';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  item!: Item;
  myForm!: FormGroup;
  myData: any;
  showSuccessMessage = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MdbModalRef<ModalComponent>,
    private formBuilder: FormBuilder,
    private localStorage: ItemsService
  ) {
    this.myData = this.data;
  }

  ngOnInit(): void {
    if (this.myData.mode !== 'add') {
      this.localStorage
        .getOne(this.myData.mode)
        .subscribe((item) => (this.item = item));
    }

    this.myForm = this.formBuilder.group({
      name: [
        this.myData.mode === 'add' ? '' : this.item.name,
        [
          Validators.required,
          Validators.pattern('^[A-Za-z]{3,}$'),
          Validators.minLength(3),
        ],
      ],
      quantity: [
        this.myData.mode === 'add' ? null : this.item.quantity,
        [Validators.required, Validators.min(1)],
      ],
      price: [
        this.myData.mode === 'add' ? null : this.item.buyingPrice,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  get name() {
    return this.myForm.get('name');
  }

  get quantity() {
    return this.myForm.get('quantity');
  }

  get price() {
    return this.myForm.get('price');
  }

  onSubmit() {
    console.log(this.myData.mode);
    this.myData.mode === 'add'
      ? (this.localStorage.add({
          id: 0,
          name: this.myForm.value.name,
          quantity: this.myForm.value.quantity,
          buyingPrice: this.myForm.value.price,
        }),
        this.myForm.reset())
      : this.localStorage.update({
          id: this.myData.mode,
          name: this.myForm.value.name,
          quantity: this.myForm.value.quantity,
          buyingPrice: this.myForm.value.price,
        });

    this.showSuccessMessage = true;

    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}
