export class GeneralService {

    public static copyArray = (array: any[]): any[] => {
   
        const newArray: any[] = [];
        for (let i = 0; i < array.length; i++) {
          newArray[i] = array[i];
        }
        return newArray;
      }

}