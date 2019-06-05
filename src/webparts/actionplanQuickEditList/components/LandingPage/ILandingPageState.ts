import {
  ISolutionDropdownOption,
  IBrigadeDataListOption
} from "../../../../models/index";

export interface ILandingPageState {
  reviewPeriodOption: ISolutionDropdownOption[];
  districtOption: ISolutionDropdownOption[];
  selectedBrigade: IBrigadeDataListOption[];
  brigadeOption: IBrigadeDataListOption[];
  selectedDistrict: string;
  selectedReviewPeriod: string;
  isGetBrigadeDisabled: boolean;
  isCreateActionPlanButtonDisabled: boolean;
}
