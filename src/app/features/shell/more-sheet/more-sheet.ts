import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';

export interface MoreMenuItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-more-sheet',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './more-sheet.html',
  styleUrls: ['./more-sheet.scss'],
})
export class MoreSheet {
  menuItems: MoreMenuItem[] = [
    { label: 'Amenities', icon: 'room_service' },
    { label: 'Meters', icon: 'bar_chart' },
    { label: 'Personnel', icon: 'groups' },
  ];

  constructor(private sheetRef: MatBottomSheetRef<MoreSheet>) {}

  onItemClick(item: MoreMenuItem): void {
    this.sheetRef.dismiss(item.label);
  }

  close(): void {
    this.sheetRef.dismiss();
  }
}
