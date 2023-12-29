export interface FileListEntity {
    ids: Id[]
  }
  
  export interface Id {
    idArchivo: number
    descripcion: string
    tipo: string
    fecha: string
    activo: boolean
  }
  