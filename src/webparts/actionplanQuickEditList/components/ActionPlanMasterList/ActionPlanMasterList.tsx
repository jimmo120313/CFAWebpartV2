import * as React from "react";
require("./ActionPlanMasterList.module.scss");
import {
  IActionPlanMasterListProps,
  IActionPlanMasterListState
} from "./index";
import { IActionPlan, IActionPlanItem } from "../../../../models/index";
import { ABRService } from "../../../../services/index";
import { registerBeforeUnloadHandler } from "@microsoft/teams-js";
import MaterialTable from "material-table";



const headerProperties = { headerStyle: { backgroundColor: '#ff0000', color: '#ffffff', fontWeight: 'bold' as 'bold' } };

const columns = [
  { field: "brigadeName", title: "Brigade", ...headerProperties },
  { field: "reviewPeriod", title: "Review Year", ...headerProperties },
  { field: "dateStarted", title: "Date Started", ...headerProperties },
  { field: "completedBy", title: "Action Plan Completed By", ...headerProperties },
  { field: "districtName", title: "District", ...headerProperties },
  { field: "regionName", title: "Region", ...headerProperties },
  {
    field: "reviewDetail",
    title: "Review Detail",
    render: rowData => <a href={rowData.reviewDetail}>Review Detail</a>, ...headerProperties
  },
  {
    field: "actionPlanReportURL",
    title: "Action Plan Report",
    render: rowData => <a href={rowData.actionPlanReportURL}>View Action plan report</a>, ...headerProperties
  },
  { field: "reviewId", title: "Review ID", ...headerProperties },
  { field: "classification", title: "Classification", ...headerProperties }
];

let actionPlanDetail: IActionPlan[];
// let actionPlanItemDetail: IActionPlanItem[];
// const actionPlanColumns = () => { };

export class ActionPlanMasterList extends React.Component<
  IActionPlanMasterListProps,
  IActionPlanMasterListState
  > {


  constructor(props: IActionPlanMasterListProps) {
    super(props);
    // this.state = {
    //   rows: this.props.row
    // };
  }
  public async componentDidMount(): Promise<void> {
    //this.brigade._getBrigadeDetail();
    // actionPlanDetail = await this.actionPlanService._getActionPlanMaster(
    //   this.props.reviewPeriod,
    //   this.props.selectedBrigade
    // );

    // this.setState({ rows: this.props.row });
  }

  public render(): React.ReactElement<IActionPlanMasterListProps> {
    return (

      <MaterialTable
        title="Action Plans"
        columns={columns}
        data={this.props.row}
        options={{
          pageSize: 3,
          pageSizeOptions: [3, 6, 9]
        }}
      />
    );
  }
}
