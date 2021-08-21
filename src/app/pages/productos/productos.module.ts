import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrarComponent } from './administrar/administrar.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductosRoutingModule } from './productos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductosComponent } from './productos.component';
import { EditProductoModalComponent } from './edit-producto-modal/edit-producto-modal.component';
import { EliminarProductoModalComponent } from './eliminar-producto-modal/eliminar-producto-modal.component';
import { CambiarActivoProductoModalComponent } from './cambiar-activo-producto-modal/cambiar-activo-producto-modal.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { CrearMarcaProductoModalComponent } from './crear-marca-producto-modal/crear-marca-producto-modal.component';
import { CrearTipoSubtipoProductoModalComponent } from './crear-tipo-subtipo-producto-modal/crear-tipo-subtipo-producto-modal.component';
import { EditarTipoProductoModalComponent } from './editar-tipo-producto-modal/editar-tipo-producto-modal.component';
import { EditarSubtipoProductoModalComponent } from './editar-subtipo-producto-modal/editar-subtipo-producto-modal.component';
import { EditarMarcaProductoModalComponent } from './editar-marca-producto-modal/editar-marca-producto-modal.component';

@NgModule({
  declarations: [
    AdministrarComponent,
    ProductosComponent,
    EditProductoModalComponent,
    EliminarProductoModalComponent,
    CambiarActivoProductoModalComponent,
    CrearMarcaProductoModalComponent,
    CrearTipoSubtipoProductoModalComponent,
    EditarTipoProductoModalComponent,
    EditarSubtipoProductoModalComponent,
    EditarMarcaProductoModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ProductosRoutingModule,
    FormsModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    InlineSVGModule
  ],
})
export class ProductosModule { }
