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




const columns = [
  { field: "brigadeName", title: "Brigade" },
  { field: "reviewPeriod", title: "Review Year" },
  { field: "dateStarted", title: "Date Started" },
  { field: "completedBy", title: "Action Plan Completed By" },
  { field: "districtName", title: "District" },
  { field: "regionName", title: "Region" },
  {
    field: "reviewDetail",
    title: "Review Detail",
    render: rowData => <a href={rowData.reviewDetail}>Review Detail</a>
  },
  {
    field: "actionPlanReportURL",
    title: "Action Plan Report",
    render: rowData => <a href={rowData.actionPlanReportURL}>View Action plan report</a>
  },
  { field: "reviewId", title: "Review ID" },
  { field: "classification", title: "Classification" }
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
      />

    );
  }
}
