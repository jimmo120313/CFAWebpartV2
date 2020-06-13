import * as React from "react";
import { IBulkUpdatePanelProp, IBulkUpdatePanelState } from "./index";
import { IActionPlanItem,ISolutionDropdownOption,IActionPlan } from "../../../../models/index";
import {FilterControls} from "../FilterControls/index";
import { ABRService,GeneralService,FilterLabel, } from "../../../../services/index";
import {ButtonBase,Button,Input,Select,MenuItem} from '@material-ui/core';
require("./BulkUpdatePanel.module.scss");
import { Dropdown, IDropdownOption,TextField,PrimaryButton, DefaultButton,Label,Panel,PanelType} from 'office-ui-fabric-react';



export class BulkUpdatePanel extends React.Component<
IBulkUpdatePanelProp,
IBulkUpdatePanelState
  > {


  private actionPlanItemService: ABRService = new ABRService();

  ////Selected Value
  // public s_EndState: string[];
  // public s_RatingOption: string[];
  // public s_Brigade: string[];
  // public s_ViabilityOption: string[];
  // public s_Classification: string[];

  //Items Detail
  public treatment: string;
  public initiative: string;
  public supportRequired: string[];
  public priority:string;
  public due:string;
  public actionStatus:string;


  constructor(props: IBulkUpdatePanelProp) {
    super(props);
   
    this.state = {
      s_EndState:this.props.ps_EndState,
      s_RatingOption:this.props.ps_RatingOption,
      s_Brigade:this.props.ps_Brigade,
      s_ViabilityOption:this.props.ps_ViabilityOption,
      s_Classification:this.props.ps_Classification,
      ds_AssignTo:[],
      ds_Priority:"",
      ds_ActionStatus:"",
      isPanelOpen:false

    };
    
  }
  
  public async componentDidMount(): Promise<void> {
    
    await this.actionPlanItemService._getItemListOption();
   
  }
  
  _syncSelectedOption = (label:string,sOption:string[]):void =>{
    
    switch(label) {
      case FilterLabel.Brigade:
        this.setState({s_Brigade: sOption});
        //this.s_Brigade = sOption;
        break;
      case FilterLabel.Rating:
        this.setState({s_RatingOption: sOption});
        //this.s_RatingOption = sOption; 
        break;
      case FilterLabel.Viability:
        this.setState({s_ViabilityOption: sOption});
        //this.s_ViabilityOption = sOption;
        break;
      case FilterLabel.EndState:
        this.setState({s_EndState: sOption});
        //this.s_EndState = sOption;
        break;
      case FilterLabel.Classification:
        this.setState({s_Classification: sOption});
        //this.s_Classification = sOption;
    
        break;  
      default:
        break;
        
  }
};

public _handleChangeAssignTo = (item:IDropdownOption):void =>{

  const updatedSelectedItem = this.state.ds_AssignTo ? GeneralService.copyArray(this.state.ds_AssignTo) : [];
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

  this.setState({ ds_AssignTo: updatedSelectedItem});
}

private  _BulkUpdate = async(api:IActionPlanItem[],ap:IActionPlan[]):Promise<void> =>{
  
  let filterdRecord = await this.actionPlanItemService._getFilteredActionPlanItem(ap,api,this.state.s_Brigade,this.state.s_EndState,this.state.s_RatingOption,this.state.s_ViabilityOption,this.state.s_Classification);
  
  await this.actionPlanItemService._bulkUpdateActionPlanItem(filterdRecord,this.treatment,this.initiative,this.state.ds_AssignTo,this.state.ds_Priority,this.due,this.state.ds_ActionStatus,this.props.siteURL)
  await this.props._refreshBulkUpdate;

  console.log("test321");
  this.setState({isPanelOpen:false});
  

}

private _onRenderFooterContent = ()=>{
  return(<div>
    <PrimaryButton className="PanelPrimButton" text="Save" onClick={()=>this._BulkUpdate(this.props.actionPlanItemDetail,this.props.actionPlan)}  disabled={false}/>
    <DefaultButton className="PanelDefButton" text="Close" onClick={this._closePanel}  disabled={false} />
   </div>)
    
}

private _openPanel = () => {
  this.setState({isPanelOpen: true,s_EndState:this.props.ps_EndState,
      s_RatingOption:this.props.ps_RatingOption,
      s_Brigade:this.props.ps_Brigade,
      s_ViabilityOption:this.props.ps_ViabilityOption,
      s_Classification:this.props.ps_Classification});
}

private _closePanel = () => {
  this.setState({isPanelOpen: false});
}

  public render(): React.ReactElement<IBulkUpdatePanelProp> {


      return (
        <React.Fragment>
            <ButtonBase
          onClick={this._openPanel}
          className="bulkUpdateButton"
        >
          <Button variant="outlined" color="secondary" size="medium">
            Bulk Update
          </Button>
        </ButtonBase>
          <Panel
                isOpen={this.state.isPanelOpen}
                onDismiss={this._closePanel}
                type={PanelType.large}
                closeButtonAriaLabel="Close"
                onRenderFooterContent={this._onRenderFooterContent}
                isFooterAtBottom={true}
              >
            <FilterControls 
              EndState = {this.props.EndState}
              RatingOption = {this.props.RatingOption}
              Brigade = {this.props.Brigade}
              ViabilityOption = {this.props.ViabilityOption}
              Classification = {this.props.Classification}

              p_EndStateChecked = {this.props.p_EndStateChecked}
              p_RatingOptionChecked = {this.props.p_RatingOptionChecked}
              p_BrigadeChecked = {this.props.p_BrigadeChecked}
              p_ViabilityChecked = {this.props.p_ViabilityChecked}
              p_ClasifiChecked = {this.props.p_ClasifiChecked}

              ps_EndState = {this.props.ps_EndState}
              ps_RatingOption = {this.props.ps_RatingOption}
              ps_Brigade = {this.props.ps_Brigade}
              ps_ViabilityOption = {this.props.ps_ViabilityOption}
              ps_Classification = {this.props.ps_Classification}
              _syncSelectedOption = {this._syncSelectedOption}
            />
            {/* Treatment */}
            <div>
            <TextField 
               label="Treatment" 
               onChange={(e,v) => this.treatment=v}
               multiline
               rows={4}
               cols={100}
            />
            
            </div>
            {/* Initiative */}
            <div>
            <TextField 
               label="Initiative" 
               onChange={(e,v) => this.initiative=v}
               multiline
               rows={4}
               cols={100}
            />
            
            </div>
            {/* Suppport Required */}
            <div>
            <Dropdown
              label = "Support Required"
              placeHolder="Please select Required"
              selectedKeys={this.state.ds_AssignTo}
              options={ this.props.supportOption}
              multiSelect
              onChanged={(e)=>{this._handleChangeAssignTo(e);}}
           />
           </div>
           {/* Priority*/}
           <div>
            <Dropdown
              placeHolder="Please select Required"
              label="Priority"
              options={ this.props.priorityOption}
              onChanged={(e)=>{this.setState({ds_Priority:e.text});}}
           />
           </div>
           {/* Due*/}
           <div>
           <Label className={"PanelLabel"}>Due</Label>
           <input 
              className = "dateInput"
              type="Date" 
              //value={GeneralService._getISODateStringFormat(props.value)} 
              onChange={e => this.due = GeneralService._getAUDateStringFormat(e.target.value)} 
              name="bday" 
          />
          </div>
          {/* ActionSatus*/}
          <div>
            <Dropdown
              placeHolder="Please select Required"
              label="Action Status"
              options={ this.props.actionStatus}
              onChanged={(e)=>{this.setState({ds_ActionStatus:e.text});}}
           />
           </div>
           
           </Panel>

        </React.Fragment>
          
        
        
      );
    }

}
