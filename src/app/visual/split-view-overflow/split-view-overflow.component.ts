import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-split-view-overflow',
  templateUrl: './split-view-overflow.component.html',
  styleUrls: ['./split-view-overflow.component.scss']
})
export class SplitViewOverflowComponent implements OnInit {

  public offsetTop: number;

  public items: any[] = [];

  constructor() {
    for (let i = 0; i < 100; i++) {
      this.items.push({
        name: `Person #${i}`
      });
    }
  }

  public ngOnInit(): void {

    // Note: The page would be responsible for any `top` calculations.
    this.offsetTop = document.querySelector('.sky-omnibar-iframe').getBoundingClientRect().height +
      document.getElementById('skypages-header').getBoundingClientRect().height;
  }

}
