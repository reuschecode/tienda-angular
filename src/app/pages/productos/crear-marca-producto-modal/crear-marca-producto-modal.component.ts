import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MarcaProducto } from 'src/app/models/marca-producto';
import { Usuario } from 'src/app/models/usuario';
import { TokenService } from 'src/app/modules/auth/_services/token.service';
import { MarcasProductosService } from 'src/app/service/marcas-productos.service';
import { EditarMarcaProductoModalComponent } from '../editar-marca-producto-modal/editar-marca-producto-modal.component';

const MARCA_PRODUCTO_VACIO: MarcaProducto = {
  idMarcaProducto: 0,
  nombre: ""
}

@Component({
  selector: 'app-crear-marca-producto-modal',
  templateUrl: './crear-marca-producto-modal.component.html',
  styleUrls: ['./crear-marca-producto-modal.component.scss']
})
export class CrearMarcaProductoModalComponent implements OnInit {

  @Input() marcasInput: MarcaProducto[];
  marcaProducto: any = { idMarcaProducto: 0, nombre: "", idEmpresa: 0 };
  isLoading$;
  formGroup: FormGroup;
  user: Usuario;
  private subscriptions: Subscription[] = [];

  constructor(
    private marcaProductoService: MarcasProductosService, private tokenService: TokenService,
    private fb: FormBuilder, public modal: NgbActiveModal, private toastr: ToastrService, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.isLoading$ = this.marcaProductoService.isLoading$;
    this.loadMarca();
  }

  loadMarca() {
    this.marcaProducto = MARCA_PRODUCTO_VACIO;
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      nombre: [this.marcaProducto.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    });
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  saveMarca() {
    this.prepareMarca();
    const sbCreate = this.marcaProductoService.saveMarca(this.marcaProducto).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.marcasInput.push(this.marcaProducto);
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.marcaProducto);
      }),
    ).subscribe((res: MarcaProducto) => this.marcaProducto = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareMarca() {
    const formData = this.formGroup.value;
    this.marcaProducto.nombre = formData.nombre;
    this.marcaProducto.idEmpresa = this.user.tienda.empresa.idEmpresa;
  }

  editMarca(marca: MarcaProducto) {
    const modalRef = this.modalService.open(EditarMarcaProductoModalComponent);
    modalRef.componentInstance.marcaInput = marca;
    modalRef.result.then((res) => {
      console.log(res);
    },
      () => { }
    );
  }
}
