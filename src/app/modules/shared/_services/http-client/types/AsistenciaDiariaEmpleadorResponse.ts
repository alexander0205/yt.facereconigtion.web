export interface AsistenciaDiariaEmpleadorResponse {
  idAsistenciaDiariaEmpleador: number
  idUsuario: number
  idRepLocalProvinciaCatalog: number
  idEmpresa: number
  idTipoCorrespondencia: number
  idTipoDocumento: any
  idEstado: number
  idAsistenciaDiaria: number
  idArchivoDocumentoFirmado: any
  codigo: string
  tipoEmpleador: string
  tieneApoderadoSuDemanda: boolean
  fechaAsignacion: string
  fechaRegistro: string
  comentarioDocumentoFirmado: any
  observacion: string
  activo: boolean
  usuario: Usuario
  localRepresentativeProvince: LocalRepresentativeProvince
  empresa: Empresa
  tipoDocumento: any
  tipoCorrespondencia: TipoCorrespondencia
  asistenciaDiaria: AsistenciaDiaria
  estado: Estado
  archivoDocumentoFirmado: any
  expedienteCierre:any
  DemandaCorrespondeFechasAnteriores: number,
  FechaDemandaAnterior: any
  codigoCorrespondencia: any
}

export interface Usuario {
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

export interface LocalRepresentativeProvince {
  localRepresentativeProvinceId: number
  provinceCode: string
  localRepProvinceInformation: string
}

export interface Empresa {
  idEmpresa: number
  rncCedula: string
  rnl: string
  nombreComercial: string
  razonSocial: string
  dedicacion: string
  identificacion: string
  direccionReferencia: string
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
  tipoActividadComercial: any
  tipoIdentificacion: any
  nacionalidad: any
  estadoCivil: any
}

export interface TipoCorrespondencia {
  id: number
  descripcion: string
  codigoReferencia: any
}

export interface AsistenciaDiaria {
  idAsistenciaDiaria: number
  idRepLocalProvinciaCatalog: number
  idTipoIdentificacion: number
  idNacionalidad: number
  idMotivoVisita: number
  idReferido: number
  idAbogado: number
  idAbogadoAlterno: number
  idAbpgadoAlterno1: number;
  idUsuario: number
  idTipoSolicitante: number
  idRepresentante: any
  idEstadoCivil: number
  idSexo: number
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
  localRepresentativeProvince: LocalRepresentativeProvince2
  tipoIdentificacion: any
  nacionalidad: any
  motivoVisita: any
  referido: any
  tipoSolicitante: TipoSolicitante
  representante: any
  estadoCivil: any
  sexo: any
  abogado: Abogado
  abogadoAlterno: AbogadoAlterno
  usuario: Usuario2
  asistenciaDiariaEmpleador: any[]
}

export interface LocalRepresentativeProvince2 {
  localRepresentativeProvinceId: number
  provinceCode: string
  localRepProvinceInformation: string
}

export interface TipoSolicitante {
  id: number
  descripcion: string
  codigoReferencia: string
}

export interface Abogado {
  userId: number
  userCode: string
  firstName: string
  secondName: any
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

export interface Usuario2 {
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

export interface Estado {
  id: number
  descripcion: string
  codigoReferencia: any
}