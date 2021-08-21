import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MarcaProducto } from 'src/app/models/marca-producto';
import { Producto } from 'src/app/models/producto';
import { SubtipoProducto } from 'src/app/models/subtipo-producto';
import { TipoProducto } from 'src/app/models/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { TokenService } from 'src/app/modules/auth/_services/token.service';
import { ProductoService } from 'src/app/service/productos.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

const PRODUCTO_VACIO = {
  id: undefined,
  idProducto: undefined,
  nombre: "",
  precio: 0,
  urlImagen: "",
  activo: true,
  empresa: null,
  subtipoProducto: null,
  marcaProducto: null
};

@Component({
  selector: 'app-edit-producto-modal',
  templateUrl: './edit-producto-modal.component.html',
  styleUrls: ['./edit-producto-modal.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditProductoModalComponent implements OnInit, OnDestroy {

  @Input() productoInput: Producto;
  @Input() marcasInput: MarcaProducto[];
  @Input() tiposInput: TipoProducto[];
  subtipos: SubtipoProducto[] = [];
  isLoading$;
  producto: Producto;
  formGroup: FormGroup;
  user: Usuario;
  imageUrl: string = "/assets/media/producto.jpg";
  file: File = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private productoService: ProductoService, private tokenService: TokenService,
    private fb: FormBuilder, public modal: NgbActiveModal, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.isLoading$ = this.productoService.isLoading$;
    this.loadProducto();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  handleFileInput(file: FileList) {
    this.file = file.item(0);

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.file);
  }

  loadProducto() {
    if (!this.productoInput) {
      this.producto = PRODUCTO_VACIO;
      this.producto.marcaProducto = { idMarcaProducto: 0, nombre: "" };
      this.producto.subtipoProducto = { idSubtipoProducto: 0, nombre: "", tipoProducto: { idTipoProducto: 0, nombre: "", subtipoProductos: [] } };
      this.producto.empresa = this.user.tienda.empresa;
      this.loadForm();
    } else {
      this.producto = this.productoInput;
      if (!this.producto.marcaProducto) this.producto.marcaProducto = { idMarcaProducto: 0, nombre: "" };
      if (!this.producto.subtipoProducto) this.producto.subtipoProducto = { idSubtipoProducto: 0, nombre: "", tipoProducto: { idTipoProducto: 0, nombre: "", subtipoProductos: [] } };
      if (this.producto.subtipoProducto) {
        for (let i = 0; i < this.tiposInput.length; i++) {
          if (this.tiposInput[i].idTipoProducto === this.producto.subtipoProducto.tipoProducto.idTipoProducto) {
            this.subtipos = this.tiposInput[i].subtipoProductos;
            break;
          }
        }
      }
      if (this.productoInput.urlImagen) this.imageUrl = "http://localhost:8080/images/" + this.productoInput.urlImagen;
      this.loadForm();
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      nombre: [this.producto.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      precio: [this.producto.precio, Validators.compose([Validators.required, Validators.min(0.01)])],
      subtipoProducto: [this.producto.subtipoProducto.idSubtipoProducto, Validators.compose([Validators.nullValidator])],
      marcaProducto: [this.producto.marcaProducto.idMarcaProducto, Validators.compose([Validators.nullValidator])],
      tipoProducto: [this.producto.subtipoProducto.tipoProducto.idTipoProducto, Validators.compose([Validators.nullValidator])]
    });
  }

  save() {
    this.prepareProducto();
    if (this.producto.idProducto) {
      this.edit();
    } else {
      this.create();
    }
  }

  private prepareProducto() {
    const formData = this.formGroup.value;
    this.producto.nombre = formData.nombre;
    this.producto.precio = formData.precio;
    this.producto.marcaProducto = { idMarcaProducto: formData.marcaProducto, nombre: "" };
    this.producto.subtipoProducto = { idSubtipoProducto: formData.subtipoProducto, nombre: "", tipoProducto: { idTipoProducto: formData.tipoProducto, nombre: "", subtipoProductos: [] } };
    this.producto.empresa = this.user.tienda.empresa;
  }

  edit() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('idProducto', this.producto.idProducto.toString());
    formData.append('nombre', this.producto.nombre);
    formData.append('precio', this.producto.precio.toString());
    formData.append('empresa', this.producto.empresa.idEmpresa.toString());
    if (this.producto.urlImagen) formData.append('urlImagen', this.producto.urlImagen);
    if (this.producto.subtipoProducto) formData.append('subtipoProducto', this.producto.subtipoProducto.idSubtipoProducto.toString());
    if (this.producto.marcaProducto) formData.append('marcaProducto', this.producto.marcaProducto.idMarcaProducto.toString());
    const sbUpdate = this.productoService.updateProducto(formData).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO")
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.producto);
      }),
    ).subscribe(res => this.producto = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('nombre', this.producto.nombre);
    formData.append('precio', this.producto.precio.toString());
    formData.append('empresa', this.producto.empresa.idEmpresa.toString());
    if (this.producto.subtipoProducto) formData.append('subtipoProducto', this.producto.subtipoProducto.idSubtipoProducto.toString());
    if (this.producto.marcaProducto) formData.append('marcaProducto', this.producto.marcaProducto.idMarcaProducto.toString());
    const sbCreate = this.productoService.saveProducto(formData).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO")
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.producto);
      }),
    ).subscribe((res: Producto) => this.producto = res);
    this.subscriptions.push(sbCreate);
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

  selectTipo(tipoId) {
    let tipo: TipoProducto;
    for (let i = 0; i < this.tiposInput.length; i++) {
      if (this.tiposInput[i].idTipoProducto === tipoId) {
        tipo = this.tiposInput[i];
        break;
      }
    }
    if (!tipo) tipo = { idTipoProducto: 0, nombre: "", subtipoProductos: [] }
    this.subtipos = tipo.subtipoProductos;
    if (tipo.subtipoProductos.length > 0) {
      let subtipoSeleccionado = tipo.subtipoProductos[0];
      let temp;
      for (let i = 0; i < tipo.subtipoProductos.length; i++) {
        temp = tipo.subtipoProductos[i];
        if (temp.idSubtipoProducto < subtipoSeleccionado.idSubtipoProducto) subtipoSeleccionado = temp;
      }
      this.producto.subtipoProducto = subtipoSeleccionado;
      this.formGroup.get("subtipoProducto").setValue(subtipoSeleccionado.idSubtipoProducto);
    }
    else {
      this.producto.subtipoProducto = { idSubtipoProducto: 0, nombre: "", tipoProducto: { idTipoProducto: 0, nombre: "", subtipoProductos: [] } }
      this.formGroup.get("subtipoProducto").setValue(0);
    }
  }
}
