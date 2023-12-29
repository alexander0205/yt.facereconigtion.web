import { BaseModel } from "../../baseModels/baseModel";

export class inspectionProgram extends BaseModel {
    inspectionProgramId: number;
    inspectionProgramNumber: string;
    programName: string;
    programTypeId: number;
    programTypeInfo: string;
    programObjective: string;
    geographicLimit: string;
    classificationTypeId: number;
    classificationTypeInfo: string;
    localRepresentativeProvinceId: number;
    localRepresentativeProvinceInfo: string;
    estimatedStartDate: string;
    estimatedEndDate: string;
    statusInspectionProgramId: number;
    statusInspectionProgramInfo: string;
    registrationDateStr: string;
    registeredByName: string;
    approvedInspection: boolean;
    validatedBy: string;
    validatedByName: string;
    validationComment: string;
    realStartDate: string;
    realEndDate: string;
    isNotified: boolean;
}
