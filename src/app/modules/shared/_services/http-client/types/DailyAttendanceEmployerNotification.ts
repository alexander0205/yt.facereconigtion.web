export interface DailyAttendanceEmployerNotification {
  idAsistenciaDiariaEmpleador:string,
    idAsistenciaDiariaEmpleadorNotificacion: number
    tieneNotificacionActoDeAlguacil: boolean
    nombreDemandante: string
    descripcionDocumentoNotificado: string
    activo: boolean
    asistenciaDiariaEmpleador: AsistenciaDiariaEmpleador
    tribunalApoderado: TribunalApoderado
    faseProceso: FaseProceso
  }
  
  export interface AsistenciaDiariaEmpleador {
    idAsistenciaDiariaEmpleador: number
    codigo: string
    tipoEmpleador: string
    tieneApoderadoSuDemanda: boolean
    fechaAsignacion: string
    fechaRegistro: string
    observacion: string
    activo: boolean
    usuario: any
    localRepresentativeProvince: any
    empresa: any
    tipoDocumento: any
    tipoCorrespondencia: any
    asistenciaDiaria: any
  }
  
  export interface TribunalApoderado {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface FaseProceso {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  