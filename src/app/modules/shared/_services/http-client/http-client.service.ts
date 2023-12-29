import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { IHttpClient } from './Ihttp-client';
import { DailyAttendanceEmployerDocument } from './types/DailyAttendanceEmployerDocument';
import { DailyAttendanceEmployerReferenceWitness } from './types/DailyAttendanceEmployerReferenceWitness';
import { DailyAttendanceEmployerReferencePersonal } from './types/DailyAttendanceEmployerReferencePersonal';
import { DailyAttendanceEmployerDocumentFile } from './types/DailyAttendanceEmployerDocumentFile';
import { AsistenciaDiaria, AsistenciaDiariaEmpleadorResponse } from './types/AsistenciaDiariaEmpleadorResponse';
import { DailyAttendanceEmployerFile } from './types/DailyAttendanceEmployerFile';
import { DailyAttendanceEmployerWorkContractResponse } from './types/DailyAttendanceEmployerWorkContractResponse';
import { ExpedientResponse } from './types/ExpedientResponse';
import { ExpedienteDemandanteResponse } from './types/ExpedienteDemandateResponse';
import { ExpedienteCierreArchivoResponse } from './types/ExpedientFileResponse';
import { NgForm } from '@angular/forms';
import { IAdvanceSearchProperties } from 'src/app/modules/avance-search/IAdvanceSearchProperties';
import { Rlt } from 'src/app/modules/auth/_models/rlt';
import { AsistenciaJudicialOrdenServicioSicit } from './types/AsistenciaJudicialOrdenServicioSicit';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService implements IHttpClient {
  private readonly url = environment.api_url;
  private readonly urlSirla = environment.sirla_Url;
  private headers: HttpHeaders;
  constructor(private _http: HttpClient) { }

  get<T>(route: string, options?: {}): Observable<T> {
    return this._http.get<T>(`${this.url}/${route}`, options);
  }
  getWithQuery<T>(route: string, params?: Partial<T>): Observable<T> {
    const _params: any = params
    let httpParams = new HttpParams();
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, _params[key]);
        }
      }
    }
    return this._http.get<T>(`${this.url}/${route}`, { params: httpParams });
  }
  getById<T>(route: string, id: number | string, options?: {}): Observable<T> {

    return this._http.get<T>(`${this.url}/${route}/${id}`, options);
  }

  post<T>(obj: object, route: string): Observable<T> {
    this.headers = new HttpHeaders()
      .set('Accept', 'text/html; charset=utf-8')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
    return this._http.post<T>(`${this.url}/${route}`, obj, { headers: this.headers });
  }

  getDailyAttendanceHistory(FromDate, ToDate, withAsistenciaJudicial, idRepLocalProvinciaCatalog?, userId?, idAbogado?) {
    let params = {};

    if (FromDate) {
      params['FromDate'] = FromDate;
    }

    if (ToDate) {
      params['ToDate'] = ToDate;
    }

    if (idRepLocalProvinciaCatalog) {
      params['idRepLocalProvinciaCatalog'] = idRepLocalProvinciaCatalog
    }

    if (userId) {
      params['userId'] = userId
    }

    if (idAbogado) {
      params['idAbogado'] = idAbogado
    }

    params['withAsistenciaJudicial'] = withAsistenciaJudicial;

    return this._http.get<AsistenciaDiaria[]>(this.url + '/AsistenciaDiaria', { params: params });
  }



  getAllAsistenciaJudicial(FromDate = null, ToDate = null, advanceSearch: IAdvanceSearchProperties = null) {
    let params = {};
    if (FromDate) {
      params['FromDate'] = FromDate;
    }
    if (ToDate) {
      params['ToDate'] = ToDate;
    }

    // Recorremos las propiedades de advanceSearch
    if (advanceSearch) {
      for (const property in advanceSearch) {
        if (advanceSearch[property]) {
          params[property] = advanceSearch[property];
        }
      }
    }


    return this._http.get(this.url + '/DailyAttendanceEmployer', { params: params });
  }

  getAllAuditoria(FromDate = null, ToDate = null, UserId = null, Entidad = null) {
    let params = {};
    if (FromDate) {
      params['FromDate'] = FromDate;
    }
    if (ToDate) {
      params['ToDate'] = ToDate;
    }
    if (UserId) {
      params['usuarioId'] = UserId;
    }
    if (Entidad) {
      params['tabla'] = Entidad;
    }
    return this._http.get(this.url + '/Auditoria', { params: params });
  }

  getAllLogRequest(FromDate = null, ToDate = null, UserId = null) {
    let params = {};
    if (FromDate) {
      params['FromDate'] = FromDate;
    }
    if (ToDate) {
      params['ToDate'] = ToDate;
    }
    if (UserId) {
      if (UserId != null)
      {
        params['usuarioId'] = UserId;
      }
    }
    return this._http.get(this.url + '/LogRequest', { params: params });
  }

  getAllAsistenciaJudicialByRlt(FromDate = null, ToDate = null, advanceSearch: IAdvanceSearchProperties = null, idRepLocalProvinciaCatalog?) {
    let params = {};
    if (FromDate) {
      params['FromDate'] = FromDate;
    }
    if (ToDate) {
      params['ToDate'] = ToDate;
    }


    // Recorremos las propiedades de advanceSearch
    if (advanceSearch) {
      for (const property in advanceSearch) {
        if (advanceSearch[property]) {
          params[property] = advanceSearch[property];
        }
      }
    }

    if (idRepLocalProvinciaCatalog) {
      params['idRepLocalProvinciaCatalog'] = idRepLocalProvinciaCatalog;
    }

    return this._http.get(this.url + '/DailyAttendanceEmployer', { params: params });
  }

  getAllExpedient(FromDate, ToDate, ID_AsistenciaDiariaRLT, advanceSearch: IAdvanceSearchProperties = null) {
    let params = {};
    if (FromDate) {
      params['FromDate'] = FromDate;
    }

    if (ToDate) {
      params['ToDate'] = ToDate;
    }

    if (ID_AsistenciaDiariaRLT) {
      params['ID_AsistenciaDiariaRLT'] = ID_AsistenciaDiariaRLT;
    }

    if (advanceSearch) {
      for (const property in advanceSearch) {
        if (advanceSearch[property]) {
          params[property] = advanceSearch[property];
        }
      }
    }

    return this._http.get(this.url + '/Expedient', { params: params });
  }

  getRecords(startDate: Date, endDate?: Date): Observable<any[]> {
    let params = {};

    if (endDate) {
      params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    } else {
      params = {
        startDate: startDate.toISOString()
      };
    }

    return this._http.get<any[]>(this.url + '/AsistenciaDiaria', { params });
  }

  postDailyAttendanceForm(formData: any) {
    if (formData.idAsistenciaDiaria > 0) {
      return this._http.put(`${this.url}` + '/AsistenciaDiaria', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiaria
      return this._http.post(`${this.url}` + '/AsistenciaDiaria', formData, { headers: this.headers });
    }
  }


  getDailyAttendanceById(id: number) {
    return this._http.get(this.url + '/AsistenciaDiaria/' + id);
  }
  getAsistenciaDiariaEmpleadorById(id: number) {
    return this._http.get<AsistenciaDiariaEmpleadorResponse>(this.url + '/DailyAttendanceEmployer/' + id);
  }
  getAsistenciaJudicialOrdenServicioSicitById(id: number) {
    return this._http.get<AsistenciaJudicialOrdenServicioSicit>(this.url + '/AsistenciaJudicialOrdenServicioSicit/' + id);
  }

  getLogRequestById(id: number) {
    return this._http.get<any>(this.url + '/LogRequest/' + id);
  }

  getLayerByRepresentativeLocal(id: any) {
    return this._http.get(this.url + '/UserLocalRepresentativeProvince?RepLocalProvinciaCatalogId=' + id);
  }

  getListRltByUserId(id: any) {

    return this._http.get<[{ localRepresentativeProvince: Rlt }]>(this.url + '/UserLocalRepresentativeProvince?usuarioId=' + id + '&activo=true');
  }

  deleteRltByUserId(id: any) {
    return this._http.delete(this.url + '/UserLocalRepresentativeProvince?usuarioId=' + id + '&activo=true');
  }

  getRlt() {
    return this._http.get(this.url + '/LocalRepresentativeProvince');
  }

  getRltById(id: number) {
    let params = new HttpParams().set('id', id);

    return this._http.get(this.url + '/LocalRepresentativeProvince/id', { params: params, headers: this.headers });
  }

  getUserLayerByRepresentativeLocal(id: any) {
    return this._http.get(this.url + '/UserLocalRepresentativeProvince/usuario?Id=' + id);
  }

  postUserRlt(params: any) {
    return this._http.post(this.url + '/UserLocalRepresentativeProvince', params, { headers: this.headers });
  }

  getAllUsers() { return this._http.get(this.url + '/User'); }

  getUserById(id: any) { return this._http.get(this.url + '/User/' + id) }

  updateUser(userId: any, formData: any) {
    return this._http.put(this.url + '/User', userId, formData);
  }

  updateUserStatus(userId: any, recordStatus: any) {
    return this._http.put(`${this.url}/User`, { userId: userId, recordStatus: recordStatus });
  }

  getAllLayers() { return this._http.get(this.url + '/UserLocalRepresentativeProvince'); }

  getDAE(form: NgForm) { return this._http.get(this.url + '/DailyAttendanceEmployer'); }

  getTypeOfIdentificationById(id: number) { return this._http.get(this.url + '/TypeOfIdentification/' + id); }

  update<T>(obj: object, route: string): Observable<T> {
    return this._http.put<T>(`${this.url}/${route}`, obj);
  }

  patch<T>(obj: any, route: string): Observable<any> {
    return this._http.patch<T>(`${this.url}/${route}`, obj);
  }

  delete<T>(id: number | string, route: string): Observable<any> {
    return this._http.delete<T>(`${this.url}/${route}/${id}`);
  }

  getListLayers() {
    return this.get<any[]>('User/UserByRol?rolId=6&status=true')
  }

  getListParalegal() {
    return this.get<any[]>('User/UserByRol?rolId=1&status=true')
  }

  //Employer Endpoints
  postEmpresaFormalizadaForm(formData: any) {
    if (formData.idEmpresa > 0) {
      return this._http.put(`${this.url}` + '/Company', formData, { headers: this.headers });
    } else {
      delete formData.idEmpresa
      return this._http.post(`${this.url}` + '/Company', formData, { headers: this.headers });
    }
  }
  postSituacionEconomicaForm(formData: any) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')

    return this._http.post(`${this.url}` + '/CompanyEconomicSituation', formData, { headers: this.headers });
  }

  postReferenceForm(formData: any) {
    if (formData.idReferencia > 0) {
      return this._http.put(`${this.url}` + '/Reference', formData, { headers: this.headers });
    } else {
      delete formData.idReferencia
      return this._http.post(`${this.url}` + '/Reference', formData, { headers: this.headers });
    }
  }

  postEmployerReferenceForm(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorReferenciaPersonal > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerReferencePersonal', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorReferenciaPersonal
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerReferencePersonal', formData, { headers: this.headers });
    }
  }

  postEmployerReferenceWitnessForm(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorReferenciaTestigo > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerReferenceWitness', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorReferenciaTestigo
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerReferenceWitness', formData, { headers: this.headers });
    }
  }
  postLogRequestForm(formData: any) {
    if (formData.id > 0) {
      return this._http.put(`${this.url}` + '/LogRequest', formData, { headers: this.headers });
    } else {
      delete formData.id
      return this._http.post(`${this.url}` + '/LogRequest', formData, { headers: this.headers });
    }
  }
  postLogResponseForm(formData: any) {
    if (formData.id > 0) {
      return this._http.put(`${this.url}` + '/LogResponse', formData, { headers: this.headers });
    } else {
      delete formData.id
      return this._http.post(`${this.url}` + '/LogResponse', formData, { headers: this.headers });
    }
  }

  deleteReferenceForm(id: number) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')

    return this._http.delete(`${this.url}` + '/Reference/' + id, { headers: this.headers });
  }

  deleteReferenceDailyAttendanceForm(id: number) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')

    return this._http.delete(`${this.url}` + '/DailyAttendanceEmployerReferencePersonal/' + id, { headers: this.headers });
  }

  postCompanyEconomicSocial(formData: any) {
    if (formData.idEmpresaSituacionEconomica > 0) {
      return this._http.put(`${this.url}` + '/CompanyEconomicSituation', formData, { headers: this.headers });
    } else {
      delete formData.idEmpresaSituacionEconomica
      return this._http.post(`${this.url}` + '/CompanyEconomicSituation', formData, { headers: this.headers });
    }
  }

  postDailyAttendanceEmployer(formData: any) {

    if (formData.idAsistenciaDiariaEmpleador > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployer', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleador
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployer', formData, { headers: this.headers });
    }
  }

  postDailyAttendanceEmployerNotification(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorNotificacion > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerNotification', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorNotificacion
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerNotification', formData, { headers: this.headers });
    }

  }

  postAsistenciaJudicialOrdenServicioSicit(formData: any) {
    if (formData.idAsistenciaJudicialOrdenServicioSicit > 0) {
      return this._http.put(`${this.url}` + '/AsistenciaJudicialOrdenServicioSicit', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaJudicialOrdenServicioSicit
      return this._http.post(`${this.url}` + '/AsistenciaJudicialOrdenServicioSicit', formData, { headers: this.headers });
    }
  }

  postFiles(formdata: any) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token)

    return this._http.post<any>(`${this.url}` + '/File/Upload/List', formdata, { headers: this.headers })
  }

  postFile(formdata: any) {
    return this._http.post<any>(`${this.url}` + '/File/Upload', formdata)
  }


  postDailyAttendanceEmployerNotificationFile(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorNotificacionArchivo > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerNotificationFile', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorNotificacionArchivo
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerNotificationFile', formData, { headers: this.headers });
    }
  }

  postExpedienteArchivosPrueba(formData: any) {

    if (formData.idExpedienteArchivosPrueba > 0) {
      return this._http.put(`${this.url}` + '/ExpedienteArchivosPrueba', formData, { headers: this.headers });
    } else {
      delete formData.idExpedienteArchivosPrueba
      return this._http.post(`${this.url}` + '/ExpedienteArchivosPrueba', formData, { headers: this.headers });
    }
  }
  postDailyAttendanceEmployeFile(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorArchivo > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerFile', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorArchivo
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerFile', formData, { headers: this.headers });
    }
  }

  postExpedientCierreArchivo(formData: any) {
    if (formData.idExpedienteCierreArchivo > 0) {
      return this._http.put(`${this.url}` + '/ExpedienteCierreArchivo', formData, { headers: this.headers });
    } else {
      delete formData.idExpedienteCierreArchivo
      return this._http.post(`${this.url}` + '/ExpedienteCierreArchivo', formData, { headers: this.headers });
    }
  }

  deleteFile(id: number | string) {
    return this._http.delete<any>(`${this.url}/File/${id}`);
  }
  getListDailyAttendanceEmployer(data): Promise<AsistenciaDiariaEmpleadorResponse[] | null> {
    return this.getWithQuery<AsistenciaDiariaEmpleadorResponse>('DailyAttendanceEmployer', data).toPromise().catch(x => null)
  }
  getListDailyAttendanceEmployerById(idAsistenciaDiariaEmpleador: string | number): Promise<AsistenciaDiariaEmpleadorResponse | null> {
    return this.getById<AsistenciaDiariaEmpleadorResponse>('DailyAttendanceEmployer', idAsistenciaDiariaEmpleador).toPromise().catch(x => null)
  }
  getFileById(idFile: string | number) {
    return this.getById('File', idFile).toPromise().catch(x => null)
  }
  getListEmployerDocumentsByEmployerId(idAsistenciaDiariaEmpleador: number): Promise<DailyAttendanceEmployerDocument[] | null> {
    return this.getWithQuery('DailyAttendanceEmployerDocument', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  getListEmployerDocumentsFileByEmployerId(idAsistenciaDiariaEmpleadorDocumento: number): Promise<DailyAttendanceEmployerDocumentFile[] | null> {
    return this.getWithQuery('DailyAttendanceEmployerDocumentFile', { idAsistenciaDiariaEmpleadorDocumento }).toPromise().catch(x => null)
  }

  getListReferenciaPersonalByEmployerId(idAsistenciaDiariaEmpleador: number): Promise<DailyAttendanceEmployerReferencePersonal[] | null> {
    return this.getWithQuery('DailyAttendanceEmployerReferencePersonal', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  getListTestigosByEmployerId(idAsistenciaDiariaEmpleador: number): Promise<DailyAttendanceEmployerReferenceWitness[] | null> {
    return this.getWithQuery('DailyAttendanceEmployerReferenceWitness', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  postEmployerDocument(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorDocumento > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerDocument', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorDocumento
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerDocument', formData, { headers: this.headers });
    }
  }

  postEmployerDocumentFile(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorDocumentoArchivo > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerDocumentFile', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorDocumentoArchivo
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerDocumentFile', formData, { headers: this.headers });
    }
  }
  getListDailyAttendanceEmployerFileByEmployerId(idAsistenciaDiariaEmpleador: number | string): Promise<DailyAttendanceEmployerFile[] | null> {
    return this.getWithQuery('DailyAttendanceEmployerFile', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  postDailyAttendanceEmployerWorkContract(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorContratoLaboral > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerWorkContract', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorContratoLaboral
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerWorkContract', formData, { headers: this.headers });
    }
  }

  postCausasDeLaterminacionDelContrato(formData: any) {
    if (formData.idAsistenciaJudicialCausaTerminacionContrato > 0) {
      return this._http.put(`${this.url}` + '/AsistenciaJudicialCausaTerminacionContrato', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaJudicialCausaTerminacionContrato
      return this._http.post(`${this.url}` + '/AsistenciaJudicialCausaTerminacionContrato', formData, { headers: this.headers });
    }
  }

  getListDailyAttendanceEmployerWorkContractEmployerById(idAsistenciaDiariaEmpleador: string | number): Promise<DailyAttendanceEmployerWorkContractResponse[] | null> {
    return this.getWithQuery('DailyAttendanceEmployerWorkContract', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  getCausasDeLaterminacionDeContrato(idAsistenciaDiariaEmpleador: string | number) {
    return this.getWithQuery('AsistenciaJudicialCausaTerminacionContrato', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  getAsistenciaJudicialOrdenServicioSicit(idAsistenciaDiariaEmpleador: string | number) {
    return this.getWithQuery('AsistenciaJudicialOrdenServicioSicit', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }

  postDailyAttendanceEmployerSalary(formData: any) {
    if (formData.idAsistenciaDiariaEmpleadorSalario > 0) {
      return this._http.put(`${this.url}` + '/DailyAttendanceEmployerSalary', formData, { headers: this.headers });
    } else {
      delete formData.idAsistenciaDiariaEmpleadorSalario
      return this._http.post(`${this.url}` + '/DailyAttendanceEmployerSalary', formData, { headers: this.headers });
    }
  }

  getListDailyAttendanceEmployerSalaryEmployerById(idAsistenciaDiariaEmpleador: string | number) {
    return this.getWithQuery('DailyAttendanceEmployerSalary', { idAsistenciaDiariaEmpleador }).toPromise().catch(x => null)
  }


  async getDailyAttendanceEmployerNotifications(idAsistenciaDiariaEmpleador) {
    return await this.getWithQuery(
      `DailyAttendanceEmployerNotification`,
      {
        idAsistenciaDiariaEmpleador,
      }
    )
      .toPromise()
      .catch((_x) => null);
  }

  postExpediente(formData: any) {
    if (formData.idExpediente > 0) {
      return this._http.put(`${this.url}` + '/Expedient', formData, { headers: this.headers });
    } else {
      delete formData.idExpediente
      return this._http.post(`${this.url}` + '/Expedient', formData, { headers: this.headers });
    }
  }


  async getExpedientById(idExpediente): Promise<ExpedientResponse> {
    return await this.get<ExpedientResponse>(
      `Expedient/${idExpediente}`
    ).toPromise().catch((_x) => null);
  }

  getRecordToReopenCase(idExpediente) {
    return this._http.get(`${this.url}` + `/Expedient/${idExpediente}`);
  }

  async getExpedientsByAsistenciaJudicial(idAsistenciaDiariaEmpleador): Promise<ExpedientResponse[]> {
    return await this.getWithQuery<ExpedientResponse>(
      `Expedient`,
      {
        idAsistenciaDiariaEmpleador,
      }
    )
      .toPromise()
      .catch((_x) => null);
  }

  postExpedienteDemandante(formData: any) {
    if (formData.idExpedienteDemandante > 0) {
      return this._http.put(`${this.url}` + '/ExpedienteDemandante', formData, { headers: this.headers });
    } else {
      delete formData.idExpedienteDemandante
      return this._http.post(`${this.url}` + '/ExpedienteDemandante', formData, { headers: this.headers });
    }
  }
  postExpedienteCierre(formData: any) {
    if (formData.idExpedienteCierre > 0) {
      return this._http.put(`${this.url}` + '/ExpedienteCierre', formData, { headers: this.headers });
    } else {
      delete formData.idExpedienteCierre
      return this._http.post(`${this.url}` + '/ExpedienteCierre', formData, { headers: this.headers });
    }
  }
  async getExpedienteDemandanteByExpedienteId(idExpediente): Promise<ExpedienteDemandanteResponse[]> {
    return await this.getWithQuery<ExpedienteDemandanteResponse>(
      `ExpedienteDemandante`,
      {
        idExpediente,
      }
    )
      .toPromise()
      .catch((_x) => null);
  }
  async getExpedientCierreArchivo(idExpediente): Promise<ExpedienteCierreArchivoResponse[]> {
    return await this.getWithQuery<ExpedienteCierreArchivoResponse>(
      `ExpedienteCierreArchivo`,
      {
        idExpedienteCierre: idExpediente,
      }
    )
      .toPromise()
      .catch((_x) => null);
  }



  getConsultaOrdenesSicit(OrdenServicioNumero: string) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams().set('OrdenServicioNumero', OrdenServicioNumero).set('OrdenServicioNumero', OrdenServicioNumero);

    return this._http.get(`${this.url}/ConsultaOrdenesSicit`, { params: params, headers: this.headers });
  }

  getExpedienteCierre(id: string) {
    return this.getById(`ExpedienteCierre`, id)
  }
  deleteExpedientCierreArchivo(id: number | string) {
    return this._http.delete<any>(`${this.url}/ExpedienteCierreArchivo/${id}`);
  }

  getFileAttached(id: number) {
    return this._http.get(this.url + '/File/' + id);
  }

  downloadAttachedFile(idArchivo?: number) {
    let params = new HttpParams().set('id', idArchivo);

    return this._http.get(this.url + '/File/Download', { params: params, responseType: 'blob' });
  }

  dowloadPDFEmpleador(codigo: string) {
    return this.get(`PdfReport/AsistenciaJudicialEmpleador/${codigo}`, { responseType: 'blob' })
  }

  dowloadPDFTrabajador(codigo: string) {
    return this.get(`PdfReport/AsistenciaJudicialTrabajador/${codigo}`, { responseType: 'blob' })
  }
  dowloadPDFExpediente(codigo: string) {
    return this.get(`PdfReport/Expediente/${codigo}`, { responseType: 'blob' })
  }
  downloadExcels(uri: string) {
    return this.get(`${uri}`, { responseType: 'blob' })
  }


  getNotasAsistenciaJudicial(idAsistenciaDiariaEmpleador) {
    return this.getWithQuery(
      `AsistenciaJudicialNota`,
      {
        idAsistenciaDiariaEmpleador,
      }
    )
  }

  getCitizens(tipoDocumento: string, documento: string) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams().set('tipoDocumento', tipoDocumento).set('documento', documento);

    return this._http.get(`${this.url}/Ciudadanos`, { params: params, headers: this.headers });
  }

  getCompanyDataBySIRLA(companyTradeName?: string, rnc?: string, rnl?: string) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams()

    if (companyTradeName) {
      params = params.set('nombreComercial', companyTradeName);
    }

    if (rnc) {
      params = params.set('rnc', rnc);
    }

    if (rnl) {
      params = params.set('rnl', rnl);
    }

    return this._http.get(`${this.url}/VMEmpresaEstablecimiento`, { params: params, headers: this.headers });
  }

  getSalaryElementDataBySIRLA(documentNumber: string, rnl: string) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams()

    if (documentNumber) {
      params = params.set('documentNumber', documentNumber);
    }

    if (rnl) {
      params = params.set('rnl', rnl);
    }

    return this._http.get(`${this.url}/VMEmpresaEstablecimiento`, { params: params, headers: this.headers });
  }


  // //url to get the data for SISCOR: https://mtimg.mt.gob.do/index.php?c=0-0000-00000"
  getDataFromSISCOR(mailNumber: string) {
    return this._http.get(this.url + '/siscor?codigo=' + mailNumber);
  }

  getDocumentType() {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    return this._http.get(`${this.url}/TypeOfIdentification`, { /*params: params,*/ headers: this.headers });
  }

  // Address
  getAllProvince(Parent?: number) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams()

    if (Parent) {
      params = params.set('Parent', Parent);
    }

    return this._http.get(`${this.url}/DivisionesTerritoriales/Provincia`, { params: params, headers: this.headers });
  }

  getAllMunicipalities(Parent?: number) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams()

    if (Parent) {
      params = params.set('Parent', Parent);
    }

    return this._http.get(`${this.url}/DivisionesTerritoriales/Municipio`, { params: params, headers: this.headers });
  }

  getAllDistricts(Parent?: number) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    let params = new HttpParams()

    if (Parent) {
      params = params.set('Parent', Parent);
    }
    
    return this._http.get(`${this.url}/DivisionesTerritoriales/DistritoMunicipal`, { params: params, headers: this.headers });
  }

  getAllMotivoReapertura() {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    return this._http.get(`${this.url}/MotivoReapertura`, { headers: this.headers });
  }

  reOpenCaseService(formData: any) {
    return this._http.put(`${this.url}/Expedient/ReaperturaExpediente`, formData, { headers: this.headers });
  }

  userData(id: any) {
    let token = localStorage.getItem('token');

    this.headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .set('Access-Control-Allow-Credentials', 'true')
      .set('Authorization', 'Bearer ' + token);

    return this._http.get('User/' + id, { headers: this.headers });
  }

  getAllRoles() {
    return this._http.get(`${this.url}/Role`, { headers: this.headers });
  }

  getRoleById(roleId: number) {
    return this._http.get(`${this.url}/Role/` + roleId, { headers: this.headers });
  }

  deleteMultipleRlt(usuarioRepLocalProvinciaCatalogId: any, UsuarioId: any, RepLocalProvinciaCatalogId: any) {
    return this._http.delete(`${this.url}/UserLocalRepresentativeProvince/${usuarioRepLocalProvinciaCatalogId}?UsuarioId=${UsuarioId}&RepLocalProvinciaCatalogId=${RepLocalProvinciaCatalogId}`, { headers: this.headers })
  }

  getSignedFileById(idFile: any) {
    return this._http.get(this.url + 'File/' + idFile);
  }

  getAllEconomicActivities() {
    return this._http.get(this.url + '/ActividadesEconomica');
  }

  getHistoricoExpediente(id: number) {
    // return this._http.get(this.url + '/HistoricoExpediente?IdExpediente=' + 32);
    return this._http.get(this.url + '/HistoricoExpediente?IdExpediente=' + id);
  }

  getLocalRepresentativeProvince() {
    return this._http.get(this.url + '/LocalRepresentativeProvince');
  }

  getNationalities() {
    return this._http.get(this.url + '/Nationality');
  }

  getPersonalReference(idAsistencia: number) {
    // return this._http.get(this.url + '/DailyAttendanceEmployerReferencePersonal/' + idAsistencia);
    return this._http.get(this.url + '/DailyAttendanceEmployerReferencePersonal?idAsistenciaDiariaEmpleador=' + idAsistencia);
  }

  getWitness(idAsistencia: number) {
    return this._http.get(this.url + '/DailyAttendanceEmployerReferenceWitness?idAsistenciaDiariaEmpleador=' + idAsistencia);
  }

  getContractElements(rnc: any, document: any) {
    let params = new HttpParams()

    if (rnc) { params = params.set('rnc', rnc); }
    if (document) { params = params.set('document', document); }


    return this._http.get(this.url + `/ElementosDelContrato?rnc=${rnc}&documento=${document}`);
  }
}
