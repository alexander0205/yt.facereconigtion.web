import { Archivo } from "./DailyAttendanceEmployerFile"

export interface ExpedienteCierreArchivoResponse {
  idExpedienteCierreArchivo: number
  idExpedienteCierre:number
  descripcion: string
  activo: boolean
  archivo: Archivo
  expediente: Expediente
}


export interface Expediente {
  idExpediente: number
  idRepLocalProvinciaCatalog: any
  idAsistenciaDiariaEmpleador: any
  idEstado: any
  idInstanciaJudicial: any
  idMotivoDemanda: any
  idFaseProceso: any
  idMotivoCierre: any
  idEstadoManual: any
  codigo: any
  fechaAlta: any
  fechaCierre: any
  fechaEjecucionCierre: any
  fechaUltimaAudiencia: any
  fechaProximaAudiencia: any
  noExpedienteExterno: any
  notas: any
  observaciones: any
  observacionesCierre: any
  activo: boolean
  localRepresentativeProvince: any
  asistenciaDiariaEmpleador: any
  estado: any
  instanciaJudicial: any
  motivoDemanda: any
  faseProceso: any
  motivoCierre: any
  estadoManual: any
}
