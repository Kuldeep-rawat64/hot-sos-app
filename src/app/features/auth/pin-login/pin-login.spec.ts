import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PinLogin } from './pin-login';
import { AuthService } from '../auth.service';
import { StorageService } from '../../../core/services/storage.service';

describe('PinLogin', () => {
  let component: PinLogin;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let storageServiceMock: { setToken: ReturnType<typeof vi.fn>; isLoggedIn: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };
    storageServiceMock = {
      setToken: vi.fn().mockResolvedValue(undefined),
      isLoggedIn: vi.fn().mockResolvedValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [PinLogin, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PinLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when PIN is empty', () => {
    expect(component.pinForm.valid).toBe(false);
  });

  it('should be invalid when PIN has less than 6 digits', () => {
    component.pinForm.controls['pin'].setValue('12345');
    expect(component.pinForm.valid).toBe(false);
  });

  it('should be valid when PIN has exactly 6 digits', () => {
    component.pinForm.controls['pin'].setValue('123456');
    expect(component.pinForm.valid).toBe(true);
  });

  it('should be invalid when PIN has more than 6 digits', () => {
    component.pinForm.controls['pin'].setValue('1234567');
    expect(component.pinForm.valid).toBe(false);
  });

  it('should append digit on keypress up to 6 digits', () => {
    ['1', '2', '3', '4', '5', '6', '7'].forEach((d) => component.onKeyPress(d));
    expect(component.enteredPin).toBe('123456'); // 7th digit ignored
  });

  it('should remove last digit on delete', () => {
    component.onKeyPress('1');
    component.onKeyPress('2');
    component.onDelete();
    expect(component.enteredPin).toBe('1');
  });

  it('should show error message on invalid PIN response', () => {
    authServiceMock.login.mockReturnValue(of({ success: false, error: 'invalid-pin' }));
    component.pinForm.controls['pin'].setValue('000000');
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid PIN. Please try again.');
  });

  it('should show offline message when network unavailable', () => {
    authServiceMock.login.mockReturnValue(of({ success: false, error: 'offline' }));
    component.pinForm.controls['pin'].setValue('123456');
    component.onSubmit();
    expect(component.errorMessage).toBe('No internet connection. Please try again.');
  });
});
