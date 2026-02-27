import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GuestsService, Guest } from './guests.service';

const mockGuests: Guest[] = [
  {
    id: 1,
    name: 'Alice Smith',
    room: 'Suite 101',
    checkIn: '19 Sep 2025',
    checkOut: '20 Sep 2025',
    status: 'in-house',
    statusLabel: 'In House',
    vip: true,
    vipLevel: 1,
    group: 'AMA',
    adults: 1,
    children: 0,
    transfers: 0,
  },
  {
    id: 2,
    name: 'Bob Jones',
    room: 'Suite 202',
    checkIn: '19 Sep 2025',
    checkOut: '20 Sep 2025',
    status: 'arriving',
    statusLabel: 'Arriving',
    vip: false,
    vipLevel: 0,
    group: 'Lorem',
    adults: 0,
    children: 0,
    transfers: 0,
  },
  {
    id: 3,
    name: 'Carol White',
    room: 'Suite 303',
    checkIn: '19 Sep 2025',
    checkOut: '20 Sep 2025',
    status: 'in-house',
    statusLabel: 'In House',
    vip: false,
    vipLevel: 0,
    group: 'Ipsum',
    adults: 1,
    children: 0,
    transfers: 1,
  },
];

describe('GuestsService', () => {
  let service: GuestsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuestsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GuestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load guests from mock API', () => {
    service.load().subscribe((guests) => {
      expect(guests.length).toBe(3);
      expect(guests[0].name).toBe('Alice Smith');
    });

    const req = httpMock.expectOne('assets/mock/guests.json');
    req.flush({ guests: mockGuests });
  });

  it('should search guests by name (case-insensitive)', () => {
    // Seed internal state
    (service as any)._guests$.next(mockGuests);

    const result = service.search('alice');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Alice Smith');
  });

  it('should search guests by room number', () => {
    (service as any)._guests$.next(mockGuests);
    const result = service.search('202');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Bob Jones');
  });

  it('should return all guests when search query is empty', () => {
    (service as any)._guests$.next(mockGuests);
    const result = service.search('');
    expect(result.length).toBe(3);
  });

  it('should sort guests alphabetically by name', () => {
    const sorted = service.sortByName(mockGuests);
    expect(sorted[0].name).toBe('Alice Smith');
    expect(sorted[1].name).toBe('Bob Jones');
    expect(sorted[2].name).toBe('Carol White');
  });

  it('should filter guests by status "in-house"', () => {
    const result = service.filterByStatus(mockGuests, 'in-house');
    expect(result.length).toBe(2);
    expect(result.every((g) => g.status === 'in-house')).toBe(true);
  });

  it('should filter guests by status "arriving"', () => {
    const result = service.filterByStatus(mockGuests, 'arriving');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Bob Jones');
  });

  it('should return all guests when filter is "all"', () => {
    const result = service.filterByStatus(mockGuests, 'all');
    expect(result.length).toBe(3);
  });
});
