import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrarComponent } from './administrar/administrar.component';
import { ProductosComponent } from './productos.component';

const routes: Routes = [
    {
        path: '',
        component: ProductosComponent,
        children: [
            {
                path: 'administrar',
                component: AdministrarComponent,
            },
            { path: '', redirectTo: 'administrar', pathMatch: 'full' },
            { path: '**', redirectTo: 'administrar', pathMatch: 'full' },
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductosRoutingModule { }
