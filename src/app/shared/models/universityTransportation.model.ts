import { Institution } from "./institution.model";

export class  UniversityTransportation {
    // dados do transporte universitario 
    constructor (public profession : string,
                public bloodType: string,
                 public motherSname: string,
                 public institution: Institution
    ) { }
}
