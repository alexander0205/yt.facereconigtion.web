import { BaseModel } from "../../service/baseModels/baseModel";

export class companyData extends BaseModel {
    companyDataId: number;
    rnl: number;
    rnc: number;
    serviceOrderNumber: string;
    companyTradeName: string;
    socialCompanyName: string
    representativeCompanyName: string
    branchOffice: boolean;
    companyBranchOffice: string;
    province: string;
    municipality: string
    municipalDistrict: string;
    section: boolean;
    companySection: string;
    neighborhood: string;
    street: string;
    streetNumber: string;
    reference: string;
    telephone: string;
    companyExtension: string;
    fax: string;
    email: string;
    freeZone: boolean;
    freeZoneName: string;
    companyArea: string;
    activityBranchRLTId: number;
    operationsStartDate: string;
    stocksValue: number;
    maleAffectedWorkers: Number;
    womenWorkersAffected: number;
    minorsBoys: number;
    minorsGirls: number;
    laborUnion: boolean;
    companyLaborUnion: string;
    listDocuments: Array<{ root: string, fileName: string }>
    economicActivityId:number;

}


