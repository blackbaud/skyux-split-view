import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplitViewWithRepeaterVisualComponent } from './visual/split-view/basic/split-view-visual.component';
import { SplitViewVisualComponent } from './visual/split-view/page-bound/split-view-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/visual',
  },
  {
    path: 'visual',
    component: VisualComponent,
  },
  {
    path: 'visual/split-view/basic',
    component: SplitViewWithRepeaterVisualComponent,
  },
  {
    path: 'visual/split-view/page-bound',
    component: SplitViewVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
