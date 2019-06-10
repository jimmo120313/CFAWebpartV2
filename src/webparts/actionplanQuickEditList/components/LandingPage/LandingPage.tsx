import * as React from "react";
import { ILandingPageProps, ILandingPageState } from "./index";
import {
  IReviewPeriod,
  ISolutionDropdownOption,
  IBrigadeDataListOption
} from "../../../../models/index";
require("./LandingPage.module.scss");
import { ABRService } from "../../../../services/ABRService";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { Selection } from "office-ui-fabric-react/lib/Selection";
import { MarqueeSelection } from "office-ui-fabric-react/lib/MarqueeSelection";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Transfer, Button } from "antd";
//require('antd/lib/date-picker/style/css');

import {
  CommandBarButton,
  IButtonProps,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import {
  DetailsList,
  DetailsListLayoutMode
} from "office-ui-fabric-react/lib/DetailsList";

export class LandingPage extends React.Component<
  ILandingPageProps,
  ILandingPageState
  > {
  private brigade = new ABRService();
  private _selection: Selection;
  private _allBrigadeOption: IBrigadeDataListOption[];

  constructor(props: ILandingPageProps) {
    super(props);
    this.state = {
      reviewPeriodOption: [],
      districtOption: [],
      brigadeOption: [],

      selectedBrigade: [],
      selectedDistrict: "",
      selectedReviewPeriod: "",

      isGetBrigadeDisabled: false,
      isCreateActionPlanButtonDisabled: false,
      targetKeys: []
    };

    this._selection = new Selection({
      onSelectionChanged: () =>
        this.setState({ selectedBrigade: this._getSelectionDetails() })
    });
  }

  public async componentDidMount(): Promise<void> {

    this.brigade
      ._getReviewPeriodOption()
      .then((option: ISolutionDropdownOption[]) => {
        this.setState({ reviewPeriodOption: option });
      });
    this.brigade
      ._getDistrictOption()
      .then((option: ISolutionDropdownOption[]) => {
        this.setState({ districtOption: option });
      });
  }

  private _getSelectionDetails(): IBrigadeDataListOption[] {
    const selectionCount: IBrigadeDataListOption[] = [];

    for (let i = 0; i < this._selection.getSelectedCount(); i++) {
      selectionCount.push(this._selection.getSelection()[
        i
      ] as IBrigadeDataListOption);
    }

    return selectionCount;
  }
  public _onGetBrigade = async (): Promise<void> => {
    let bOption = new ABRService();
    bOption
      ._getBrigadeOption(this.state.selectedDistrict)
      .then((brigadeOption: IBrigadeDataListOption[]) => {
        this._allBrigadeOption = brigadeOption;
        this.setState({ brigadeOption: this._allBrigadeOption });
      })
      .catch(e => {
        console.log(e);
      });
  }


  // private _onChanged = (text: any): void => {
  //   this.setState({
  //     brigadeOption: text
  //       ? this._allBrigadeOption.filter(
  //         i => i.brigadeName.toLowerCase().indexOf(text) > -1
  //       )
  //       : this._allBrigadeOption
  //   });
  // }

  private _onDistrictSelected = async (item: IDropdownOption): Promise<void> => {
    let bOption = new ABRService();
    bOption
      ._getBrigadeOption(item.text)
      .then((brigadeOption: IBrigadeDataListOption[]) => {
        //this._allBrigadeOption = brigadeOption;
        this.setState({
          brigadeOption: brigadeOption,
          selectedDistrict: item.text,
          selectedBrigade: [],
          targetKeys: []
        });
      })
      .catch(e => {
        console.log(e);
      });


  }
  private _onReviewPeriodSelected = (item: IDropdownOption): void => {
    this.setState({ selectedReviewPeriod: item.text });
  }

  private _createActionPlan = (): void => {
    let selectedBrigade: ISolutionDropdownOption[] = [];

    this.state.targetKeys.forEach(k => {

      selectedBrigade.push({ key: this.state.brigadeOption[k].description.toString(), text: this.state.brigadeOption[k].title });
    });

    this.props.onCreateActionPlan(
      selectedBrigade,
      this.state.selectedReviewPeriod
    );
  }

  public handleChange = targetKeys => {
    this.setState({ targetKeys });
  }

  public render(): React.ReactElement<ILandingPageProps> {
    return (
      <div>
        <Dropdown
          placeHolder="Select Year"
          options={this.state.reviewPeriodOption}
          onChanged={this._onReviewPeriodSelected}
        />
        <Dropdown
          placeHolder="Select District"
          options={this.state.districtOption}
          onChanged={this._onDistrictSelected}
        />

        {/* <div style={{ display: "flex", alignItems: "stretch", height: "40px" }}>
          <CommandBarButton
            data-automation-id="test2"
            disabled={this.state.isGetBrigadeDisabled}
            //checked={checked}
            iconProps={{ iconName: "CheckList" }}
            text="Select Brigade"
            onClick={this._onGetBrigade}
          />
        </div> */}

        <Transfer
          dataSource={this.state.brigadeOption}
          showSearch
          listStyle={{
            width: 250,
            height: 300,
          }}
          operations={['Select', 'Remove']}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => `${item.title}`}

        />

        {/* <TextField
          //className={exampleChildClass}
          label="Filter by name:"
          onChanged={this._onChanged}
        />
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={this.state.brigadeOption}
            columns={[
              {
                key: "Brigade",
                name: "Brigade",
                fieldName: "brigadeName",
                minWidth: 100,
                maxWidth: 200,
                headerClassName: "detailListHeader",
                isResizable: true
              }
            ]}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"

          //onItemInvoked={this._onItemInvoked}    //This is for action Double click
          />
        </MarqueeSelection>*/}
        <PrimaryButton
          disabled={this.state.isCreateActionPlanButtonDisabled}
          //checked={false}
          text="I Want to Build an Action Plan"
          onClick={this._createActionPlan}
        />
      </div>
    );
  }
}
