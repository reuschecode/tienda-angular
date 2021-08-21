import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-eliminar-producto-modal',
  templateUrl: './eliminar-producto-modal.component.html',
  styleUrls: ['./eliminar-producto-modal.component.scss']
})
export class EliminarProductoModalComponent implements OnInit {
  @Input() productoInput: Producto;
  isLoading = false;
  subscriptions: Subscription[] = [];
  productos: any[] = [];

  constructor(private productoService: ProductoService, public modal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  deshabilitarProducto() {
    this.isLoading = true;
    this.productos.push({ idProducto: this.productoInput.idProducto, activo: this.productoInput.activo });
    const sb = this.productoService.changeActivo(this.productos).pipe(
      tap((res) => {
        this.toastr.success(`Se ha actualizado el estado del producto "${this.productoInput.nombre}"`, "ÉXITO")
        this.modal.close()
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
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
