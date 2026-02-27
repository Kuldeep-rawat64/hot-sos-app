import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface AssignmentGuest {
  name: string;
  vipLevel: number;
  period: string;
  checkedOut: boolean;
}

export interface Assignment {
  id: number;
  room: string;
  floor: string;
  type: string;
  status: 'dirty' | 'in-progress' | 'clean' | 'inspected';
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  checkOut: string;
  checkIn: string;
  notes: string;
  cleanType: string;
  points: number;
  duration: number;
  isRush: boolean;
  startedAt: string | null;
  guest: AssignmentGuest;
}

@Injectable({ providedIn: 'root' })
export class AssignmentsService {
  private url = 'assets/mock/assignments.json';
  private _assignments$ = new BehaviorSubject<Assignment[]>([]);
  assignments$ = this._assignments$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<Assignment[]> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return of(this._assignments$.value);
    }
    return this.http.get<{ assignments: Assignment[] }>(this.url).pipe(
      map((r) => r.assignments),
      tap((list) => this._assignments$.next(list)),
      catchError(() => of(this._assignments$.value)),
    );
  }

  filterByStatus(status: string): Assignment[] {
    const all = this._assignments$.value;
    return status === 'all' ? all : all.filter((a) => a.status === status);
  }

  filterByPriority(priority: string): Assignment[] {
    const all = this._assignments$.value;
    return priority === 'all' ? all : all.filter((a) => a.priority === priority);
  }
}
