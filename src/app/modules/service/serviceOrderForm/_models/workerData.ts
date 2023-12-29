import { DropdownComponent } from "src/app/modules/shared/_elements/element-ui/dropdown/dropdown.component";

export class workerData {
    companyWorkerId: number;
    companyPopulationWorkerId: number;
    workerName: string;
    identificationTypeId: number;
    workerIdentification: string;
    workerAddress: string;
    workerPhone: any;
    workerExtension: any;
    workerEmail: string;
    recordStatus:boolean;
    recordStatusStr:string;
    serviceOrderPopulationWorkersNav:[workerData];
    registeredBy: string;
    registrationDate: any;

}
