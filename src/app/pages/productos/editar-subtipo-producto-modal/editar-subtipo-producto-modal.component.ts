import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubtipoProducto } from 'src/app/models/subtipo-producto';
import { TipoProducto } from 'src/app/models/tipo-producto';
import { Usuario } from 'src/app/models/usuario';
import { SubtiposProductosService } from 'src/app/service/subtipos-productos.service';

@Component({
  selector: 'app-editar-subtipo-producto-modal',
  templateUrl: './editar-subtipo-producto-modal.component.html',
  styles: [
  ]
})
export class EditarSubtipoProductoModalComponent implements OnInit {

  @Input() subtipoInput: SubtipoProducto;
  @Input() tipoNombre: string;
  @Input() tipoId: number;
  subtipoEditado: any = { nombre: "", idEmpresa: 0 };
  isLoading = false;
  subscriptions: Subscription[] = [];
  formGroupSubtipo: FormGroup;

  constructor(
    private subtipoProductoService: SubtiposProductosService, private toastr: ToastrService,
    private fb: FormBuilder, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.subtipoInput)
    this.isLoading = false;
    this.loadForm();
  }

  loadForm() {
    this.formGroupSubtipo = this.fb.group({
      nombreSubtipo: [this.subtipoInput.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
    })
  }

  editarSubtipoProducto(): void {
    this.prepareSubtipoEditado();
    const sbCreate = this.subtipoProductoService.updateSubtipo(this.subtipoEditado, this.subtipoInput.idSubtipoProducto).pipe(
      tap((res) => {
        this.toastr.success(res.message, "ÉXITO");
        this.modal.close();
        this.subtipoInput.nombre = this.subtipoEditado.nombre;
        return this.subtipoInput;
      }),
      catchError((errorMessage) => {
        this.toastr.error(errorMessage.error.message, "ERROR");
        return of(this.subtipoInput);
      }),
    ).subscribe((res: SubtipoProducto) => this.subtipoInput = res);
    this.subscriptions.push(sbCreate);
  }

  prepareSubtipoEditado() {
    const formData = this.formGroupSubtipo.value;
    this.subtipoEditado.nombre = formData.nombreSubtipo;
    this.subtipoEditado.idTipo = this.tipoId;
  }

  isControlValidSubtipo(controlName: string): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidSubtipo(controlName: string): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  controlHasErrorSubtipo(validation, controlName): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedSubtipo(controlName): boolean {
    const control = this.formGroupSubtipo.controls[controlName];
    return control.dirty || control.touched;
  }
}
