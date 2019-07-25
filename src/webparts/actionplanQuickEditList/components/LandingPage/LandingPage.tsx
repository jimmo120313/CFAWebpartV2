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
      ._getBrigadeOption(this.state.selectedDistrict, this.state.selectedReviewPeriod)
      .then((brigadeOption: IBrigadeDataListOption[]) => {
        this._allBrigadeOption = brigadeOption;
        this.setState({ brigadeOption: this._allBrigadeOption });
      })
      .catch(e => {
        console.log(e);
      });
  }

  private _onDistrictSelected = async (item: IDropdownOption): Promise<void> => {

    if (this.state.selectedReviewPeriod) {
      let bOption = new ABRService();
      bOption
        ._getBrigadeOption(item.text, this.state.selectedReviewPeriod)
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
  }

  private _onReviewPeriodSelected = async (item: IDropdownOption): Promise<void> => {
    this.setState({ selectedReviewPeriod: item.text });

    if (this.state.selectedDistrict) {
      let bOption = new ABRService();
      bOption
        ._getBrigadeOption(this.state.selectedDistrict, item.text)
        .then((brigadeOption: IBrigadeDataListOption[]) => {
          this.setState({
            brigadeOption: brigadeOption,
            selectedDistrict: this.state.selectedDistrict,
            selectedBrigade: [],
            targetKeys: []
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  private _createActionPlan = (): void => {
    let selectedBrigade: ISolutionDropdownOption[] = [];

    this.state.targetKeys.forEach(k => {
      let result = this.state.brigadeOption.filter((f) => f.key === k)[0];
      selectedBrigade.push({ key: result.description.toString(), text: result.title });
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
      <div className="middleAlignDD">
        <div className="controlWidth" >
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
        </div>

        <Transfer
          dataSource={this.state.brigadeOption}
          showSearch
          className={"middleAlignTransfer"}
          listStyle={{
            width: 250,
            height: 300,
          }}
          operations={['Select  ', 'Remove']}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => `${item.title}`}

        />

        <div className='controlWidth'>
          <PrimaryButton
            disabled={this.state.targetKeys.length == 0}
            //checked={false}
            text="I Want to Build an Action Plan"
            onClick={this._createActionPlan}
            className={this.state.targetKeys.length == 0 ? "buttonD" : "button"}
          />
        </div>
      </div>
    );
  }
}
