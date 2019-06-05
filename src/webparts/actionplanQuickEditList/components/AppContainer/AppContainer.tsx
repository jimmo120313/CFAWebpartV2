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
    let testReviewPeriod = "2017/18";
    let testselectedBrigade: IBrigadeDataListOption[] = [];
    let e = {
      "brigadeId": 853,
      "brigadeName": "Nulla Vale",
      "itemType": "0"
    };

    testselectedBrigade.push(e);
    //this.setState({ selectedBrigade: testselectedBrigade, selectedReviewPeriod: testReviewPeriod })
    this.state = {
      selectedBrigade: testselectedBrigade,
      selectedReviewPeriod: testReviewPeriod,
      isActionPlanCreated: false
    };


  }

  private _createActionPlanClicked = (
    brigades: IBrigadeDataListOption[],
    reviewPeriod: string
  ): void => {
    //debugger;
    this.setState({
      selectedBrigade: brigades,
      selectedReviewPeriod: reviewPeriod,
      isActionPlanCreated: true
    });
  }

  public render(): React.ReactElement<IAppContainerProps> {

    return (<div className="row"><ActionPlanPage
      selectedBrigade={this.state.selectedBrigade}
      reviewPeriod={this.state.selectedReviewPeriod}
    /></div>);
    // if (this.state.isActionPlanCreated) {
    //   return (
    //     <ActionPlanPage
    //       selectedBrigade={this.state.selectedBrigade}
    //       reviewPeriod={this.state.selectedReviewPeriod}
    //     />
    //   );
    // } else {
    //   return (
    //     <div>
    //       <LandingPage onCreateActionPlan={this._createActionPlanClicked} />
    //     </div>
    //   );
    // }
  }
}
