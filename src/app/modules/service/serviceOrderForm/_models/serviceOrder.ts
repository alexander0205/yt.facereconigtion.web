import { FormGroup } from "@angular/forms";
import { DropDownOptionModel } from "src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model";
import { BaseModel } from "../../service/baseModels/baseModel";

export class serviceOrder extends BaseModel {

    serviceOrderId: number;
    serviceOrderNumber: string;
    orderDate: string;
    newEstimatedDeadline: string;
    justificationChangeEstimatedDateId: number;
    justificationChangeEstimatedDate: string;
    repLocalProvId: number;
    repLocalProvInfo: string;
    serviceTypeId: number;
    serviceTypeInfo: string;
    applicantTypeId: number;
    applicantTypeInfo: string;
    requestFormId: string;
    requestFormInfo: string;
    deadline: string;
    deadlineStr: string;
    estimatedDeadLine: string;
    estimatedDeadLineStr: string;
    newEstimatedDeadlineStr: string;
    amountDaysNoticeClosing: number;
    statusOrderServiceId: number;
    statusOrderServiceInfo: string
    inspectionReasonsListed: any[];
    inspectionReasonsListedJson: string;
    inspectionReasonObservations: string;
    closedOrder: boolean;
    recordDateStr: string;
    registeredByName: string;
    modifiedByName: string;
    inspectionProgramId: number;
    cssClosingDateStatus: string;
    justifAnotherTypeApplicant: string;
    visitResultId: number;
    warningReportNumber:string;
}


