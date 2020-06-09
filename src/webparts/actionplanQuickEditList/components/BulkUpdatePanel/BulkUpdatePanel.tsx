import * as React from "react";
import { IBulkUpdatePanelProp, IBulkUpdatePanelState } from "./index";
import { IActionPlanItem,ISolutionDropdownOption } from "../../../../models/index";
import {FilterControls} from "../FilterControls/index";
import { ABRService,GeneralService,FilterLabel } from "../../../../services/index";
import MaterialTable from "material-table";
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';  
require("./BulkUpdatePanel.module.scss");
import { Dropdown, IDropdownOption,Checkbox,TextField,PrimaryButton, DefaultButton,Label} from 'office-ui-fabric-react';



export class BulkUpdatePanel extends React.Component<
IBulkUpdatePanelProp,
IBulkUpdatePanelState
  > {


  private actionPlanItemService: ABRService = new ABRService();

  ////Selected Value
  private s_EndState: string[];
  private s_RatingOption: string[];
  private s_Brigade: string[];
  private s_ViabilityOption: string[];
  private s_Classification: string[];

  //Items Detail
  private treatment: string;
  private initiative: string;
  private supportRequired: string[];
  private priority:string;
  private due:string;
  private actionStatus:string;


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
      ds_ActionStatus:""
    };
    
  }
  
  public async componentDidMount(): Promise<void> {
    
    await this.actionPlanItemService._getItemListOption();
    
  }
  
  _syncSelectedOption = (label:string,sOption:string[]):void =>{
    
    switch(label) {
      case FilterLabel.Brigade:
        //this.setState({s_Brigade: sOption});
        this.s_Brigade = sOption;
        break;
      case FilterLabel.Rating:
        //this.setState({s_RatingOption: sOption});
        this.s_RatingOption = sOption; 
        break;
      case FilterLabel.Viability:
        //this.setState({s_ViabilityOption: sOption});
        this.s_ViabilityOption = sOption;
        break;
      case FilterLabel.EndState:
        //this.setState({s_EndState: sOption});
        this.s_EndState = sOption;
        break;
      case FilterLabel.Classification:
        //this.setState({s_Classification: sOption});
        this.s_Classification = sOption;
    
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

public _dismissClick = ()=>{
  debugger;
  this.props.dismissPanel;

}

  public render(): React.ReactElement<IBulkUpdatePanelProp> {


      return (
        <React.Fragment>
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
              //onChanged={(e)=>{this.setState({ds_Priority:e.text});}}
           />
           </div>
           {/* Due*/}
           <div>
           <Label className={"PanelLabel"}>Due</Label>
           <input 
              
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
           {/* <div>
            <PrimaryButton className="PanelPrimButton" text="Save" onClick={this._dismissClick}  disabled={false}/>
            <DefaultButton className="PanelDefButton" text="Close" onClick={()=>this.props.dismissPanel}  disabled={false} />
           </div> */}
           
        </React.Fragment>
        
      );
    }

}
