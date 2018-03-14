import { SystemUsers } from "./system-users.model";
import { UniversityTransportation } from "./universityTransportation.model";
import { UsersDocuments } from "./system-users-documents";
import { UsersAddress } from "./system-users-address";
import { UsersPhone } from "./system-users-phone";

export class SystemUserUniversityTransportation {

    constructor(public name: string,
        public email: string,
        public login: string,
        public password: string,
        public lats_login: string,
        public documents: Array<UsersDocuments>,
        public address: Array<UsersAddress>,
        public phone: Array<UsersPhone>,
        public active: boolean, // parte referente ao usuario normal 
        public universityTransportation: UniversityTransportation, // parte referente ao transporte

    ) { }
}
