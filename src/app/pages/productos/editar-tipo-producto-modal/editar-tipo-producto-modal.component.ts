import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TipoProducto } from 'src/app/models/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { TokenService } from 'src/app/modules/auth/_services/token.service';
import { TiposProductosService } from 'src/app/service/tipos-productos.service';

@Component({
  selector: 'app-editar-tipo-producto-modal',
  templateUrl: './editar-tipo-producto-modal.component.html',
  styles: [
  ]
})
export class EditarTipoProductoModalComponent implements OnInit {

  @Input() tipoInput: TipoProducto;
  tipoEditado: any = { nombre: "", idEmpresa: 0 };
  isLoading = false;
  subscriptions: Subscription[] = [];
  user: Usuario;
  formGroupTipo: FormGroup;

  constructor(
    private tipoProductoService: TiposProductosService, private toastr: ToastrService, private tokenService: TokenService,
    private fb: FormBuilder, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.isLoading = false;
    this.loadForm();
  }

  loadForm() {
    this.formGroupTipo = this.fb.group({
      nombreTipo: [this.tipoInput.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    });
  }

  editarTipoProducto(): void {
    this.prepareTipoEditado();
    const sbCreate = this.tipoProductoService.updateSubtipo(this.tipoEditado, this.tipoInput.idTipoProducto).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.modal.close();
        this.tipoInput.nombre = this.tipoEditado.nombre;
        return this.tipoInput;
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.tipoInput);
      }),
    ).subscribe((res: TipoProducto) => this.tipoInput = res);
    this.subscriptions.push(sbCreate);
  }

  prepareTipoEditado() {
    const formData = this.formGroupTipo.value;
    this.tipoEditado.nombre = formData.nombreTipo;
    this.tipoEditado.idEmpresa = this.user.tienda.empresa.idEmpresa;
  }

  isControlValidTipo(controlName: string): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidTipo(controlName: string): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  controlHasErrorTipo(validation, controlName): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedTipo(controlName): boolean {
    const control = this.formGroupTipo.controls[controlName];
    return control.dirty || control.touched;
  }
}
