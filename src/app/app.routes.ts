import { Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { TableDetailsComponent } from './components/table-details/table-details.component';

export const routes: Routes = [
    {
        path: 'users', component: TableComponent
    },
    {
        path: 'user/:id', loadComponent: () =>
            import('./components/table-details/table-details.component').then(
                (m) => m.TableDetailsComponent
            ),
    },
    {
        path: '**', redirectTo: 'users', pathMatch: 'full'
    }
];
