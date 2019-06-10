import * as React from "react";

import {
  IReviewPeriod,
  ISolutionDropdownOption,
  IBrigadeDataListOption,
  IActionPlan, IActionPlanItem
} from "../../../../models/index";
import { IActionPlanPageProps, IActionPlanPageState } from "./index";
import { ActionPlanMasterList } from "../ActionPlanMasterList/index";
import { ActionPlanItemList } from "../ActionPlanItemList/index";
require("./ActionPlanPage.module.scss");
import { ABRService } from "../../../../services/ABRService";
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';


import MaterialTable from "material-table";
import { ResponsiveMode } from "office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode";
// import Select from '@material-ui/core/Select';
// import Input from '@material-ui/core/Input';
// import MenuItem from '@material-ui/core/MenuItem';


export class ActionPlanPage extends React.Component<
  IActionPlanPageProps,
  IActionPlanPageState
  > {
  private abrService = new ABRService();

  private selectedReviewID: string[] = [];
  private actionPlanDetail: IActionPlan[] = [];
  private actionPlanItemDetail: IActionPlanItem[] = [];
  private itemColumns: any[] = [];


  private ds_ratingOption: ISolutionDropdownOption[] = [];
  private ds_ViabilityOption: ISolutionDropdownOption[] = [];
  private ds_EndState: ISolutionDropdownOption[] = [];
  private ds_Brigade: ISolutionDropdownOption[] = [];
  private ds_Classification: ISolutionDropdownOption[] = [];



  constructor(props: IActionPlanPageProps) {
    super(props);

    let brigades: string[] = [];
    this.props.selectedBrigade.forEach(element => {
      brigades.push(element.key.toString());
    });

    this.ds_Brigade = this.props.selectedBrigade;

    this.state = {
      //From Parent
      reviewPeriod: this.props.reviewPeriod,
      masterRow: [],
      //filters
      s_EndState: [],
      s_ratingOption: [],
      s_Brigade: brigades,
      s_ViabilityOption: [],
      s_Classification: [],
      ////For Item List
      reviewIDs: [],
      DetailRow: [],
      itemSupportOption: [],
      itemPriorityOption: [],
      itemDueOption: [],
      itemStatusOption: [],
    };


  }
  public async componentDidMount(): Promise<void> {
    //Get Rating

    this.ds_ratingOption = await this.abrService._getRating();
    //this.state.s_ratingOption = ['Red', 'Amber'];
    this.setState({ s_ratingOption: ['Red', 'Amber'] });


    //Get Viability Category
    this.ds_ViabilityOption = await this.abrService._getViabilityCategoryOption();

    let s_ViabilityOption: string[] = [];
    this.ds_ViabilityOption.forEach(element => {
      s_ViabilityOption.push(element.key);
    });
    this.setState({ s_ViabilityOption });

    //Get Classification
    this.ds_Classification = await this.abrService._getClassificationOption();

    let s_Classification: string[] = [];
    this.ds_Classification.forEach(element => {
      s_Classification.push(element.key);
    });
    this.setState({ s_Classification });

    //Get Action Plan Master Detail
    this.actionPlanDetail = await this.abrService._getActionPlanMaster(
      this.props.reviewPeriod,
      this.props.selectedBrigade
    );

    //Get all selected reivewId
    this.actionPlanDetail.forEach(e => {
      this.selectedReviewID.push(e.reviewId);
    });

    //Get all Action Plan Item
    this.actionPlanItemDetail = await this.abrService._getActionPlanItem(
      this.props.selectedBrigade,
      this.selectedReviewID
    );

    //Get all end state
    this.actionPlanItemDetail.forEach(element => {
      this.ds_EndState.push({ key: element.endStateId, text: element.endState });
    });
    let endstate: string[] = [];
    this.ds_EndState.forEach(element => {
      endstate.push(element.key);
    });
    this.setState({ s_EndState: endstate });

    //Get All item list lookup field
    await this.abrService._getItemListOption();

    const headerProperties = { headerStyle: { backgroundColor: '#ff0000', color: '#ffffff', fontWeight: 'bold' as 'bold' } };
    //Render item list column
    this.itemColumns = [
      //{ field: "reviewId", title: "Review ID", editable: 'never', ...headerProperties },
      { field: "brigadeName", title: "Brigade Name", editable: 'never', ...headerProperties },
      { field: "endState", title: "End State", editable: 'never', ...headerProperties },
      { field: "viabilityCategory", title: "Viability Category", editable: 'never', ...headerProperties },
      { field: "subCategory", title: "Sub-Category", editable: 'never', ...headerProperties },
      { field: "rating", title: "Rating", editable: 'never', ...headerProperties },
      { field: "statementSelection", title: "Statement Selection", editable: 'never', ...headerProperties },
      {
        field: "treatment", title: "Treatment", editComponent: props => (
          <textarea
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            rows={4}
            cols={50}
          />), ...headerProperties
      },
      {
        field: "initiative", title: "Initiative", editComponent: props => (
          <textarea
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            rows={4}
            cols={50}
          />), ...headerProperties
      },
      { field: "supportRequired", title: "Support Required", lookup: this.abrService.supportOption, ...headerProperties },
      { field: "priority", title: "Priority", lookup: this.abrService.priorityOption, ...headerProperties },
      { field: "due", title: "Due", lookup: this.abrService.dueOption, ...headerProperties },
      { field: "status", title: "Status", lookup: this.abrService.statusOpion, ...headerProperties }

    ];

    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);

  }

  public _handleFilterUpdate(ratingOption: string[], brigade: string[], viabilityOption: string[], endState: string[], classification: string[]): void {

    let tempItemDetail: IActionPlanItem[] = [];
    let tempMasterDetail: IActionPlan[] = [];
    let s_ratingOption: string[] = ratingOption;
    let s_Brigade: string[] = brigade;
    let s_ViabilityOption: string[] = viabilityOption;
    let s_EndState: string[] = endState;
    let s_Classification: string[] = classification;


    this.actionPlanDetail.forEach(a => {
      if (
        s_Classification.indexOf(a.classification) !== -1
        && s_Brigade.indexOf(a.brigadeId) !== -1
      ) {
        tempMasterDetail.push(a);
      }
    });

    if (tempMasterDetail.length > 0) {

      this.actionPlanItemDetail.forEach(e => {

        if (
          s_ratingOption.indexOf(e.rating) !== -1
          && s_Brigade.indexOf(e.brigadeId) !== -1
          && s_ViabilityOption.indexOf(e.viabilityCategory) !== -1
          && s_EndState.indexOf(e.endStateId) !== -1
        ) {
          tempItemDetail.push(e);
        }

      });
    };

    this.setState(
      {
        masterRow: tempMasterDetail,
        DetailRow: tempItemDetail
      });
  }


  public _renderItemDetailTable(): object {
    return (
      <MaterialTable
        columns={this.itemColumns}
        data={this.state.DetailRow}
        title="Action Plan Item"
        options={{
          pageSize: 4,
          pageSizeOptions: [4, 8, 12]
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.state.DetailRow;
                  const index = data.indexOf(oldData);
                  data[index] = newData;
                  data[index].isUpdated = true;
                  this.setState({ DetailRow: data }, () => resolve());
                }
                resolve();
              }, 1000);
            })
        }}
      />
    );

  }

  public copyArray = (array: any[]): any[] => {
    const newArray: any[] = [];
    for (let i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
    return newArray;
  }

  public _onBrigadeChangeMultiSelect = (item: IDropdownOption): void => {

    const updatedSelectedItem = this.state.s_Brigade ? this.copyArray(this.state.s_Brigade) : [];
    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item.key);
    } else {
      // remove the option if it's unchecked
      const currIndex = updatedSelectedItem.indexOf(item.key.toString());
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }

    this.setState({ s_Brigade: updatedSelectedItem });
    this._handleFilterUpdate(this.state.s_ratingOption, updatedSelectedItem, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);
  }

  public _onRatingChangeMultiSelect = (item: IDropdownOption): void => {

    const updatedSelectedItem = this.state.s_ratingOption ? this.copyArray(this.state.s_ratingOption) : [];

    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item.key);
    } else {
      // remove the option if it's unchecked
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }

    this.setState({ s_ratingOption: updatedSelectedItem });
    this._handleFilterUpdate(updatedSelectedItem, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);

  }

  public _onVCategoryChange = (item: IDropdownOption): void => {
    const updatedSelectedItem = this.state.s_ViabilityOption ? this.copyArray(this.state.s_ViabilityOption) : [];

    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item.key);
    } else {
      // remove the option if it's unchecked
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }

    this.setState({ s_ViabilityOption: updatedSelectedItem });

    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, updatedSelectedItem, this.state.s_EndState, this.state.s_Classification);

  }

  public _onClassificationSelected = (item: IDropdownOption): void => {
    const updatedSelectedItem = this.state.s_Classification ? this.copyArray(this.state.s_Classification) : [];

    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item.key);
    } else {
      // remove the option if it's unchecked
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }
    this.setState({ s_Classification: updatedSelectedItem });

    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, updatedSelectedItem);

  }

  public _onEndStateSelected = (item: IDropdownOption): void => {
    const updatedSelectedItem = this.state.s_EndState ? this.copyArray(this.state.s_EndState) : [];

    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item.key);
    } else {
      // remove the option if it's unchecked
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }
    this.setState({ s_EndState: updatedSelectedItem });


    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, updatedSelectedItem, this.state.s_Classification);

  }

  public _renderFilterControls(): object {
    return (
      <div className="filterDiv">
        <div className="dd">
          <Dropdown
            label="Brigade"
            placeHolder="Please select Brigade"
            selectedKeys={this.state.s_Brigade}
            options={this.ds_Brigade}
            multiSelect
            onChanged={this._onBrigadeChangeMultiSelect}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Rating"
            placeHolder="Please select Rating"
            selectedKeys={this.state.s_ratingOption}
            options={this.ds_ratingOption}
            multiSelect
            onChanged={this._onRatingChangeMultiSelect}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Viability Category"
            placeHolder="Please Select Viability Category"
            selectedKeys={this.state.s_ViabilityOption}
            options={this.ds_ViabilityOption}
            multiSelect
            onChanged={this._onVCategoryChange}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="End State"
            placeHolder="End State (Question Ref)"
            selectedKeys={this.state.s_EndState}
            options={this.ds_EndState}
            multiSelect
            onChanged={this._onEndStateSelected}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Classification"
            placeHolder="Classification"
            options={this.ds_Classification}
            selectedKeys={this.state.s_Classification}
            multiSelect
            onChanged={this._onClassificationSelected}
          />
        </div>
      </div>
    );
  }

  public render(): React.ReactElement<IActionPlanPageProps> {
    return (
      <div className="ActionPlanPageContainer">
        {this._renderFilterControls()}
        <ActionPlanMasterList
          row={this.state.masterRow}
        />

        {this._renderItemDetailTable()}


        <div>
          <ButtonBase
            onClick={async () => {
              this.props.handleClose();
            }}
            className="cancelButton"
          >
            <Button variant="contained">
              Cancel
          </Button>
          </ButtonBase>
          <ButtonBase
            onClick={async () => {
              let newRow: IActionPlanItem[] = await this.abrService._saveActionPlanItems(this.state.DetailRow);
              this.setState({ DetailRow: newRow });
              this.props.handleClose();
            }}
            className="saveButton"
          >
            <Button variant="contained" color="primary">
              Save & Close
            </Button>
          </ButtonBase>
        </div>

      </div>
    );
  }

}
