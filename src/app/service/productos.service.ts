import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';
import { environment } from 'src/environments/environment';
import { ITableState, TableResponseModel, TableService } from '../_metronic/shared/crud-table';
import { baseFilter } from '../_fake/fake-helpers/http-extenstions';

@Injectable({
    providedIn: 'root'
})
export class ProductoService extends TableService<Producto> implements OnDestroy {

    API_URL = `${environment.apiUrl}/productos`;
    public idEmpresa: number;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    find(tableState: ITableState): Observable<TableResponseModel<Producto>> {
        return this.http.get<Producto[]>(`${this.API_URL}/empresa/${this.idEmpresa}`).pipe(
            map((response: Producto[]) => {
                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<Producto> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    public listaNameAndId(id: number): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.API_URL + `/empresa/only_name_and_id/${id}`);
    }

    public detail(id: number): Observable<Producto> {
        return this.http.get<Producto>(this.API_URL + `/detail/${id}`);
    }

    public saveProducto(producto: FormData): Observable<any> {
        return this.http.post<any>(this.API_URL + '/create', producto);
    }

    public updateProducto(producto: FormData): Observable<any> {
        return this.http.put<any>(this.API_URL + `/update/${producto.get('idProducto')}`, producto);
    }

    public changeActivo(lista: any[]): Observable<any> {
        return this.http.put<any>(this.API_URL + "/change_availability", lista);
    }
}