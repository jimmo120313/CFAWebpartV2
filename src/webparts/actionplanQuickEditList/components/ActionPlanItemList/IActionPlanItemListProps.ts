import { IActionPlanItem } from "../../../../models";
export interface IActionPlanItemListProp {
  selectedBrigade: any[];
  reviewPeriod: string;
  fRating: any[];
  fVCategory: any[];
  fEndState: any[];
  fClassification: any[];
  row?: IActionPlanItem[];
  // itemSupportOption: string[];
  // itemPriorityOption: string[];
  // itemDueOption: string[];
  // itemStatusOption: string[];
}
