export interface DailyAttendanceEmployerWorkContractResponse {
    idAsistenciaDiariaEmpleadorContratoLaboral: number
    ocupacion: string
    lugarTrabajo: string
    fechaInicio: string
    fechaFin: string
    departamento: string
    supervisorInmediato: string
    fechaFinalizacion: any
    especifique: any
    activo: boolean
    tiempoTrabajado: number
    tipoJornada: TipoJornada
    jornadaLaboral: JornadaLaboral
    causaSuspencionContrato: any
  asistenciaDiariaEmpleador: AsistenciaDiariaEmpleador
  idAsistenciaDiariaEmpleador: string
  especificar: string
  motivoDemanda:any
  }
  
  export interface TipoJornada {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface JornadaLaboral {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface AsistenciaDiariaEmpleador {
    idAsistenciaDiariaEmpleador: number
    codigo: string
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
  