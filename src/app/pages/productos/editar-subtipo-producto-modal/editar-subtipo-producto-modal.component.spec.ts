import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSubtipoProductoModalComponent } from './editar-subtipo-producto-modal.component';

describe('EditarSubtipoProductoModalComponent', () => {
  let component: EditarSubtipoProductoModalComponent;
  let fixture: ComponentFixture<EditarSubtipoProductoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSubtipoProductoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSubtipoProductoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
