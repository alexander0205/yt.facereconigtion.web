export interface DailyAttendanceEmployerReferencePersonal {
    idAsistenciaDiariaEmpleadorReferenciaPersonal: number
    activo: boolean
    referencia: Referencia
    asistenciaDiariaEmpleador: AsistenciaDiariaEmpleador
  }


export interface Referencia {
    idReferencia: number
    nombre: string
    apellido: string
    provincia: string
    municipio: string
    distritoMunicipal: string
    sector: string
    calle: string
    numero: string
    edificio: string
    apartamentoCasa: string
    telefono: string
    correoElectronico: string
    activo: boolean
  }
  
  export interface AsistenciaDiariaEmpleador {
    idAsistenciaDiariaEmpleador: number
    codigo: any
    tipoEmpleador: string
    tieneApoderadoSuDemanda: boolean
    fechaAsignacion: any
    fechaRegistro: any
    observacion: any
    activo: boolean
    usuario: any
    localRepresentativeProvince: any
    empresa: any
    tipoDocumento: any
    tipoCorrespondencia: any
    asistenciaDiaria: any
  }
  
