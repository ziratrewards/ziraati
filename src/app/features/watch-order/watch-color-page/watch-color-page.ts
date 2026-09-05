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
    { id: 'model1', name: 'Gümüş', color: 'bg-gray-300', image: '/ziraati/watch4.jpeg' },
    { id: 'model2', name: 'Uzay Siyahı', color: 'bg-gray-800', image: '/ziraati/watch2.jpeg' },
    { id: 'model3', name: 'Altın', color: 'bg-yellow-500', image: '/ziraati/watch3.jpeg' },
    { id: 'model4', name: 'Titanyum', color: 'bg-slate-400', image: '/ziraati/watch5.jpeg' },
    { id: 'model5', name: 'Gece Mavisi', color: 'bg-blue-900', image: '/ziraati/watch1.jpeg' }
  ];

  selectedColor = this.colors[0];

  selectColor(color: any) {
    this.selectedColor = color;
  }

  continue() {
    this.router.navigate(['/customer-info']);
  }
}
