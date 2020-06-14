export class GeneralService {

    public static copyArray = (array: any[]): any[] => {
   
        const newArray: any[] = [];
        for (let i = 0; i < array.length; i++) {
          newArray[i] = array[i];
        }
        return newArray;
    }

    public static _getISODateStringFormat(date:string):string {
      let dateString:any;
      date = date.replace(/-/g,"/");
      
      
      let d ="";
      if(date && date.split("/")[2].toString().length==4){
        d = date.split("/")[2] + "/" + date.split("/")[1] + "/" + date.split("/")[0];
        dateString = new Date(d);
      }else{
        dateString = new Date(date);
      }

      let month = dateString.getMonth() + 1;
      let day = dateString.getDate();
      let year = dateString.getFullYear();
      let finalResult = year + "-" + (month.toString().length==1?"0"+month:month)+ "-" + day;

      return finalResult;
    }

    public static _getAUDateStringFormat(date:string):string {
    
      date = date.replace(/-/g,"/");
      
      let d ="";
      if(date && date.split("/")[0].toString().length==4){
        d = date.split("/")[2] + "/" + date.split("/")[1] + "/" + date.split("/")[0];
      }
  
      return d;
    }
      
}

    
 export enum FilterLabel{
      Brigade="Brigade",
      Rating="Rating",
      Viability="Viability",
      EndState="EndState",
      Classification="Classification"
    }
  