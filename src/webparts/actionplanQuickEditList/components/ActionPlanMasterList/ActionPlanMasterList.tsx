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



const headerProperties = { headerStyle: { backgroundColor: '#E31A1A', color: '#ffffff', fontWeight: 'bold' as 'bold', fontSize: '14px' } };
const cellProps = { fontSize: '14px' };
const columns = [
  { field: "brigadeName", cellStyle: { ...cellProps }, title: "Brigade", ...headerProperties },
  { field: "reviewPeriod", cellStyle: { ...cellProps }, title: "Review Year", ...headerProperties },
  { field: "dateStarted", cellStyle: { ...cellProps }, title: "Date Started", ...headerProperties },
  { field: "completedBy", cellStyle: { ...cellProps }, title: "Action Plan Completed By", ...headerProperties },
  { field: "districtName", cellStyle: { ...cellProps }, title: "District", ...headerProperties },
  { field: "regionName", cellStyle: { ...cellProps }, title: "Region", ...headerProperties },
  {
    field: "reviewDetail",
    title: "Review Detail", cellStyle: { ...cellProps },
    render: rowData => <a href={rowData.reviewDetail}>Review Detail</a>, ...headerProperties
  },
  {
    field: "actionPlanReportURL",
    title: "Action Plan Report", cellStyle: { ...cellProps },
    render: rowData => <a href={rowData.actionPlanReportURL}>View Action plan report</a>, ...headerProperties
  },
  //{ field: "reviewId", cellStyle: { ...cellProps }, title: "Review ID", ...headerProperties },
  { field: "classification", cellStyle: { ...cellProps }, title: "Classification", ...headerProperties }
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
          pageSizeOptions: [3, 6, 9],
          search: false
        }}
      />
    );
  }
}
