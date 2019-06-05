import * as React from "react";
import { IActionPlanPageProps, IActionPlanPageState } from "./index";
import { ActionPlanMasterList } from "../ActionPlanMasterList/index";
import { ActionPlanItemList } from "../ActionPlanItemList/index";
import {
  IReviewPeriod,
  ISolutionDropdownOption,
  IBrigadeDataListOption
} from "../../../../models/index";
require("./ActionPlanPage.module.scss");
import { ABRService } from "../../../../services/ABRService";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";


export class ActionPlanPage extends React.Component<
  IActionPlanPageProps,
  IActionPlanPageState
  > {
  private abrService = new ABRService();
  private supportOption: string[] = [];
  private priorityOption: string[] = [];
  private dueOption: string[] = [];
  private statusOption: string[] = [];

  constructor(props: IActionPlanPageProps) {
    super(props);
    this.state = {
      brigadeOption: this.props.selectedBrigade,
      reviewPeriod: this.props.reviewPeriod,
      selectedBrigade: this.props.selectedBrigade,
      ratingOption: [],
      ViabilityOption: [],
      EndState: [],
      Classification: [],
      itemSupportOption: [],
      itemPriorityOption: [],
      itemDueOption: [],
      itemStatusOption: []
    };

  }
  public async componentDidMount(): Promise<void> {
    //Get Rating
    let rating = this.abrService._getRating();
    this.setState({ ratingOption: rating });
    //Get Viability Category
    this.abrService
      ._getViabilityCategoryOption()
      .then((option: ISolutionDropdownOption[]) => {
        this.setState({ ViabilityOption: option });
      });
    // //Get End State
    // this.brigade
    //   ._getDistrictOption()
    //   .then((option: ISolutionDropdownOption[]) => {
    //     this.setState({ districtOption: option });
    //   });
    // //Get Classification
    // this.brigade
    //   ._getDistrictOption()
    //   .then((option: ISolutionDropdownOption[]) => {
    //     this.setState({ districtOption: option });
    //   });

    await this.abrService._getSupportRequired();
    this.setState({
      itemDueOption: this.abrService.dueOption,
      itemPriorityOption: this.abrService.priorityOption,
      itemStatusOption: this.abrService.statusOpion,
      itemSupportOption: this.abrService.supportOption
    });

  }

  public render(): React.ReactElement<IActionPlanPageProps> {
    return (
      <div>
        <div>
          <Dropdown
            placeHolder="Brigade (Multi Select)"
            options={this.state.brigadeOption}
            multiSelect
            className="dd"
          //onChanged={this._onReviewPeriodSelected}
          />

          <Dropdown
            placeHolder="Rating (Multi Select)"
            options={this.state.ratingOption}
            multiSelect
            className="dd"
          //onChanged={this._onDistrictSelected}
          />
          <Dropdown
            placeHolder="Viability Category"
            options={this.state.ViabilityOption}
            multiSelect
            className="dd"
          //onChanged={this._onDistrictSelected}
          />
          {/* <Dropdown
          placeHolder="End State (Question Ref)"
          options={this.state.districtOption}
          onChanged={this._onDistrictSelected}
        />
        <Dropdown
          placeHolder="Classification"
          options={this.state.districtOption}
          onChanged={this._onDistrictSelected}
        /> */}
        </div>
        <ActionPlanMasterList
          reviewPeriod={this.state.reviewPeriod}
          selectedBrigade={this.state.brigadeOption}
        />

        <ActionPlanItemList
          selectedBrigade={this.state.selectedBrigade}
          fRating={this.state.ratingOption}
          fVCategory={this.state.ViabilityOption}
          fEndState={this.state.EndState}
          fClassification={this.state.Classification}
          itemSupportOption={this.state.itemSupportOption}
          itemStatusOption={this.state.itemStatusOption}
          itemDueOption={this.state.itemDueOption}
          itemPriorityOption={this.state.itemPriorityOption}
        />
      </div>
    );
  }
}
