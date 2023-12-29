import { BaseModel } from "../../../service/baseModels/baseModel";

export class orderNotes extends BaseModel{
    idNota:number;
    codigo:string;
    notaInfo:string; 
    registradoPorNombre:string;
    registrationDateStr:string  ;
    modificadoPorNombre:string  ;
    recordModificationDateStr: string;
    fechaRegistro:string;
    fechaModificacion:any;
    registradoPor:string;
    modificadoPor:string;
    estatusRegistro: boolean;
    fechaNotificacion: Date;
 
}

