import { ISolutionDropdownOption } from "../../../../models";

export interface IActionPlanPageProps {
  selectedBrigade: ISolutionDropdownOption[];
  reviewPeriod: string;
  handleClose: any;
  siteURL: string;
}
