import { IActionPlanItem, IActionPlanItemChoice } from "../../../../models";

export interface IBulkUpdatePanelState {
  s_EndState: string[];
  s_RatingOption: string[];
  s_Brigade: string[];
  s_ViabilityOption: string[];
  s_Classification: string[];


  ds_AssignTo:string[];
  ds_Priority:string;
  ds_ActionStatus:string;

  isPanelOpen: boolean;

}



