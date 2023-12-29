export interface CompanyResponse {
    idEstadoCivil: string
    idNacionalidad: string
    idEmpresa: number
    rncCedula: string
    rnl: string
    nombreComercial: string
    razonSocial: string
    nombre: string
    apellido: string
    dedicacion: string
    identificacion: string
    direccionReferencia: any
    representanteLegalEmpleador: string
    correoElectronico: string
    telefono: string
    provincia: string
    municipio: string
    distritoMunicipal: string
    sector: string
    calle: string
    numero: string
    edificio: string
    apartamentoCasa: string
    activo: boolean
    tipoActividadComercial: TipoActividadComercial
    tipoIdentificacion: TipoIdentificacion
    idTipoIdentificacion: any
    nacionalidad: any
    estadoCivil: any
  }
  
  export interface TipoActividadComercial {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface TipoIdentificacion {
    id: number
    descripcion: string
    codigoReferencia: string
  }
  