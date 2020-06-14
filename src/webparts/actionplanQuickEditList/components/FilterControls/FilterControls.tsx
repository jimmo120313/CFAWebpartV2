import * as React from "react";
import { IFilterControlsProp, IFilterControlsState } from "./index";
import { IActionPlanItem,ISolutionDropdownOption } from "../../../../models/index";
import { ABRService,GeneralService,FilterLabel } from "../../../../services/index";

import { Dropdown, IDropdownOption,Checkbox } from 'office-ui-fabric-react';



export class FilterControls extends React.Component<
IFilterControlsProp,
IFilterControlsState
  > {


  private actionPlanItemService: ABRService = new ABRService();

  //Selected Value
  private s_EndState: string[];
  private s_RatingOption: string[];
  private s_Brigade: string[];
  private s_ViabilityOption: string[];
  private s_Classification: string[];


  constructor(props: IFilterControlsProp) {
    super(props);
   
    this.state = {
      isEndStateChecked:this.props.p_EndStateChecked,
      isRatingOptionChecked : this.props.p_RatingOptionChecked,
      isBrigadeChecked : this.props.p_BrigadeChecked,
      isViabilityChecked : this.props.p_ViabilityChecked,
      isClasifiChecked : this.props.p_ClasifiChecked
    };
    

    this.s_EndState = this.props.ps_EndState;
    this.s_RatingOption = this.props.ps_RatingOption;
    this.s_Brigade = this.props.ps_Brigade;
    this.s_ViabilityOption = this.props.ps_ViabilityOption;
    this.s_Classification = this.props.ps_Classification;

  }
  public async componentDidMount(): Promise<void> {

    await this.actionPlanItemService._getItemListOption();
  
  }

  private _selectRemoveOption = (ev: React.FormEvent<HTMLElement>, isChecked: boolean, prop: ISolutionDropdownOption[],optionName:string): void => {
   
    let Option: string[] = [];
    if (isChecked) {
      prop.forEach(element => {
        Option.push(element.key);
      });
    }
    
    switch(optionName) {
      case FilterLabel.Brigade:
        this.props._syncSelectedOption(FilterLabel.Brigade,Option);
        this.setState({isBrigadeChecked:this.props.Brigade.length === Option.length ? true : false});
        this.s_Brigade = Option;
    
        break;
      case FilterLabel.Rating:
        this.setState({isRatingOptionChecked:this.props.RatingOption.length === Option.length ? true : false});
        this.s_RatingOption = Option;
        this.props._syncSelectedOption(FilterLabel.Rating,Option);
    
        break;
      case FilterLabel.Viability:
        this.setState({isViabilityChecked:this.props.ViabilityOption.length === Option.length ? true : false});
        this.s_ViabilityOption = Option;
        this.props._syncSelectedOption(FilterLabel.Viability,Option);
    
        break;
      case FilterLabel.EndState:
        this.setState({isEndStateChecked:this.props.EndState.length === Option.length ? true : false});
        this.s_EndState = Option;
        this.props._syncSelectedOption(FilterLabel.EndState,Option);
    
        break;
      case FilterLabel.Classification:
        this.setState({isClasifiChecked:this.props.Classification.length === Option.length ? true : false});
        this.s_Classification = Option;
        this.props._syncSelectedOption(FilterLabel.Classification,Option);
    
        break;  
    
      default:
        break;
        
    }

    
  }

  private _onOptionChangeMultiSelect = (item: IDropdownOption, selectedItems:string[],optionName:string): void => {

    const updatedSelectedItem = selectedItems? GeneralService.copyArray(selectedItems) : [];
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
  
    switch(optionName) {
      case FilterLabel.Brigade:
        let isAllBChecked = this.props.Brigade.length === updatedSelectedItem.length ? true : false;
        this.props._syncSelectedOption(FilterLabel.Brigade,updatedSelectedItem);
        this.s_Brigade = updatedSelectedItem;
        this.setState({isBrigadeChecked: isAllBChecked});
    
        break;
      case FilterLabel.Rating:
        let isAllRChecked = this.props.RatingOption.length === updatedSelectedItem.length ? true : false;
        this.s_RatingOption = updatedSelectedItem;
        this.setState({isRatingOptionChecked: isAllRChecked});
        this.props._syncSelectedOption(FilterLabel.Rating,updatedSelectedItem);
    
        break;
      case FilterLabel.Viability:
        let isAllVChecked = this.props.ViabilityOption.length === updatedSelectedItem.length ? true : false;
        this.s_ViabilityOption = updatedSelectedItem;
        this.setState({isViabilityChecked: isAllVChecked});
        this.props._syncSelectedOption(FilterLabel.Viability,updatedSelectedItem);
    
        break;
      case FilterLabel.EndState:
        let isAllESChecked = this.props.EndState.length === updatedSelectedItem.length ? true : false;
        this.s_EndState = updatedSelectedItem;
        this.setState({isEndStateChecked: isAllESChecked});
        this.props._syncSelectedOption(FilterLabel.EndState,updatedSelectedItem);
    
        break;
      case FilterLabel.Classification:
        let isAllCChecked = this.props.Classification.length === updatedSelectedItem.length ? true : false;
        this.s_Classification = updatedSelectedItem;
        this.setState({isClasifiChecked: isAllCChecked});
        this.props._syncSelectedOption(FilterLabel.Classification,updatedSelectedItem);
    
        break;  
      default:
        break;
        
    }
   
  }


  public render(): React.ReactElement<IFilterControlsProp> {

  
      return (
        <div className="filterDiv">
          <div className="ddBrigade">
            <Checkbox label="Brigade" className="cb" onChange={(e,checked)=>this._selectRemoveOption(e,checked,this.props.Brigade,"Brigade")} defaultChecked={true} checked={this.state.isBrigadeChecked} />
            <Dropdown
              className="labelStyle"
              placeHolder="Please select Brigade"
              selectedKeys={this.s_Brigade}
              options={this.props.Brigade}
              multiSelect
              onChanged={(item)=>this._onOptionChangeMultiSelect(item,this.s_Brigade,"Brigade")}
            />
          </div>
          <div className="ddRating">
            <Checkbox label="Rating" className="cb" onChange={(e,checked)=>this._selectRemoveOption(e,checked,this.props.RatingOption,"Rating")} defaultChecked={false} checked={this.state.isRatingOptionChecked} />
            <Dropdown
              //label="Rating"
              placeHolder="Please select Rating"
              selectedKeys={this.s_RatingOption}
              options={this.props.RatingOption}
              multiSelect
              onChanged={(item)=>this._onOptionChangeMultiSelect(item,this.s_RatingOption,"Rating")}
            />
          </div>
          <div className="ddViability">
            < Checkbox label="Viability Category" className="cb" onChange={(e,checked)=>this._selectRemoveOption(e,checked,this.props.ViabilityOption,"Viability")} defaultChecked={true} checked={this.state.isViabilityChecked} />
            <Dropdown
              //label="Viability Category"
              placeHolder="Please Select Viability Category"
              selectedKeys={this.s_ViabilityOption}
              options={this.props.ViabilityOption}
              multiSelect
              onChanged={(item)=>this._onOptionChangeMultiSelect(item,this.s_ViabilityOption,"Viability")}
            />
          </div>
          <div className="ddEndState">
            <Checkbox label="End State" className="cb" onChange={(e,checked)=>this._selectRemoveOption(e,checked,this.props.EndState,"EndState")}  defaultChecked={true} checked={this.state.isEndStateChecked} />
            <Dropdown
              //label="End State"
              placeHolder="End State (Question Ref)"
              selectedKeys={this.s_EndState}
              options={this.props.EndState}
              multiSelect
              onChanged={(item)=>this._onOptionChangeMultiSelect(item,this.s_EndState,"EndState")}
  
            />
          </div>
          <div className="ddClassification">
            <Checkbox label="Classification" className="cb" onChange={(e,checked)=>this._selectRemoveOption(e,checked,this.props.Classification,"Classification")} defaultChecked={true} checked={this.state.isClasifiChecked} />
            <Dropdown
              //label="Classification"
              placeHolder="Classification"
              options={this.props.Classification}
              selectedKeys={this.s_Classification}
              multiSelect
              onChanged={(item)=>this._onOptionChangeMultiSelect(item,this.s_Classification,"Classification")}
            />
          </div>
        </div>
      );
    }

}
