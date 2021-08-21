import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MarcaProducto } from 'src/app/models/marca-producto';
import { Usuario } from 'src/app/models/usuario';
import { TokenService } from 'src/app/modules/auth/_services/token.service';
import { MarcasProductosService } from 'src/app/service/marcas-productos.service';

@Component({
  selector: 'app-editar-marca-producto-modal',
  templateUrl: './editar-marca-producto-modal.component.html',
  styles: [
  ]
})
export class EditarMarcaProductoModalComponent implements OnInit {

  @Input() marcaInput: MarcaProducto;
  marcaEditado: any = { nombre: "", idEmpresa: 0 };
  isLoading = false;
  subscriptions: Subscription[] = [];
  user: Usuario;
  formGroup: FormGroup;

  constructor(
    private marcasProductosService: MarcasProductosService, private toastr: ToastrService, private tokenService: TokenService,
    private fb: FormBuilder, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.isLoading = false;
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      nombre: [this.marcaInput.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    });
  }

  editarMarca(): void {
    this.prepareMarcaEditado();
    const sbCreate = this.marcasProductosService.updateMarca(this.marcaEditado, this.marcaInput.idMarcaProducto).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.modal.close();
        this.marcaInput.nombre = this.marcaEditado.nombre;
        return this.marcaInput;
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.marcaInput);
      }),
    ).subscribe((res: MarcaProducto) => this.marcaInput = res);
    this.subscriptions.push(sbCreate);
  }

  prepareMarcaEditado() {
    const formData = this.formGroup.value;
    this.marcaEditado.nombre = formData.nombre;
    this.marcaEditado.idEmpresa = this.user.tienda.empresa.idEmpresa;
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

}
