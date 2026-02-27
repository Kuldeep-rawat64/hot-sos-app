import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Guest {
  id: number;
  name: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'in-house' | 'arriving' | 'departing';
  statusLabel: string;
  vip: boolean;
  vipLevel: number;
  group: string;
  adults: number;
  children: number;
  transfers: number;
}

@Injectable({ providedIn: 'root' })
export class GuestsService {
  private url = 'assets/mock/guests.json';
  private _guests$ = new BehaviorSubject<Guest[]>([]);
  guests$ = this._guests$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<Guest[]> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return of(this._guests$.value);
    return this.http.get<{ guests: Guest[] }>(this.url).pipe(
      map((r) => r.guests),
      tap((list) => this._guests$.next(list)),
      catchError(() => of(this._guests$.value)),
    );
  }

  search(query: string): Guest[] {
    const q = query.toLowerCase().trim();
    if (!q) return this._guests$.value;
    return this._guests$.value.filter(
      (g) => g.name.toLowerCase().includes(q) || g.room.includes(q),
    );
  }

  sortByName(guests: Guest[]): Guest[] {
    return [...guests].sort((a, b) => a.name.localeCompare(b.name));
  }

  filterByStatus(guests: Guest[], status: string): Guest[] {
    if (status === 'all') return guests;
    return guests.filter((g) => g.status === status);
  }

  get snapshot(): Guest[] {
    return this._guests$.value;
  }
}
