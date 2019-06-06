import { IBrigadeDataListOption, ISolutionDropdownOption } from "../../../../models/index";

export interface IAppContainerState {
  isActionPlanCreated: boolean;
  selectedBrigade: ISolutionDropdownOption[];
  selectedReviewPeriod: string;
}
