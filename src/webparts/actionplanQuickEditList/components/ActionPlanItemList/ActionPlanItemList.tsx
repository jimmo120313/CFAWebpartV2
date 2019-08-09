import * as React from "react";
require("./ActionPlanItemList.module.scss");
import { IActionPlanItemListProp, IActionPlanItemListState } from "./index";
import { IActionPlanItem } from "../../../../models/index";
import { ABRService } from "../../../../services/index";
import MaterialTable from "material-table";
import Input from '@material-ui/core/Input';


export class ActionPlanItemList extends React.Component<
  IActionPlanItemListProp,
  IActionPlanItemListState
  > {
  private actionPlanItemService: ABRService = new ABRService();
  private columns: any[];

  constructor(props: IActionPlanItemListProp) {
    super(props);
    this.state = {
      selectedBrigade: this.props.selectedBrigade,
      rows: this.props.row
    };
  }
  public async componentDidMount(): Promise<void> {

    await this.actionPlanItemService._getItemListOption();

    this.columns = [
      { field: "brigadeName", title: "Brigade Name", editable: 'never', cellStyle: { width: 5, maxWidth: 5 } },
      { field: "endState", title: "End State", editable: 'never' },
      { field: "viability", title: "Viability Category", editable: 'never', cellStyle: { width: 100 }, headerStyle: { width: 100 } },
      { field: "subCategory", title: "Sub-Category", editable: 'never' },
      { field: "rating", title: "Rating", editable: 'never', cellStyle: { width: 50 }, headerStyle: { width: 50 } },
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
      { field: "supportRequired", title: "Support Required", lookup: this.actionPlanItemService.supportOption },
      { field: "priority", title: "Priority", lookup: this.actionPlanItemService.priorityOption },
      { field: "due", title: "Due", lookup: this.actionPlanItemService.dueOption },
      { field: "status", title: "Status", lookup: this.actionPlanItemService.statusOpion }

    ];

    //this.setState({ rows: actionPlanItem });
  }

  public render(): React.ReactElement<IActionPlanItemListProp> {

    if (this.state.rows) {
      return (
        <MaterialTable
          columns={this.columns}
          data={this.state.rows}
          title="Action Plan Item"
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.rows;
                    const index = data.indexOf(oldData);
                    data[index] = newData;
                    this.setState({ rows: data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              })
          }}

        />
      );
    } else {
      return <div>no item show</div>;
    }
  }
}
