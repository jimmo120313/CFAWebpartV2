import { IActionPlan, IActionPlanItem, ISolutionDropdownOption } from "../../../../models";
export interface IActionPlanPageState {
  //For Filter DataSource
  //ds_Brigade: ISolutionDropdownOption[];
  //ds_ratingOption: ISolutionDropdownOption[];
  //ds_ViabilityOption: ISolutionDropdownOption[];
  //ds_EndState: ISolutionDropdownOption[];
  //ds_Classification: ISolutionDropdownOption[];
  //s_Brigade: string[];
  //s_ratingOption: string[];
  //s_ViabilityOption: string;
  s_EndState: string[];
  //s_Classification: string;
  //From Parent
  reviewPeriod: string;
  //For Item List
  itemSupportOption: string[];
  itemPriorityOption: string[];
  itemDueOption: string[];
  itemStatusOption: string[];

  masterRow: IActionPlan[];
  DetailRow: IActionPlanItem[];
  reviewIDs: number[];
}
