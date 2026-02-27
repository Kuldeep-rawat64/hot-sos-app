import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentsService, Assignment } from './assignments.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-housekeeping',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './housekeeping.html',
  styleUrls: ['./housekeeping.scss'],
})
export class Housekeeping implements OnInit {
  assignments: Assignment[] = [];
  private filter$ = new BehaviorSubject<string>('all');
  private sort$ = new BehaviorSubject<string>('priority');
  displayedAssignments$!: Observable<Assignment[]>;
  totalCount$!: Observable<number>;
  isOffline = false;
  isLoading = true;
  showSearch = false;

  readonly filters = [
    { label: 'All', value: 'all' },
    { label: 'Dirty', value: 'dirty' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Clean', value: 'clean' },
    { label: 'Inspected', value: 'inspected' },
  ];

  constructor(
    private assignmentsService: AssignmentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    this.assignmentsService.load().subscribe((list) => {
      this.assignments = list;
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    this.displayedAssignments$ = combineLatest([
      this.assignmentsService.assignments$,
      this.filter$,
      this.sort$,
    ]).pipe(
      map(([list, filter, sort]) => {
        let result = filter === 'all' ? list : list.filter((a) => a.status === filter);
        if (sort === 'priority') {
          const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
          result = [...result].sort((a, b) => order[a.priority] - order[b.priority]);
        }
        return result;
      }),
    );

    this.totalCount$ = this.assignmentsService.assignments$.pipe(map((l) => l.length));
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
    return this.sort$.getValue() === 'priority' ? 'Sort by Priority' : 'Sort by Room';
  }

  toggleSort(): void {
    this.sort$.next(this.sort$.getValue() === 'priority' ? 'room' : 'priority');
  }

  statusActionIcon(status: string): string {
    switch (status) {
      case 'in-progress':
        return 'play_circle';
      case 'dirty':
        return 'cleaning_services';
      case 'clean':
        return 'check_circle';
      case 'inspected':
        return 'verified';
      default:
        return 'radio_button_unchecked';
    }
  }

  statusActionClass(status: string): string {
    switch (status) {
      case 'in-progress':
        return 'action-btn--green';
      case 'dirty':
        return 'action-btn--navy';
      case 'clean':
        return 'action-btn--blue';
      case 'inspected':
        return 'action-btn--purple';
      default:
        return '';
    }
  }

  statusClass(status: string): string {
    return `badge--${status}`;
  }

  priorityClass(priority: string): string {
    return `card--${priority}`;
  }
}
