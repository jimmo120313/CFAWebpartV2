import { IActionPlanItem,ISolutionDropdownOption } from "../../../../models";
import { IDropdownOption } from 'office-ui-fabric-react';
export interface IFilterControlsProp {

      //Filter Option Value
      EndState: ISolutionDropdownOption[];
      RatingOption: ISolutionDropdownOption[];
      Brigade: ISolutionDropdownOption[];
      ViabilityOption: ISolutionDropdownOption[];
      Classification: ISolutionDropdownOption[];
      //Parent Checked all Valu;
      p_EndStateChecked:boolean;
      p_RatingOptionChecked:boolean;
      p_BrigadeChecked:boolean;
      p_ViabilityChecked:boolean;
      p_ClasifiChecked:boolean;
      //Parent Selected Valu;
      ps_EndState: string[];
      ps_RatingOption: string[];
      ps_Brigade: string[];
      ps_ViabilityOption: string[];
      ps_Classification: string[];
}

