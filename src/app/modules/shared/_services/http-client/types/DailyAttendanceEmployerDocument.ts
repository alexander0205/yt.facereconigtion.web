
export interface DailyAttendanceEmployerDocument {
    idAsistenciaDiariaEmpleadorDocumento: number
    activo: boolean
    asistenciaDiariaEmpleador: AsistenciaDiariaEmpleador
    tipoDocumento: TipoDocumento
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
  
  export interface TipoDocumento {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  