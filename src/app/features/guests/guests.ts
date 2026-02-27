import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestsService, Guest } from './guests.service';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './guests.html',
  styleUrls: ['./guests.scss'],
})
export class Guests implements OnInit {
  private filter$ = new BehaviorSubject<string>('all');
  private sort$ = new BehaviorSubject<string>('name');

  displayedGuests$!: Observable<Guest[]>;
  totalCount$!: Observable<number>;

  isLoading = true;
  isOffline = false;

  readonly filters = [
    { label: 'All', value: 'all' },
    { label: 'In-House', value: 'in-house' },
    { label: 'Arriving', value: 'arriving' },
    { label: 'Departing', value: 'departing' },
  ];

  constructor(
    private guestsService: GuestsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    this.displayedGuests$ = combineLatest([this.guestsService.guests$, this.filter$]).pipe(
      map(([guests, filter]) =>
        filter === 'all' ? guests : guests.filter((g) => g.status === filter),
      ),
      map((guests) => [...guests].sort((a, b) => a.name.localeCompare(b.name))),
    );
    this.totalCount$ = this.guestsService.guests$.pipe(map((g) => g.length));

    this.guestsService.load().subscribe(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  setFilter(value: string): void {
    this.filter$.next(value);
  }

  get activeFilter(): string {
    return this.filter$.getValue();
  }

  get activeFilterCount(): number {
    return this.filter$.getValue() !== 'all' ? 1 : 0;
  }

  get sortLabel(): string {
    return 'Sort by Guest Name';
  }

  statusIcon(status: string): string {
    switch (status) {
      case 'in-house':
        return 'home';
      case 'arriving':
        return 'arrow_circle_right';
      case 'departing':
        return 'arrow_circle_left';
      default:
        return 'radio_button_unchecked';
    }
  }
}
