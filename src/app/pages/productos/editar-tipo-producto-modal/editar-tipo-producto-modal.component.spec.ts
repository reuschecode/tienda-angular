import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoProductoModalComponent } from './editar-tipo-producto-modal.component';

describe('EditarTipoProductoModalComponent', () => {
  let component: EditarTipoProductoModalComponent;
  let fixture: ComponentFixture<EditarTipoProductoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarTipoProductoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTipoProductoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
