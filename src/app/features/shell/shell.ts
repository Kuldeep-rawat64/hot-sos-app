import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MoreSheet } from './more-sheet/more-sheet';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss'],
})
export class Shell implements OnInit, OnDestroy {
  initials = 'JD';
  modeLabel = 'Supervisor';
  private routerSub?: Subscription;

  constructor(
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private storageService: StorageService,
  ) {}

  async ngOnInit(): Promise<void> {
    const name = await this.storageService.getName();
    if (name) {
      this.initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    this.updateModeLabel(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => this.updateModeLabel((e as NavigationEnd).urlAfterRedirects));
  }

  private updateModeLabel(url: string): void {
    if (url.includes('service-orders')) {
      this.modeLabel = 'List';
    } else if (url.includes('guests')) {
      this.modeLabel = 'Guests';
    } else {
      this.modeLabel = 'Supervisor';
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  openMore(): void {
    this.bottomSheet.open(MoreSheet);
  }

  openProfile(): void {
    this.router.navigate(['/shell/profile']);
  }
}
