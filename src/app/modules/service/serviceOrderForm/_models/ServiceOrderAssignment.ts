import { BaseModel } from "../../service/baseModels/baseModel";

export class ServiceOrderAssignment extends BaseModel {
    serviceOrderAssignmentId: number;
    serviceOrderNumber: number;
    localRepresentativeId: number;
    localRepresentativeInfo: string;
    justificationInspectorChange: string;
    assignedInspectorId: number
    supervisorId: number;
    groupId: number;
    registeredByName: string;
    modifiedByName: string;
    assignedInspectorInfo: string;

}