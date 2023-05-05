import { Component, Input } from '@angular/core';
import { Item } from '../../models/item';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemsService.getOne(id).subscribe((product) => (this.item = product));
  }

  goBack(): void {
    this.location.back();
  }

  @Input() item?: Item;
}
