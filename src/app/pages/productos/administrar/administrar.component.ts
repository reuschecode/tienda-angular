// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductoService } from 'src/app/service/productos.service';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table'
import { Usuario } from 'src/app/models/usuario';
import { TokenService } from 'src/app/modules/auth/_services/token.service';
import { EditProductoModalComponent } from '../edit-producto-modal/edit-producto-modal.component';
import { EliminarProductoModalComponent } from '../eliminar-producto-modal/eliminar-producto-modal.component';
import { CambiarActivoProductoModalComponent } from '../cambiar-activo-producto-modal/cambiar-activo-producto-modal.component';
import { Producto } from 'src/app/models/producto';
import { MarcasProductosService } from 'src/app/service/marcas-productos.service';
import { TiposProductosService } from 'src/app/service/tipos-productos.service';
import { SubtipoProducto } from 'src/app/models/subtipo-producto';
import { TipoProducto } from 'src/app/models/tipo-producto';
import { CrearTipoSubtipoProductoModalComponent } from '../crear-tipo-subtipo-producto-modal/crear-tipo-subtipo-producto-modal.component';
import { CrearMarcaProductoModalComponent } from '../crear-marca-producto-modal/crear-marca-producto-modal.component';
@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.scss'],
})
export class AdministrarComponent
  implements
  OnInit,
  OnDestroy,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private user: Usuario;
  public subtipoProducto: SubtipoProducto[] = [];
  public productosSeleccionados: Set<Producto> = new Set<Producto>();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public productoService: ProductoService,
    public marcasProductosService: MarcasProductosService,
    public tiposProductosService: TiposProductosService,
    private tokenService: TokenService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.filterForm();
    this.searchForm();
    this.productoService.idEmpresa = this.user.tienda.empresa.idEmpresa;
    this.marcasProductosService.idEmpresa = this.user.tienda.empresa.idEmpresa;
    this.tiposProductosService.idEmpresa = this.user.tienda.empresa.idEmpresa;
    this.marcasProductosService.fetch();
    this.tiposProductosService.fetch();
    this.productoService.fetch();
    this.grouping = this.productoService.grouping;
    this.paginator = this.productoService.paginator;
    this.sorting = this.productoService.sorting;
    const sb = this.productoService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      tipoProducto: [''],
      subtipoProducto: [''],
      marcaProducto: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.tipoProducto.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.subtipoProducto.valueChanges.subscribe(() => this.filter())
    );
    this.subscriptions.push(
      this.filterGroup.controls.marcaProducto.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const subtipoProducto = this.filterGroup.get('subtipoProducto').value;
    if (subtipoProducto) {
      filter['subtipoProducto'] = subtipoProducto;
    }

    const marcaProducto = this.filterGroup.get('marcaProducto').value;
    if (marcaProducto) {
      filter['marcaProducto'] = marcaProducto;
    }
    this.productoService.patchStateWithoutFetch({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.productoService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.productoService.patchStateWithoutFetch({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.productoService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  createTipoSubtipo() {
    const modalRef = this.modalService.open(CrearTipoSubtipoProductoModalComponent, { size: 'lg' });
    this.tiposProductosService.items$.subscribe(val => modalRef.componentInstance.tiposInput = val);
    modalRef.result.then(() => {
      this.tiposProductosService.fetch();
    },
      () => {
        this.tiposProductosService.fetch();
      }
    );
  }

  createMarca() {
    const modalRef = this.modalService.open(CrearMarcaProductoModalComponent, { size: 'lg' });
    this.marcasProductosService.items$.subscribe(val => modalRef.componentInstance.marcasInput = val);
    modalRef.result.then(() => {
      this.marcasProductosService.fetch();
    },
      () => {
        this.marcasProductosService.fetch();
      }
    );
  }

  edit(producto: Producto) {
    const modalRef = this.modalService.open(EditProductoModalComponent, { size: 'xl' });
    modalRef.componentInstance.productoInput = producto;
    this.marcasProductosService.items$.subscribe(val => modalRef.componentInstance.marcasInput = val);
    this.tiposProductosService.items$.subscribe(val => modalRef.componentInstance.tiposInput = val);
    modalRef.result.then(() => {
      this.productoService.fetch();
      this.limpiarProductosSeleccionados();
    },
      () => { }
    );
  }

  delete(producto: Producto) {
    const modalRef = this.modalService.open(EliminarProductoModalComponent);
    modalRef.componentInstance.productoInput = producto;
    modalRef.result.then(() => {
      this.productoService.fetch();
      this.limpiarProductosSeleccionados();
    }, () => { });
  }


  deshabilitarSeleccionados() {
    const modalRef = this.modalService.open(CambiarActivoProductoModalComponent);
    modalRef.componentInstance.productos = this.getProductosSeleccionados();
    modalRef.componentInstance.estado = true;
    modalRef.result.then(() => {
      this.productoService.fetch();
      this.limpiarProductosSeleccionados();
    },
      () => { }
    );
  }

  habilitarSeleccionados() {
    const modalRef = this.modalService.open(CambiarActivoProductoModalComponent);
    modalRef.componentInstance.productos = this.getProductosSeleccionados();
    modalRef.componentInstance.estado = false;
    modalRef.result.then(() => {
      this.productoService.fetch();
      this.limpiarProductosSeleccionados();
    },
      () => { }
    );
  }

  selectedOption(tipoProducto) {
    this.subtipoProducto = tipoProducto.subtipoProductos;
  }

  seleccionarProducto(producto: Producto) {
    if (this.productosSeleccionados.has(producto)) {
      this.productosSeleccionados.delete(producto);
    } else {
      this.productosSeleccionados.add(producto);
    }
  }

  seleccionarTodos() {
    let productosPagina = 0;
    this.productoService.items$.subscribe(val => productosPagina = val.length);
    const areAllSelected = this.productosSeleccionados.size === productosPagina;
    if (areAllSelected) {
      this.limpiarProductosSeleccionados();
    }
    else {
      this.limpiarProductosSeleccionados();
      this.productoService.items$.subscribe(productos => productos.forEach(producto => this.productosSeleccionados.add(producto)));
    }
  }

  estaSeleccionado(producto: Producto): boolean {
    return this.productosSeleccionados.has(producto);
  }

  getProductosSeleccionados(): Producto[] {
    return Array.from(this.productosSeleccionados);
  }

  getProductosSeleccionadosCount(): number {
    return this.productosSeleccionados.size;
  }

  limpiarProductosSeleccionados() {
    this.productosSeleccionados = new Set<Producto>();
  }
}
