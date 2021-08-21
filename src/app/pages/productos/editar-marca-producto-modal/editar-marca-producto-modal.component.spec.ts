import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMarcaProductoModalComponent } from './editar-marca-producto-modal.component';

describe('EditarMarcaProductoModalComponent', () => {
  let component: EditarMarcaProductoModalComponent;
  let fixture: ComponentFixture<EditarMarcaProductoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarMarcaProductoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMarcaProductoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
