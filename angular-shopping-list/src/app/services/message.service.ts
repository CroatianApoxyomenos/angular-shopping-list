import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, time: number) {
    this.snackBar.open(message, undefined, { duration: time });
  }
}
