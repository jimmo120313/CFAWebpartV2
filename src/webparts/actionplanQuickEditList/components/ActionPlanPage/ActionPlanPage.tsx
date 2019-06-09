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
  private supportOption: string[] = [];
  private priorityOption: string[] = [];
  private dueOption: string[] = [];
  private statusOption: string[] = [];
  private selectedReviewID: string[] = [];
  private actionPlanDetail: IActionPlan[];              ///const
  private actionPlanItemDetail: IActionPlanItem[];      ///const
  private itemColumns: any[] = [];
  private actionPlanItem: IActionPlanItem[];

  private ds_ratingOption: ISolutionDropdownOption[] = [];
  private ds_ViabilityOption: ISolutionDropdownOption[] = [];
  private ds_EndState: ISolutionDropdownOption[] = [];
  private ds_Brigade: ISolutionDropdownOption[] = [];
  private ds_Classification: ISolutionDropdownOption[] = [];
  private s_ratingOption: string[] = [];
  private s_Brigade: string[] = [];
  private s_ViabilityOption: string[] = [];
  //private s_EndState: string[] = [];
  private s_Classification: string[] = [];
  //Selected Option


  constructor(props: IActionPlanPageProps) {
    super(props);

    this.props.selectedBrigade.forEach(element => {
      this.s_Brigade.push(element.key);
    });

    this.ds_Brigade = this.props.selectedBrigade,

      this.state = {
        //From Parent
        reviewPeriod: this.props.reviewPeriod,
        masterRow: [],
        //filters
        s_EndState: [],
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
    this.s_ratingOption = ['Red', 'Amber'];


    //Get Viability Category
    this.ds_ViabilityOption = await this.abrService._getViabilityCategoryOption();

    this.ds_ViabilityOption.forEach(element => {
      this.s_ViabilityOption.push(element.key);
    });

    //Get Action Plan Master Detail
    this.actionPlanDetail = await this.abrService._getActionPlanMaster(
      this.props.reviewPeriod,
      this.props.selectedBrigade
    );

    //Get all selected reivewId
    this.actionPlanDetail.forEach(e => { this.selectedReviewID.push(e.reviewId); });


    //Get all Action Plan Item
    this.actionPlanItemDetail = await this.abrService._getActionPlanItem(
      this.props.reviewPeriod,
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

    //Render item list column
    this.itemColumns = [
      { field: "reviewId", title: "Review ID", editable: 'never' },
      { field: "brigadeName", title: "Brigade Name", editable: 'never' },
      { field: "endState", title: "End State", editable: 'never' },
      { field: "viabilityCategory", title: "Viability Category", editable: 'never' },
      { field: "subCategory", title: "Sub-Category", editable: 'never' },
      { field: "rating", title: "Rating", editable: 'never' },
      { field: "statementSelection", title: "Statement Selection", editable: 'never' },
      {
        field: "treatment", title: "Treatment", editComponent: props => (
          <textarea
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            rows={4}
            cols={50}
          />)
      },
      {
        field: "initiative", title: "Initiative", editComponent: props => (
          <textarea
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            rows={4}
            cols={50}
          />)
      },
      { field: "supportRequired", title: "Support Required", lookup: this.abrService.supportOption },
      { field: "priority", title: "Priority", lookup: this.abrService.priorityOption },
      { field: "due", title: "Due", lookup: this.abrService.dueOption },
      { field: "status", title: "Status", lookup: this.abrService.statusOpion }

    ];

    this._handleFilterUpdate();


  }

  public _handleFilterUpdate(): void {

    let tempItemDetail: IActionPlanItem[] = [];

    this.actionPlanItemDetail.forEach(e => {
      if (
        this.s_ratingOption.indexOf(e.rating) !== -1
        && this.s_Brigade.indexOf(e.brigadeId) !== -1
        && this.s_ViabilityOption.indexOf(e.viabilityCategory) !== -1
        && this.state.s_EndState.indexOf(e.endStateId) !== -1
      ) {
        tempItemDetail.push(e);
      }

    });

    this.setState(
      {
        masterRow: this.actionPlanDetail,
        DetailRow: tempItemDetail
      });
  }


  public _renderItemDetailTable(): object {
    return (
      <MaterialTable
        columns={this.itemColumns}
        data={this.state.DetailRow}
        title="Action Plan Item"
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

    const updatedSelectedItem = this.s_Brigade ? this.copyArray(this.s_Brigade) : [];
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

    this.s_Brigade = updatedSelectedItem;

  }


  public _onRatingChangeMultiSelect = (item: IDropdownOption): void => {

    const updatedSelectedItem = this.s_ratingOption ? this.copyArray(this.s_ratingOption) : [];

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

    this.s_ratingOption = updatedSelectedItem;

    this._handleFilterUpdate();

  }

  public _onVCategoryChange = (item: IDropdownOption): void => {
    const updatedSelectedItem = this.s_ViabilityOption ? this.copyArray(this.s_ViabilityOption) : [];

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

    this.s_ViabilityOption = updatedSelectedItem;

    this._handleFilterUpdate();

  }

  public _onClassificationSelected = (item: IDropdownOption): void => {
    const updatedSelectedItem = this.s_Classification ? this.copyArray(this.s_Classification) : [];

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

    this.s_Classification = updatedSelectedItem;

    this._handleFilterUpdate();

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
    this.setState({ s_EndState: updatedSelectedItem })


    this._handleFilterUpdate();

  }

  public _renderFilterControls(): object {
    return (
      <div className="filterDiv">
        <div className="dd">
          <Dropdown
            label="Brigade"
            placeHolder="Please select Brigade"
            selectedKeys={this.s_Brigade}
            options={this.ds_Brigade}
            multiSelect
            onChanged={this._onBrigadeChangeMultiSelect}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Rating"
            placeHolder="Please select Rating"
            selectedKeys={this.s_ratingOption}
            options={this.ds_ratingOption}
            multiSelect
            onChanged={this._onRatingChangeMultiSelect}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Viability Category"
            placeHolder="Please Select Viability Category"
            selectedKeys={this.s_ViabilityOption}
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
            selectedKeys={this.s_Classification}
            multiSelect
            onChanged={this._onClassificationSelected}
          />
        </div>
      </div>
    );
  }

  public render(): React.ReactElement<IActionPlanPageProps> {
    return (
      <div>
        {this._renderFilterControls()}
        <ActionPlanMasterList
          row={this.state.masterRow}
        />

        {this._renderItemDetailTable()}


        <div>
          <Button variant="contained" className="cancelButton">
            Default
          </Button>
          <ButtonBase
            onClick={async () => {
              let newRow: IActionPlanItem[] = await this.abrService._saveActionPlanItems(this.state.DetailRow);
              this.setState({ DetailRow: newRow });
              console.log(this.state.DetailRow);
            }}
          >
            <Button variant="contained" color="primary" className="saveButton">
              Primary
            </Button>
          </ButtonBase>
        </div>

      </div>
    );
  }

}
