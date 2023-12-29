export interface DailyAttendanceEmployerDocumentFile {
    idAsistenciaDiariaEmpleadorDocumentoArchivo: number
    activo: boolean
    archivo: Archivo
    asistenciaDiariaEmpleadorDocumento: AsistenciaDiariaEmpleadorDocumento
  }
  
  export interface Archivo {
    idArchivo: number
    nombreArchivo: string
    tipo: string
    fecha: string
    activo: boolean
  }
  
  export interface AsistenciaDiariaEmpleadorDocumento {
    idAsistenciaDiariaEmpleadorDocumento: number
    activo: boolean
    asistenciaDiariaEmpleador: any
    tipoDocumento: any
  }
  