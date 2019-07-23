import { IActionPlanItem, IActionPlanItemChoice } from "../../../../models/";

export interface IActionPlanItemListState {
  rows?: IActionPlanItem[];
  selectedBrigade: any[];
}
