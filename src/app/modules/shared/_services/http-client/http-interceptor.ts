import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClientService } from './http-client.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private httpService: HttpClientService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.shouldLog(request)) {
      const dataResponseRequest = {response: null, request: null}
      this.logRequest(request).subscribe((response: any) => {
        dataResponseRequest.request = response
        this.saveInformation(dataResponseRequest)
      }, (err) => { console.log(`err`, err) }
      );
      return next.handle(request).pipe(
        tap(
          (event: any) => {
            const formatResponse = this.formatLogResponseData(event)
            dataResponseRequest.response = formatResponse
            this.saveInformation(dataResponseRequest)
            // this.logResponse(request, response, event)
          }
          ,  (error) => {            
            const formatResponse = this.formatLogErrorResponseData(error)
            dataResponseRequest.response = formatResponse           
            this.saveInformation(dataResponseRequest)
          }
        )
      );      
    } else {
      return next.handle(request);
    }
  }

  private shouldLog(request: HttpRequest<any>): boolean {
    return !environment.log_urls_exclude.includes(request.url) && environment.http_interceptors.includes(request.method);
  }

  private saveInformation(dataResponseRequest)
  {
    if (dataResponseRequest.request != null && dataResponseRequest.response != null) 
    {
      this.logResponse(dataResponseRequest.request, dataResponseRequest.response)
    }
  }

  private logRequest(request: HttpRequest<any>): Observable<any> {
    const logData = {
      body: JSON.stringify(request.body),
      context: JSON.stringify(request.context),
      headers: JSON.stringify(request.headers),
      method: request.method,
      params: JSON.stringify(request.params),
      reportProgress: request.reportProgress,
      responseType: request.responseType,
      url: request.url,
      urlWithParams: request.urlWithParams,
      withCredentials: request.withCredentials,
    };
    return this.httpService.postLogRequestForm(logData);
  }

  private logResponse(request: any, response: any,
  ): void {
    if (request > 0 && response?.type != 0) {
      const logData = {
        idLogRequest: request, ...response
      };
      this.httpService.postLogResponseForm(logData).toPromise();
    }
  }

  private formatLogResponseData(event: any)
  {
    return {
        body: JSON.stringify(event.body),
        headers: JSON.stringify(event.headers),
        ok: event.ok,
        status: event.status,
        statusText: event.statusText,
        type: event.type,
        url: event.url,
    }
  }

  private formatLogErrorResponseData(error: any)
  {
    return {
      error: JSON.stringify(error.error),
      headers: JSON.stringify(error.headers),
      message: error.message,
      name: error.name,
      ok: error.ok,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
    }
  }

  private logErrorResponse(
    request: HttpRequest<any>,
    response: any,
    error: any
  ): void {
    if (response?.id > 0) {
      const logData = {
        idLogRequest: response.id,
        error: JSON.stringify(error.error),
        headers: JSON.stringify(error.headers),
        message: error.message,
        name: error.name,
        ok: error.ok,
        status: error.status,
        statusText: error.statusText,
        url: error.url,
      };
      this.httpService.postLogResponseForm(logData).toPromise();
    }
  }
}