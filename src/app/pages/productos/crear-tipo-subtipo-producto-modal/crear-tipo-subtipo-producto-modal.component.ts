import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubtipoProducto } from 'src/app/models/subtipo-producto';
import { TipoProducto } from 'src/app/models/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { TokenService } from 'src/app/modules/auth/_services/token.service';
import { SubtiposProductosService } from 'src/app/service/subtipos-productos.service';
import { TiposProductosService } from 'src/app/service/tipos-productos.service';
import { EditarSubtipoProductoModalComponent } from '../editar-subtipo-producto-modal/editar-subtipo-producto-modal.component';
import { EditarTipoProductoModalComponent } from '../editar-tipo-producto-modal/editar-tipo-producto-modal.component';

const TIPO_PRODUCTO_VACIO = {
  idTipoProducto: undefined,
  nombre: "",
  subtipoProductos: [],
};

const SUBTIPO_PRODUCTO_VACIO: SubtipoProducto = {
  idSubtipoProducto: 0,
  nombre: "",
  tipoProducto: null
}

@Component({
  selector: 'app-crear-tipo-subtipo-producto-modal',
  templateUrl: './crear-tipo-subtipo-producto-modal.component.html',
  styleUrls: ['./crear-tipo-subtipo-producto-modal.component.scss']
})
export class CrearTipoSubtipoProductoModalComponent implements OnInit {

  @Input() tiposInput: TipoProducto[];
  subtipos: SubtipoProducto[] = [];
  isLoading$;
  tipoProducto: any;
  subtipoProducto: any;
  formGroupTipo: FormGroup;
  formGroupSubtipo: FormGroup;
  user: Usuario;
  tipoId: number;
  subtipoNombre: string = "Ninguno";
  private subscriptions: Subscription[] = [];

  constructor(
    private tipoProductoService: TiposProductosService, private subtipoProductoService: SubtiposProductosService, private tokenService: TokenService,
    private fb: FormBuilder, public modal: NgbActiveModal, private toastr: ToastrService, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.isLoading$ = this.tipoProductoService.isLoading$;
    this.loadTipoYSubtipoProducto();
  }

  loadTipoYSubtipoProducto() {
    this.tipoProducto = TIPO_PRODUCTO_VACIO;
    this.subtipoProducto = SUBTIPO_PRODUCTO_VACIO;
    this.loadForm();
  }

  loadForm() {
    this.formGroupTipo = this.fb.group({
      nombreTipo: [this.tipoProducto.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    });
    this.formGroupSubtipo = this.fb.group({
      idTipo: [this.subtipoProducto.idSubtipoProducto, Validators.compose([Validators.required, Validators.pattern(/^-?(1|[1-9]\d*)?$/)])],
      nombreSubtipo: [this.subtipoProducto.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    })
  }

  isControlValidTipo(controlName: string): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlValidSubtipo(controlName: string): boolean {
    const control = this.formGroupSubtipo.controls[controlName];

    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidTipo(controlName: string): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isControlInvalidSubtipo(controlName: string): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorTipo(validation, controlName): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  controlHasErrorSubtipo(validation, controlName): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedTipo(controlName): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.dirty || control.touched;
  }

  isControlTouchedSubtipo(controlName): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.dirty || control.touched;
  }

  saveTipo() {
    this.prepareTipo();
    const sbCreate = this.tipoProductoService.saveTipo(this.tipoProducto).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.tiposInput.push(this.tipoProducto);
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.tipoProducto);
      }),
    ).subscribe((res: TipoProducto) => this.tipoProducto = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareTipo() {
    const formData = this.formGroupTipo.value;
    this.tipoProducto.nombre = formData.nombreTipo;
    this.tipoProducto.idEmpresa = this.user.tienda.empresa.idEmpresa;
  }

  saveSubtipo() {
    this.prepapreSubtipo();
    const sbCreate = this.subtipoProductoService.saveSubtipo(this.subtipoProducto).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.tiposInput[this.tipoId - 1].subtipoProductos.push(this.subtipoProducto);
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.subtipoProducto);
      }),
    ).subscribe((res: SubtipoProducto) => this.subtipoProducto = res);
    this.subscriptions.push(sbCreate);
  }

  private prepapreSubtipo() {
    const formData = this.formGroupSubtipo.value;
    this.subtipoProducto.nombre = formData.nombreSubtipo;
    this.subtipoProducto.idTipo = formData.idTipo;
    this.subtipoProducto.idEmpresa = this.user.tienda.empresa.idEmpresa;
  }

  onChange(tipo) {
    this.tipoId = tipo;
    for (let i = 0; i < this.tiposInput.length; i++) {
      if (this.tiposInput[i].idTipoProducto === tipo) {
        this.subtipos = this.tiposInput[i].subtipoProductos;
        this.subtipoNombre = this.tiposInput[i].nombre;
        break;
      }
    }
  }

  editTipo(tipo: TipoProducto) {
    const modalRef = this.modalService.open(EditarTipoProductoModalComponent);
    modalRef.componentInstance.tipoInput = tipo;
    modalRef.result.then((res) => {
      console.log(res);
    },
      () => { }
    );
  }

  editSubtipo(subtipo: SubtipoProducto) {
    const modalRef = this.modalService.open(EditarSubtipoProductoModalComponent);
    modalRef.componentInstance.subtipoInput = subtipo;
    modalRef.componentInstance.tipoNombre = this.subtipoNombre;
    modalRef.componentInstance.tipoId = this.tipoId;
    modalRef.result.then((res) => {
      console.log(res);
    },
      () => { }
    );
  }
}


