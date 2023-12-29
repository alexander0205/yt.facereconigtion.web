export interface DailyAttendanceEmployerFile {
    idAsistenciaDiariaEmpleadorArchivo: string
  idAsistenciaDiariaEmpleador: string
  "tipoDocumento":string
  activo: boolean
  archivo: Archivo
  asistenciaDiariaEmpleador: AsistenciaDiariaEmpleador
}

export interface Archivo {
  idArchivo: number
  nombreArchivo: string
  tipo: string
  fecha: string
  activo: boolean
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
