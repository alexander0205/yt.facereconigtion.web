
export interface AsistenciaDiaria {
    idAsistenciaDiaria: number
    codigo: string
    fechaAlta: string
    identificacion: string
    nombre: string
    apellido: string
    edad: number
    telefono: string
    telefonoOtraParte: string
    correoElectronico: string
    observaciones: string
    activo: boolean
    localRepresentativeProvince: LocalRepresentativeProvince
    tipoIdentificacion: TipoIdentificacion
    nacionalidad: Nacionalidad
    motivoVisita: MotivoVisita
    referido: any
    tipoSolicitante: TipoSolicitante
    representante: any
    estadoCivil: EstadoCivil
    sexo: Sexo
    abogado: Abogado
    abogadoAlterno: AbogadoAlterno
    usuario: Usuario
  }
  
  export interface LocalRepresentativeProvince {
    localRepresentativeProvinceId: number
    provinceCode: string
    localRepProvinceInformation: string
  }
  
  export interface TipoIdentificacion {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface Nacionalidad {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface MotivoVisita {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface TipoSolicitante {
    id: number
    descripcion: string
    codigoReferencia: string
  }
  
  export interface EstadoCivil {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface Sexo {
    id: number
    descripcion: string
    codigoReferencia: any
  }
  
  export interface Abogado {
    userId: number
    userCode: string
    firstName: string
    secondName: any
    firstLastName: string
    secondLastName: any
    typeOfIdentificationId: number
    identification: string
    phone: any
    mobile: any
    address: string
    gender: string
    email: string
    repLocalProvId: number
    roleId: number
    supervisorUserId: number
    previousSupervisorId: any
    groupId: number
  }
  
  export interface AbogadoAlterno {
    userId: number
    userCode: string
    firstName: string
    secondName: string
    firstLastName: string
    secondLastName: string
    typeOfIdentificationId: number
    identification: string
    phone: any
    mobile: any
    address: string
    gender: string
    email: string
    repLocalProvId: number
    roleId: number
    supervisorUserId: number
    previousSupervisorId: any
    groupId: number
  }
  
  export interface Usuario {
    userId: number
    userCode: string
    firstName: string
    secondName: string
    firstLastName: string
    secondLastName: any
    typeOfIdentificationId: number
    identification: string
    phone: any
    mobile: any
    address: string
    gender: string
    email: string
    repLocalProvId: number
    roleId: number
    supervisorUserId: number
    previousSupervisorId: any
    groupId: number
  }
  