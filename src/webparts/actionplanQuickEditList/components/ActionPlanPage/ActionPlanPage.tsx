import * as React from "react";

import {
  ISolutionDropdownOption,
  IActionPlan, IActionPlanItem
} from "../../../../models/index";
import { IActionPlanPageProps, IActionPlanPageState } from "./index";
import { ActionPlanMasterList } from "../ActionPlanMasterList/index";

require("./ActionPlanPage.module.scss");
import { ABRService } from "../../../../services/ABRService";
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import MaterialTable from "material-table";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';

import * as moment from 'moment';



export class ActionPlanPage extends React.Component<
  IActionPlanPageProps,
  IActionPlanPageState
  > {
  private abrService = new ABRService();

  private selectedReviewID: string[] = [];
  private actionPlanDetail: IActionPlan[] = [];
  private actionPlanItemDetail: IActionPlanItem[] = [];
  private itemColumns: any[] = [];
  private isSave: boolean = false;


  private ds_ratingOption: ISolutionDropdownOption[] = [];
  private ds_ViabilityOption: ISolutionDropdownOption[] = [];
  private ds_EndState: ISolutionDropdownOption[] = [];
  private ds_Brigade: ISolutionDropdownOption[] = [];
  private ds_Classification: ISolutionDropdownOption[] = [];

  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }



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
      f_EndState: [],
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
      isLoading: true,
      hideDialog: true,
      //For Filter check box
      isClassificationChecked: true,
      isBrigadeChecked: true,
      isRatingChecked: false,
      isViabilityCategoryChecked: true,
      isEndStateChecked: true
    };


  }
  public async componentDidMount(): Promise<void> {

    //Get Rating
    this.ds_ratingOption = await this.abrService._getRating();
    //this.state.s_ratingOption = ['Red', 'Amber'];
    this.setState({ s_ratingOption: ['Red', 'Amber'] });


    //Get Viability Category
    this.ds_ViabilityOption = await this.abrService._getViabilityCategoryOption();

    //TODO how to call Check all Method instead of duplicate same code
    let s_ViabilityOption: string[] = [];
    this.ds_ViabilityOption.forEach(element => {
      s_ViabilityOption.push(element.key);
    });
    this.setState({ s_ViabilityOption });

    //Get Classification
    this.ds_Classification = await this.abrService._getClassificationOption();

    //TODO how to call Check all Method instead of duplicate same code
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
    this.setState({ s_EndState: endstate, f_EndState: this.ds_EndState });

    //Get All item list lookup field
    await this.abrService._getItemListOption();

    const headerProperties = { headerStyle: { backgroundColor: '#E31A1A', color: '#ffffff', fontWeight: 'bold' as 'bold', paddingLeft: '5px', paddingRight: '20px', fontSize: '14px' } };
    const cellProps = { paddingLeft: '5px', paddingRight: '8px', fontSize: '14px' };
    //Render item list column
    this.itemColumns = [

      //{ field: "reviewId", title: "Review ID", editable: 'never', ...headerProperties },
      { field: "brigadeName", cellStyle: { ...cellProps }, title: "Brigade Name", editable: 'never', ...headerProperties },
      //{ field: "endState", cellStyle: { ...cellProps }, title: "End State", editable: 'never', ...headerProperties },
      { field: "questionReference", cellStyle: { ...cellProps }, title: "Ref Number", editable: 'never', ...headerProperties },
      { field: "viabilityCategory", cellStyle: { ...cellProps }, title: "Viability Category", editable: 'never', ...headerProperties },
      { field: "subCategory", cellStyle: { ...cellProps }, title: "Sub-Category", editable: 'never', ...headerProperties },
      { field: "rating", cellStyle: { ...cellProps }, title: "Rating", editable: 'never', ...headerProperties },
      { field: "statementSelection", cellStyle: { ...cellProps }, title: "Statement Selection", editable: 'never', ...headerProperties },
      { field: "abrComment", cellStyle: { ...cellProps }, title: "ABR Comments", editable: 'never', ...headerProperties },

      {
        field: "treatment", cellStyle: { ...cellProps }, title: "Treatment", editComponent: props => (
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
          />), cellStyle: { ...cellProps }, ...headerProperties
      },
      { field: "supportRequired", cellStyle: { ...cellProps }, title: "Support Required", lookup: this.abrService.supportOption, ...headerProperties },
      { field: "priority", cellStyle: { ...cellProps }, title: "Priority", lookup: this.abrService.priorityOption, ...headerProperties },
      //{ field: "due", cellStyle: { ...cellProps }, title: "Due", lookup: this.abrService.dueOption, ...headerProperties },
    //{ field: "due", cellStyle: { ...cellProps }, title: "Due", ...headerProperties, render: rowData => {rowData.due ? <input type="string" value={moment(rowData.due, "YYYY/MM/DD").format("DD/MM/YYYY")} className="readDate" readOnly style={{ border: 'none' }} /> : <label />}, editComponent: props => <input type="date" value={props.value} onChange={e => props.onChange(e.target.value)} name="bday" /> },
      { field: "due", cellStyle: { ...cellProps },type:'Date', title: "Due", ...headerProperties, render: rowData => rowData.due,editComponent: props => <input type="Date" value={this._getISODateStringFormat(props.value)} onChange={e => {props.onChange(this._getAUDateStringFormat(e.target.value))}} name="bday" /> },  
    //{ field: "due", cellStyle: { ...cellProps }, title: "Due", ...headerProperties, render: rowData => <DatePicker format={'DD/MM/YYYY'} /> },
      { field: "status", cellStyle: { ...cellProps }, title: "Action Status", lookup: this.abrService.statusOpion, ...headerProperties }

    ];

    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);
  }

  public _handleFilterUpdate(ratingOption: string[], brigade: string[], viabilityOption: string[], endState: string[], classification: string[], isViabilityChanged: boolean = false): void {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
    }

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
        if (!isViabilityChanged) {
          if (
            s_ratingOption.indexOf(e.rating) !== -1
            && s_Brigade.indexOf(e.brigadeId) !== -1
            && s_ViabilityOption.indexOf(e.viabilityCategory) !== -1
            && s_EndState.indexOf(e.endStateId) !== -1

          ) {
            tempItemDetail.push(e);
          }
        } else {
          if (
            s_ratingOption.indexOf(e.rating) !== -1
            && s_Brigade.indexOf(e.brigadeId) !== -1
            && s_ViabilityOption.indexOf(e.viabilityCategory) !== -1

          ) {
            tempItemDetail.push(e);
          }
        }

      });
    }

    if (isViabilityChanged) {
      let EndStates: ISolutionDropdownOption[] = [];
      let selectedEndStates: string[] = [];
      tempItemDetail.forEach(element => {
        if (viabilityOption.indexOf(element.viabilityCategory) > -1) {
          EndStates.push({ key: element.endStateId, text: element.endState });
        }
      });


      EndStates.forEach(element => {
        selectedEndStates.push(element.key);
      });

      this.setState(
        {
          masterRow: tempMasterDetail,
          DetailRow: tempItemDetail,
          f_EndState: EndStates,
          s_EndState: selectedEndStates,
          isLoading: false
        });

    } else {
      this.setState(
        {
          masterRow: tempMasterDetail,
          DetailRow: tempItemDetail,
          isLoading: false
        });
    }

  }

  public _getISODateStringFormat(date:string):string {
    let dateString:any;
    date = date.replace(/-/g,"/");
    
    
    let d =""
    if(date && date.split("/")[2].toString().length==4){
      d = date.split("/")[2] + "/" + date.split("/")[1] + "/" + date.split("/")[0]
      dateString = new Date(d)
    }else{
      dateString = new Date(date)
    }
    
    let month = dateString.getMonth() + 1;
    let day = dateString.getDate();
    let year = dateString.getFullYear();
    let finalResult = year + "-" + (month.toString().length==1?"0"+month:month)+ "-" + day;

    return finalResult;
  }
  public _getAUDateStringFormat(date:string):string {
    
    date = date.replace(/-/g,"/");
    
    console.log(date);
    let d =""
    if(date && date.split("/")[0].toString().length==4){
      d = date.split("/")[2] + "/" + date.split("/")[1] + "/" + date.split("/")[0]
    }

    return d;
  }
  public _renderItemDetailTable(): object {
    return (
      <MaterialTable
        columns={this.itemColumns}
        data={this.state.DetailRow}
        title="Action Plan Items"
        options={{
          pageSize: 4,
          pageSizeOptions: [4, 8, 12],
          actionsCellStyle: { fontWeight: 'bold' },
          search: false
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
        localization={{
          header: {
            actions: 'Edit & Save'

          },
          body: {
            editRow: {
              cancelTooltip: 'Cancel',
              saveTooltip: 'Save'
            }
          }


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
    let isAllBrigadeChecked = this.ds_Brigade.length === updatedSelectedItem.length ? true : false;
    this.setState({ s_Brigade: updatedSelectedItem, isBrigadeChecked: isAllBrigadeChecked });
    this._handleFilterUpdate(this.state.s_ratingOption, updatedSelectedItem, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);
  }

  public _selectRemoveAllBrigade = (ev: React.FormEvent<HTMLElement>, isBrigadeChecked: boolean): void => {

    let Brigade: string[] = [];
    if (isBrigadeChecked) {
      this.ds_Brigade.forEach(element => {
        Brigade.push(element.key);
      });
    }

    let isAllBrigadeChecked = this.ds_Brigade.length === Brigade.length ? true : false;

    this.setState({ s_Brigade: Brigade, isBrigadeChecked: isAllBrigadeChecked });
    this._handleFilterUpdate(this.state.s_ratingOption, Brigade, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);
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

    let isAllRatingChecked = this.ds_Classification.length === updatedSelectedItem.length ? true : false;
    this.setState({ s_ratingOption: updatedSelectedItem, isRatingChecked: isAllRatingChecked });
    this._handleFilterUpdate(updatedSelectedItem, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);

  }

  public _selectRemoveAllRating = (ev: React.FormEvent<HTMLElement>, isRatingChecked: boolean): void => {

    let Rating: string[] = [];
    if (isRatingChecked) {
      this.ds_ratingOption.forEach(element => {
        Rating.push(element.key);
      });
    }

    let isAllRatingChecked = this.ds_ratingOption.length === Rating.length ? true : false;

    this.setState({ s_ratingOption: Rating, isRatingChecked: isAllRatingChecked });
    this._handleFilterUpdate(Rating, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, this.state.s_Classification);
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

    let isAllViabilityCategoryChecked = this.ds_ViabilityOption.length === updatedSelectedItem.length ? true : false;
    this.setState({ s_ViabilityOption: updatedSelectedItem, isViabilityCategoryChecked: isAllViabilityCategoryChecked });
    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, updatedSelectedItem, this.state.s_EndState, this.state.s_Classification, true);

  }

  public _selectRemoveAllViabilityCategory = (ev: React.FormEvent<HTMLElement>, isViabilityCategoryChecked: boolean): void => {

    let ViabilityCategory: string[] = [];
    if (isViabilityCategoryChecked) {
      this.ds_ViabilityOption.forEach(element => {
        ViabilityCategory.push(element.key);
      });
    }

    let isAllViabilityCategoryChecked = this.ds_ViabilityOption.length === ViabilityCategory.length ? true : false;

    this.setState({ s_ViabilityOption: ViabilityCategory, isViabilityCategoryChecked: isAllViabilityCategoryChecked, isEndStateChecked: true });
    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, ViabilityCategory, this.state.s_EndState, this.state.s_Classification, true);
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
    let isAllClassificationChecked = this.ds_Classification.length === updatedSelectedItem.length ? true : false;

    this.setState({ s_Classification: updatedSelectedItem, isClassificationChecked: isAllClassificationChecked });

    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, updatedSelectedItem);

  }

  public _selectRemoveAllClassification = (ev: React.FormEvent<HTMLElement>, isClassificationChecked: boolean): void => {

    let Classification: string[] = [];
    if (isClassificationChecked) {
      this.ds_Classification.forEach(element => {
        Classification.push(element.key);
      });
    }

    let isAllClassificationChecked = this.ds_Classification.length === Classification.length ? true : false;

    this.setState({ s_Classification: Classification, isClassificationChecked: isAllClassificationChecked });
    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, this.state.s_EndState, Classification);
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
    let isAllEndStateChecked = this.state.f_EndState.length === updatedSelectedItem.length ? true : false;
    this.setState({ s_EndState: updatedSelectedItem, isEndStateChecked: isAllEndStateChecked });

    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, updatedSelectedItem, this.state.s_Classification);

  }

  public _selectRemoveAllEndState = (ev: React.FormEvent<HTMLElement>, isEndStateChecked: boolean): void => {

    let EndState: string[] = [];
    if (isEndStateChecked) {
      this.state.f_EndState.forEach(element => {
        EndState.push(element.key);
      });
    }

    let isAllEndStateChecked = this.state.f_EndState.length === EndState.length ? true : false;

    this.setState({ s_EndState: EndState, isEndStateChecked: isAllEndStateChecked });
    this._handleFilterUpdate(this.state.s_ratingOption, this.state.s_Brigade, this.state.s_ViabilityOption, EndState, this.state.s_Classification);
  }


  public _renderFilterControls(): object {
    return (
      <div className="filterDiv">
        <div className="ddBrigade">
          <Checkbox label="Brigade" className="cb" onChange={this._selectRemoveAllBrigade} defaultChecked={true} checked={this.state.isBrigadeChecked} />
          <Dropdown
            // label="Brigade"
            className="labelStyle"
            placeHolder="Please select Brigade"
            selectedKeys={this.state.s_Brigade}
            options={this.ds_Brigade}
            multiSelect
            onChanged={this._onBrigadeChangeMultiSelect}
          />
        </div>
        <div className="ddRating">
          <Checkbox label="Rating" className="cb" onChange={this._selectRemoveAllRating} defaultChecked={false} checked={this.state.isRatingChecked} />
          <Dropdown
            //label="Rating"
            placeHolder="Please select Rating"
            selectedKeys={this.state.s_ratingOption}
            options={this.ds_ratingOption}
            multiSelect
            onChanged={this._onRatingChangeMultiSelect}
          />
        </div>
        <div className="ddViability">
          < Checkbox label="Viability Category" className="cb" onChange={this._selectRemoveAllViabilityCategory} defaultChecked={true} checked={this.state.isViabilityCategoryChecked} />
          <Dropdown
            //label="Viability Category"
            placeHolder="Please Select Viability Category"
            selectedKeys={this.state.s_ViabilityOption}
            options={this.ds_ViabilityOption}
            multiSelect
            onChanged={this._onVCategoryChange}
          />
        </div>
        <div className="ddEndState">
          <Checkbox label="End State" className="cb" onChange={this._selectRemoveAllEndState} defaultChecked={true} checked={this.state.isEndStateChecked} />
          <Dropdown
            //label="End State"
            placeHolder="End State (Question Ref)"
            selectedKeys={this.state.s_EndState}
            options={this.state.f_EndState}
            multiSelect
            onChanged={this._onEndStateSelected}

          />
        </div>
        <div className="ddClassification">
          <Checkbox label="Classification" className="cb" onChange={this._selectRemoveAllClassification} defaultChecked={true} checked={this.state.isClassificationChecked} />
          <Dropdown
            //label="Classification"
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

  private _refreshMasterList = async (): Promise<void> => {
    //Refresh Master List

    let newAllActionPlanDetail: IActionPlan[] = [];
    let service = new ABRService();
    newAllActionPlanDetail = await service._getActionPlanMaster(
      this.props.reviewPeriod,
      this.props.selectedBrigade
    );
    let newFielteredMasterDetail: IActionPlan[] = [];

    newAllActionPlanDetail.forEach(a => {
      if (
        this.state.s_Classification.indexOf(a.classification) !== -1
        && this.state.s_Brigade.indexOf(a.brigadeId) !== -1
      ) {
        newFielteredMasterDetail.push(a);
      }
    });
    //End
    this.setState({ masterRow: newFielteredMasterDetail });

  }

  private _saveChange = async (): Promise<void> => {
    this.isSave = true;

    this.setState({ isLoading: true });

    let newRow: IActionPlanItem[] = await this.abrService._saveActionPlanItems(this.state.DetailRow, this.props.siteURL);

    await this._refreshMasterList();

    this.setState({ DetailRow: newRow, hideDialog: true, isLoading: false });
    this.isSave = false;

  }
  public render(): React.ReactElement<IActionPlanPageProps> {
    if (this.state.isLoading) {
      return (this.isSave ? <Spinner label="Saving Action Plan Data..." size={SpinnerSize.large} /> : <Spinner label="Loading Action Plan Data..." size={SpinnerSize.large} />);

    } else {
      return (
        <div className="ActionPlanPageContainer">
          {/* <ButtonBase
            onClick={async () => {
              this._refreshMasterList();
            }}

          >
            <Button variant="contained" size="large">
              Refresh
            </Button>
          </ButtonBase> */}
          <ActionPlanMasterList
            row={this.state.masterRow}
          />
          {this._renderFilterControls()}
          {this._renderItemDetailTable()}


          <div>
            <ButtonBase
              onClick={async () => {
                this.props.handleClose();
              }}
              className="cancelButton"
            >
              <Button variant="contained" size="large">
                CLOSE
            </Button>
            </ButtonBase>
            <ButtonBase
              onClick={this._showDialog}
              className="saveButton"
            >
              <Button variant="contained" color="primary" size="large">
                SAVE MY WORK SO FAR
              </Button>
            </ButtonBase>
            <Dialog
              hidden={this.state.hideDialog}
              onDismiss={this._closeDialog}
              dialogContentProps={{
                type: DialogType.normal,
                title: 'Save Change to Action Plan',
                subText: 'Do you want to save all the changes?'
              }}
              modalProps={{
                isBlocking: true
              }}
            >
              <DialogFooter>
                <PrimaryButton className="bSave" onClick={this._saveChange} text="Save" />
                <DefaultButton className="bClose" onClick={this._closeDialog} text="Cancel" />
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      );
    }
  }

}
