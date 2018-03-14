export class  Institution {
    // dados da instituição
    constructor (public name: string,
                 public city: string,
                 public course: string,
                 public startYear: string,
                 public yearTermination: string,
                 public timeToGo: boolean[],
                 public timeToBack: boolean[] 
           
    ) { }


     
}
