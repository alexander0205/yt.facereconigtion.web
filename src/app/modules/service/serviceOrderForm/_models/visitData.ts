import { BaseModel } from "../../service/baseModels/baseModel";

export class visitData extends BaseModel{
    visitDataId:number;
    serviceOrderNumber:string;
    visitDate:string;
    scheduleVisit:string;
    typeOfScheduleId:number;
    typeOfScheduleInfo:string;
    actionTakenId:number;
    ActionTakenInfo:string;
    finishedVisitDetail:string;
    actionTakenOthers:string;
    RegisterByName:string;
    ModifiedByName:string;

}