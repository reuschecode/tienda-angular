import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-cambiar-activo-producto-modal',
  templateUrl: './cambiar-activo-producto-modal.component.html',
  styleUrls: ['./cambiar-activo-producto-modal.component.scss']
})
export class CambiarActivoProductoModalComponent implements OnInit {

  @Input() productos: Producto[];
  @Input() estado: boolean;
  productosPorActualizar: any[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private productoService: ProductoService, public modal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log(this.estado);
    this.loadProductos();
  }

  loadProductos() {
    this.productos.forEach(producto => {
      this.productosPorActualizar.push({ idProducto: producto.idProducto, activo: this.estado })
    })
    console.log(this.productosPorActualizar);
  }

  actualizarEstadoProductos() {
    this.isLoading = true;
    const sb = this.productoService.changeActivo(this.productosPorActualizar).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.modal.close()
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message);
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
