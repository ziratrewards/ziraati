import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-watch-color-page',
  templateUrl: './watch-color-page.html',
})
export class WatchColorPage {
  private router = inject(Router);

  colors = [
    { id: 'silver', name: 'Gümüş', color: 'bg-gray-300', image: '/watch_silver_1788624685857.jpg' },
    { id: 'black', name: 'Uzay Siyahı', color: 'bg-gray-800', image: '/watch_black_1788624709094.jpg' },
    { id: 'gold', name: 'Altın', color: 'bg-yellow-500', image: '/watch_gold_1788624728469.jpg' }
  ];

  selectedColor = this.colors[0];

  selectColor(color: any) {
    this.selectedColor = color;
  }

  continue() {
    this.router.navigate(['/customer-info']);
  }
}
