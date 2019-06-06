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
  private actionPlanDetail: IActionPlan[];
  private actionPlanItemDetail: IActionPlanItem[];
  private itemColumns: any[] = [];
  private actionPlanItem: IActionPlanItem[];

  private iniBrigadeKeyArray: string[] = [];
  private iniRatingKeyArray: string[] = [];

  constructor(props: IActionPlanPageProps) {
    super(props);

    this.props.selectedBrigade.forEach(element => {
      this.iniBrigadeKeyArray.push(element.key);
    });


    this.state = {
      //From Parent
      reviewPeriod: this.props.reviewPeriod,

      //For Filter DataSource
      ds_Brigade: this.props.selectedBrigade,
      ds_ratingOption: [],
      ds_ViabilityOption: [],
      ds_EndState: [],
      ds_Classification: [],
      //Selected Option
      s_Brigade: this.iniBrigadeKeyArray,
      s_ratingOption: [],
      s_ViabilityOption: "",
      s_EndState: "",
      s_Classification: "",

      //For Master List
      masterRow: [],

      ////For Item List
      reviewIDs: [],
      DetailRow: [],
      itemSupportOption: [],
      itemPriorityOption: [],
      itemDueOption: [],
      itemStatusOption: [],
    };
    console.log(this.state.reviewPeriod);
    console.log(this.state.ds_Brigade);
    console.log(this.state.s_Brigade);

  }
  public async componentDidMount(): Promise<void> {
    //Get Rating
    let rating = await this.abrService._getRating();

    this.iniRatingKeyArray = ['1', '2'];
    this.setState({ ds_ratingOption: rating, s_ratingOption: this.iniRatingKeyArray });

    //Get Viability Category
    this.abrService
      ._getViabilityCategoryOption()
      .then((option: ISolutionDropdownOption[]) => {
        this.setState({ ds_ViabilityOption: option });
      });

    this.actionPlanDetail = await this.abrService._getActionPlanMaster(
      this.props.reviewPeriod,
      this.props.selectedBrigade
    );

    //Get all selecte reivewId
    this.actionPlanDetail.forEach(e => { this.selectedReviewID.push(e.reviewId); });

    this.actionPlanItemDetail = await this.abrService._getActionPlanItem(
      this.props.reviewPeriod,
      this.props.selectedBrigade,
      this.selectedReviewID
    );

    await this.abrService._getItemListOption();


    this.itemColumns = [
      { field: "reviewId", title: "Review ID", editable: 'never' },
      { field: "brigadeName", title: "Brigade Name", editable: 'never' },
      { field: "endState", title: "End State", editable: 'never' },
      { field: "viability", title: "Viability Category", editable: 'never' },
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

    this.setState({ masterRow: this.actionPlanDetail, DetailRow: this.actionPlanItemDetail });

  }

  public _handleItemListUpdate(): void {

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
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }
    this.setState({
      s_Brigade: updatedSelectedItem
    });
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
    this.setState({
      s_ratingOption: updatedSelectedItem
    });
  }

  public _renderFilterControls(): object {
    return (
      <div className="filterDiv">
        <div className="dd">
          <Dropdown
            label="Brigade"
            placeHolder="Brigade (Multi Select)"
            selectedKeys={this.state.s_Brigade}
            options={this.state.ds_Brigade}
            multiSelect
            onChanged={this._onBrigadeChangeMultiSelect}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Rating"
            placeHolder="Rating (Multi Select)"
            selectedKeys={this.state.s_ratingOption}
            options={this.state.ds_ratingOption}
            multiSelect
            onChanged={this._onRatingChangeMultiSelect}
          />
        </div>
        <div className="dd">
          <Dropdown
            label="Viability Category"
            placeHolder="Viability Category"
            options={this.state.ds_ViabilityOption}
            responsiveMode={ResponsiveMode.large}
            onChanged={(item: IDropdownOption) => { this.setState({ s_ViabilityOption: item.text }); }}
          />
        </div>





        {/* <Dropdown
          label="End State"
          placeHolder="End State (Question Ref)"
          options={this.state.s_EndState}
        //onChanged={this._onDistrictSelected}
        />
        <Dropdown
          label="Classification"
          placeHolder="Classification"
          defaultSelectedKeys={['GG', 'FF']}
          multiSelect
          options={this.state.s_Classification}
          className="dd"
        />  */}
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

        {/* <ActionPlanItemList
          selectedBrigade={this.state.selectedBrigade}
          reviewPeriod={this.state.reviewPeriod}
          fRating={this.state.ratingOption}
          fVCategory={this.state.ViabilityOption}
          fEndState={this.state.EndState}
          fClassification={this.state.Classification}
          row={this.state.DetailRow}
        /> */}
      </div>
    );
  }
}
