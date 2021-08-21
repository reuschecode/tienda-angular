import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ITableState, TableResponseModel, TableService } from '../_metronic/shared/crud-table';
import { baseFilter } from '../_fake/fake-helpers/http-extenstions';
import { TipoProducto } from '../models/tipo-producto';
import { SubtipoProducto } from '../models/subtipo-producto';

@Injectable({
    providedIn: 'root'
})
export class SubtiposProductosService extends TableService<TipoProducto> implements OnDestroy {

    API_URL = `${environment.apiUrl}/subtipos`;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    public saveSubtipo(subtipo: SubtipoProducto): Observable<any> {
        return this.http.post<SubtipoProducto>(this.API_URL + '/create', subtipo);
    }

    public updateSubtipo(subtipo: SubtipoProducto, id: number): Observable<any> {
        return this.http.put<SubtipoProducto>(this.API_URL + `/update/${id}`, subtipo);
    }
}