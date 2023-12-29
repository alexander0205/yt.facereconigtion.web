import { AsistenciaDiariaResponse } from "./AsistenciaDiariaResponse"
import { LocalRepresentativeProvince } from "./asistencia-diaria-entity"

export interface ExpedientResponse {
  idExpediente: number
  codigo: string
  fechaAlta: string
  fechaCierre: string
  fechaEjecucionCierre: string
  fechaUltimaAudiencia: string
  fechaProximaAudiencia: string
  noExpedienteExterno: string
  notas: string
  observaciones: string
  observacionesCierre: string
  activo: boolean
  localRepresentativeProvince: LocalRepresentativeProvince
  asistenciaDiariaEmpleador: AsistenciaDiariaResponse
  estado: Estado
  instanciaJudicial: InstanciaJudicial
  motivoDemanda: MotivoDemanda
  faseProceso: FaseProceso
  motivoCierre: MotivoCierre
  estadoManual: any
  idRepLocalProvinciaCatalog: number
  idAsistenciaDiariaEmpleador: number
  idEstado: number
  idInstanciaJudicial: number
  idMotivoDemanda: number
  idFaseProceso: number
  idMotivoCierre: number
  idEstadoManual: number
  expedienteCierre: any
  descripcionArchivosDePrueba: string;

  demandaCorrespondeFechasAnteriores: number
  fechaDemandaAnterior: any
}






export interface TipoCorrespondencia {
  id: number
  descripcion: string
  codigoReferencia: any
}

export interface Estado {
  id: number
  descripcion: string
  codigoReferencia: any
}

export interface InstanciaJudicial {
  id: number
  descripcion: string
  codigoReferencia: any
}

export interface MotivoDemanda {
  id: number
  descripcion: string
  codigoReferencia: any
}

export interface FaseProceso {
  id: number
  descripcion: string
  codigoReferencia: any
}

export interface MotivoCierre {
  id: number
  descripcion: string
  codigoReferencia: any
}
