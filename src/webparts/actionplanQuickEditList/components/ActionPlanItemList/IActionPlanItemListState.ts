import { IActionPlanItem, IActionPlanItemChoice } from "../../../../models/";

export interface IActionPlanItemListState {
  rows?: IActionPlanItem[];
  selectedBrigade: any[];
  // itemSupportOption: string[];
  // itemPriorityOption: string[];
  // itemDueOption: string[];
  // itemStatusOption: string[];

}
