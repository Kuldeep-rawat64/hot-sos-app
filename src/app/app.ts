import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PinLogin } from './features/auth/pin-login/pin-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PinLogin],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('hot-sos-app');
}
