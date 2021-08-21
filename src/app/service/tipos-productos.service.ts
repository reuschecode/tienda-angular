import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ITableState, TableResponseModel, TableService } from '../_metronic/shared/crud-table';
import { baseFilter } from '../_fake/fake-helpers/http-extenstions';
import { TipoProducto } from '../models/tipo-producto';

@Injectable({
    providedIn: 'root'
})
export class TiposProductosService extends TableService<TipoProducto> implements OnDestroy {

    API_URL = `${environment.apiUrl}/tipos`;
    public idEmpresa: number;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    find(tableState: ITableState): Observable<TableResponseModel<TipoProducto>> {
        return this.http.get<TipoProducto[]>(`${this.API_URL}/empresa/${this.idEmpresa}`).pipe(
            map((response: TipoProducto[]) => {
                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<TipoProducto> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    public saveTipo(tipo: TipoProducto): Observable<any> {
        return this.http.post<TipoProducto>(this.API_URL + '/create', tipo);
    }

    public updateSubtipo(tipo: any, id: number): Observable<any> {
        return this.http.put<any>(this.API_URL + `/update/${id}`, tipo);
    }
}