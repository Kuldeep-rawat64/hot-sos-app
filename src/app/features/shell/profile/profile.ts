import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../core/services/storage.service';

interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  badge?: number;
  danger?: boolean;
  action?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  userName = 'John Doe';
  initials = 'JD';
  dutyStatus = 'On Duty / Off Break';
  version = 'HotSOS 3.208.0';

  menuItems: MenuItem[] = [
    { icon: 'notifications', label: 'Notifications', badge: 3 },
    { icon: 'mail', label: 'Messages', badge: 1 },
    { icon: 'business', label: 'Change Unit', subtitle: 'Chrissanie Mountain Lodge' },
    { icon: 'translate', label: 'Change Language', subtitle: 'English' },
    { icon: 'key', label: 'Change Password' },
    { icon: 'help_outline', label: 'Help' },
    { icon: 'lightbulb_outline', label: 'Submit Feedback' },
    { icon: 'logout', label: 'Log Out', danger: true, action: 'logout' },
  ];

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const name = await this.storageService.getName();
    if (name) {
      this.userName = name;
      this.initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  }

  goBack(): void {
    this.router.navigate(['/shell']);
  }

  async onMenuItem(item: MenuItem): Promise<void> {
    if (item.action === 'logout') {
      await this.storageService.clear();
      this.router.navigate(['/login']);
    }
  }
}
