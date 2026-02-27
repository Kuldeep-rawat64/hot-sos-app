import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ServiceOrderGuest {
  name: string;
  vipLevel: number;
}

export interface ServiceOrder {
  id: number;
  title: string;
  subtitle: string;
  orderType: string;
  room: string;
  assignee: string | null;
  isAssigned: boolean;
  priority: string; // "P1" | "P2" | "P3"
  priorityLevel: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'completed';
  isEscalated: boolean;
  startedAt: string | null;
  timeAgo: string;
  attachments: number;
  hasCopy: boolean;
  actionType: 'play' | 'bell' | 'remove';
  guest: ServiceOrderGuest | null;
}

@Component({
  selector: 'app-service-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './service-orders.html',
  styleUrls: ['./service-orders.scss'],
})
export class ServiceOrders implements OnInit {
  private _orders$ = new BehaviorSubject<ServiceOrder[]>([]);
  private filter$ = new BehaviorSubject<string>('all');
  private sort$ = new BehaviorSubject<string>('priority');

  displayedOrders$!: Observable<ServiceOrder[]>;
  totalCount$!: Observable<number>;

  isLoading = true;
  isOffline = false;

  readonly filters = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'completed' },
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    this.displayedOrders$ = combineLatest([this._orders$, this.filter$]).pipe(
      map(([orders, filter]) =>
        filter === 'all' ? orders : orders.filter((o) => o.status === filter),
      ),
    );
    this.totalCount$ = this._orders$.pipe(map((o) => o.length));

    if (typeof navigator === 'undefined' || navigator.onLine) {
      this.http
        .get<{ serviceOrders: ServiceOrder[] }>('assets/mock/service-orders.json')
        .pipe(
          map((r) => r.serviceOrders),
          tap((list) => this._orders$.next(list)),
          catchError(() => of([] as ServiceOrder[])),
        )
        .subscribe(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
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
    return this.sort$.getValue() === 'priority' ? 'Sort by Priority' : 'Sort by Time';
  }

  toggleSort(): void {
    this.sort$.next(this.sort$.getValue() === 'priority' ? 'time' : 'priority');
  }

  actionIcon(type: string): string {
    switch (type) {
      case 'play':
        return 'play_circle';
      case 'bell':
        return 'notifications';
      case 'remove':
        return 'remove_circle';
      default:
        return 'radio_button_unchecked';
    }
  }

  actionClass(type: string): string {
    switch (type) {
      case 'play':
        return 'action-btn--green';
      case 'bell':
        return 'action-btn--navy';
      case 'remove':
        return 'action-btn--maroon';
      default:
        return '';
    }
  }

  orderTypeIcon(type: string): string {
    switch (type) {
      case 'Inspection':
        return 'manage_search';
      case 'Delivery Order':
        return 'local_shipping';
      default:
        return 'build';
    }
  }
}
