import { IBrigadeDataListOption } from "../../../../models/index";

export interface IAppContainerState {
  isActionPlanCreated: boolean;
  selectedBrigade: IBrigadeDataListOption[];
  selectedReviewPeriod: string;
}
