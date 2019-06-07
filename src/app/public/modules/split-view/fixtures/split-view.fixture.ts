import {
  Component
} from '@angular/core';

@Component({
  selector: 'split-view-fixture',
  templateUrl: './split-view.fixture.html'
})
export class SplitViewFixtureComponent {

  public listWidth: number;

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' }
  ];

}
