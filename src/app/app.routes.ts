import { Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { TableDetailsComponent } from './components/table-details/table-details.component';

export const routes: Routes = [
    {
        path: 'users', component: TableComponent
    },
    {
        path: 'user/:id', component: TableDetailsComponent
    },
    {
        path: '**', redirectTo: 'users', pathMatch: 'full'
    }
];
