export class AuditModels {  
    
        constructor(
          
            public nameUser: string,
            public numberCpfUser: string,
            public date: Date,
            public ipUser: string,
            public session: string,
            public description: String
        ) { }
    }
    