import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ITableState, TableResponseModel, TableService } from '../_metronic/shared/crud-table';
import { baseFilter } from '../_fake/fake-helpers/http-extenstions';
import { MarcaProducto } from '../models/marca-producto';

@Injectable({
    providedIn: 'root'
})
export class MarcasProductosService extends TableService<MarcaProducto> implements OnDestroy {

    API_URL = `${environment.apiUrl}/marcas`;
    public idEmpresa: number;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    find(tableState: ITableState): Observable<TableResponseModel<MarcaProducto>> {
        return this.http.get<MarcaProducto[]>(`${this.API_URL}/empresa/${this.idEmpresa}`).pipe(
            map((response: MarcaProducto[]) => {
                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<MarcaProducto> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    public saveMarca(marca: any): Observable<any> {
        return this.http.post<any>(this.API_URL + '/create', marca);
    }

    public updateMarca(marca: any, id: number): Observable<any> {
        return this.http.put<any>(this.API_URL + `/update/${id}`, marca);
    }
}