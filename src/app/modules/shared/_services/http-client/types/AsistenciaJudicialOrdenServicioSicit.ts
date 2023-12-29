
export interface AsistenciaJudicialOrdenServicioSicit {
  idAsistenciaJudicialOrdenServicioSicit: number
  idAsistenciaDiariaEmpleador: number
  empRnc: string
  empRnl: string
  ordenServicioNumero: string
  fechaOrden: Date
  estadoOrdenServicioInfo: string
  asistenciaDiariaEmpleador: AsistenciaDiariaEmpleador
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
  