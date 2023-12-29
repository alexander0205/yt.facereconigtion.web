import { Rlt } from "./rlt";

export class user {
constructor(json:any){
    this.userId = json.userId;
    this.userCode= json.userCode;
    this.firstName= json.firstName;;
    this.secondName= json.secondName;
    this.firstLastName= json.firstLastName;
    this.secondLastName= json.secondLastName;
    this.typeOfIdentificationId= json.typeOfIdentificationId;
    this.typeOfIdentificationIdInfo= json.typeOfIdentificationIdInfo;
    this.identification = json.identification;
    this.phone= json.phone;
    this.mobile= json.mobile;
    this.address= json.address;
    this.roleLevels= json.roleLevels
    this.gender= json.gender;
    this.email= json.email;
    this.repLocalProvId= json.repLocalProvId;
    this.repLocalProvIdInfo= json.repLocalProvIdInfo;
    this.roleId= json.roleId;
    this.roleInfo= json.roleInfo;
    this.roleCode=json.roleCode;
    this.supervisorUserId= json.supervisorUserId;
    this.supervisorUserIdCode = json.supervisorUserIdCode;
    this.groupId= json.groupId;
    this.groupInfo= json.groupInfo;
    this.registrationDate= json.registrationDate;
    this.registeredBy= json.registeredBy;
    this.registeredByName= json.registeredByName;
    this.recordModificationDate= json.recordModificationDate;
    this.modifiedBy= json.modifiedBy;
    this.modifiedByName= json.modifiedByName;
    this.recordStatus= json.recordStatus;
    this.multipleRlt = json.multipleRlt;
}
    userId: number;
    userCode: string;
    firstName: string;;
    secondName: string;;
    firstLastName: string;;
    secondLastName: string;;
    typeOfIdentificationId: number;
    typeOfIdentificationIdInfo: string;
    identification;
    phone: string;
    mobile: string;
    address: string;
    roleLevels:role[]
    multipleRlt: [{ localRepresentativeProvince: Rlt; }]
    gender: string;
    email: string;
    repLocalProvId: number;
    repLocalProvIdInfo: string;
    roleId: number;
    roleInfo: string;
    roleCode:string
    supervisorUserId: number;
    supervisorUserIdCode;
    groupId: number;
    groupInfo: string;
    registrationDate: string;
    registeredBy: string;
    registeredByName: string;;
    recordModificationDate: string;
    modifiedBy: string;
    modifiedByName: string;
    recordStatus: boolean;

    getInitials():string{
        return `${this.firstName.slice(0,1).toUpperCase() + this.firstLastName.slice(0,1).toUpperCase()}`
    }

    getFullName():string{
        return  `${this.firstName.toLocaleLowerCase()} ${this.firstLastName.toLocaleLowerCase()}`
    }

    checkAuthorization(page:string,Code:string){
        if(this.roleLevels.find(role=> page.search(role.pageInfo) !== -1)?.roleLevelCodeInfo.search(Code) !== -1){
            return true
        }else{
            return false
        }
     
    }
    checkCode(Code:string){
        if(this.roleLevels.find(role=>role.code == Code )){
            return true
        }else{
            return false
        }
    }
    }


class role{
    roleId: number;
    roleInfo: string;
    pageInfo: string;
    code: string;
    roleLevelCodeInfo: string;
}