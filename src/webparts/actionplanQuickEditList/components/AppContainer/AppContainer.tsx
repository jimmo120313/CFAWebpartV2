import * as React from "react";
import { IAppContainerProps } from "./IAppContainerProps";
require("./AppContainer.module.scss");
import { LandingPage } from "../LandingPage";
import { ActionPlanPage } from "../ActionPlanPage";
import { sp } from "@pnp/sp";
import {
  IReviewPeriod,
  ISolutionDropdownOption,
  IBrigadeDataListOption
} from "../../../../models/index";
import { IAppContainerState } from "./IAppContainerState";

export class AppContainer extends React.Component<
  IAppContainerProps,
  IAppContainerState
  > {
  constructor(props: IAppContainerProps) {
    super(props);
    
    this.state = {
      selectedBrigade: [],
      selectedReviewPeriod: "",
      isActionPlanCreated: false
    };

  }

  private _createActionPlanClicked = (
    brigades: ISolutionDropdownOption[],
    reviewPeriod: string
  ): void => {

    this.setState({
      selectedBrigade: brigades,
      selectedReviewPeriod: reviewPeriod,
      isActionPlanCreated: true
    });
  }
  private reInitiate = (): void => {
    this.setState({
      selectedBrigade: [],
      selectedReviewPeriod: "",
      isActionPlanCreated: false
    });
  }

  public render(): React.ReactElement<IAppContainerProps> {

    if (this.state.isActionPlanCreated) {
      return (
        <ActionPlanPage
          selectedBrigade={this.state.selectedBrigade}
          reviewPeriod={this.state.selectedReviewPeriod}
          handleClose={this.reInitiate}
        />
      );
    } else {
      return (
        <div>
          <LandingPage onCreateActionPlan={this._createActionPlanClicked} />
        </div>
      );
    }
  }
}
