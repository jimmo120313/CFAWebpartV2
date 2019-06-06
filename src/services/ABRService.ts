import { sp, CamlQuery } from "@pnp/sp";
import {
  ISolutionDropdownOption,
  IBrigadeDataListOption,
  IActionPlan,
  IActionPlanItem,
  IActionPlanItemChoice
} from "../models/index";
import * as CamlBuilder from "camljs";
import * as strings from "ActionplanQuickEditListWebPartStrings";

export class ABRService {
  private reviewPeriod: ISolutionDropdownOption[] = [];
  private district: ISolutionDropdownOption[] = [];
  private viabilityCategory: ISolutionDropdownOption[] = [];
  private ratingOpion: ISolutionDropdownOption[] = [];
  public supportOption: any = {};
  public priorityOption: any = {};
  public dueOption: any = {};
  public statusOpion: any = {};


  public async _getBrigadeOption(
    district: string
  ): Promise<IBrigadeDataListOption[]> {
    let q: string = "District/Title eq '" + district + "'";
    let brigade: IBrigadeDataListOption[] = [];
    const allBrigade = await sp.web.lists
      .getByTitle("Brigade")
      .items.select("ID", "Title", "District/Title")
      .expand("District")
      .filter(q)
      .getAll();

    for (let i = 0; i < allBrigade.length; i++) {
      brigade.push({
        brigadeId: allBrigade[i].ID,
        brigadeName: allBrigade[i].Title
      });
    }
    return brigade;
  }



  public async _getDistrictOption(): Promise<ISolutionDropdownOption[]> {
    sp.web.lists
      .getByTitle("District")
      .items.select("Title")
      .get()
      .then((items: any[]) => {
        items.forEach(d => {
          let districtObj: ISolutionDropdownOption = {
            key: d.etag,
            text: d.Title
          };
          this.district.push(districtObj);
        });
      });
    return this.district;
  }

  public _getRating(): ISolutionDropdownOption[] {
    let vCategoryObj: ISolutionDropdownOption[] = [
      {
        key: "1",
        text: "Red"
      },
      {
        key: "2",
        text: "Amber"
      },
      {
        key: "3",
        text: "Green"
      }
    ];
    return vCategoryObj;
  }

  public async _getViabilityCategoryOption(): Promise<
    ISolutionDropdownOption[]
  > {
    const vc = await sp.web.lists
      .getByTitle("ViabilityCategory")
      .items.select("ID", "Title")
      .get();

    vc.forEach(d => {
      let vCategoryObj: ISolutionDropdownOption = {
        key: d.ID,
        text: d.Title
      };
      this.viabilityCategory.push(vCategoryObj);
    });

    return this.viabilityCategory;
  }

  public async _getActionPlanItem(
    reviewPeriod?: string,
    selectedBrigade?: ISolutionDropdownOption[],
    reviewsId?: string[]
  ): Promise<IActionPlanItem[]> {
    let brigadesId = new Array();

    selectedBrigade.forEach(e => {
      brigadesId.push(e.key);
    });
    console.log(brigadesId);
    //Generate Query
    let query = new CamlBuilder()
      .View([
        "ID",
        "BrigadeTitle",
        "Title",
        "ViabilityCategory",
        "SubCategory",
        "Rating",
        "Challenge",
        "Treatment",
        "Initiative",
        "AssignedTo",
        "Priority",
        "Due",
        "Status",
        "ReviewId"
      ])
      .LeftJoin("Brigade", "Brigade")
      .Select("Title", "BrigadeTitle")
      .LeftJoin("ReviewID", "Annual Brigade Review")
      .Select("ID", "ReviewId")
      .Query()
      .Where()
      .LookupField("Brigade")
      .Id()
      .In(brigadesId)
      .And()
      .TextField("ReviewId")
      .In(reviewsId)
      .ToString();

    let allActionPlanItemDetail: IActionPlanItem[] = [];

    //Get row detail form Aciton Plan list
    const actionPlanItemDetail = await sp.web.lists
      .getByTitle("Action Plan Items")
      .renderListDataAsStream({ ViewXml: query });
    //console.log(actionPlanItemDetail);
    const row = actionPlanItemDetail.Row;
    for (let i = 0; i < row.length; i++) {
      allActionPlanItemDetail.push({
        reviewId: row[i].ReviewId,
        brigadeName: row[i].BrigadeTitle,
        endState: row[i].Title,
        viabilityCategory: row[i].ViabilityCategory,
        subCategory: row[i].SubCategory,
        rating: row[i].Rating,
        statementSelection: row[i].Challenge,
        treatment: row[i].Treatment,
        initiative: row[i].Initiative,
        supportRequired: row[i].AssignedTo,
        priority: row[i].Priority,
        due: row[i].Due,
        status: row[i].Status
      });
    }

    return allActionPlanItemDetail;
  }

  public async _getActionPlanMaster(
    reviewPeriod: string,
    selectedBrigade: ISolutionDropdownOption[]
  ): Promise<IActionPlan[]> {
    let brigadesId = new Array();

    selectedBrigade.forEach(e => {
      brigadesId.push(e.key);
    });

    //Generate Query
    let query = new CamlBuilder()
      .View([
        "ID",
        "BrigadeId",
        "BrigadeTitle",
        "Year",
        "DateStarted",
        "ActionPlanCompletedBy",
        "DistrictId",
        "DistrictTitle",
        "RegionId",
        "RegionTitle",
        "ReviewID",
        "Classification"
      ])
      .LeftJoin("Brigade", "Brigade")
      .Select("Title", "BrigadeTitle")
      .Select("ID", "BrigadeId")
      .LeftJoin("District", "District")
      .Select("Title", "DistrictTitle")
      .Select("ID", "DistrictId")
      .LeftJoin("Region", "Region")
      .Select("Title", "RegionTitle")
      .Select("ID", "RegionId")
      .LeftJoin("Review", "Review")
      .Select("ID", "ReviewID")
      .LeftJoin("Class", "Class", "Review")
      .Select("Title", "Classification")
      .Query().Where()
      .LookupField("Brigade")
      .Id()
      .In(brigadesId)
      .And()
      .TextField("Year")
      .EqualTo(reviewPeriod)
      .ToString();

    let actionPlanDetail: IActionPlan[] = [];
    const webDetail = await sp.web.get();
    const abrListUrl = webDetail.Url + "/Lists/ABRReview";
    const actionPlanReport =
      webDetail.Url + "/ActionPlans/Pages/items.aspx?PId={0}&maxrating=3";

    //Get row detail form Aciton Plan list
    const allActionPlan = await sp.web.lists
      .getByTitle("Action Plans")
      .renderListDataAsStream({ ViewXml: query });
    const row = allActionPlan.Row;

    for (let i = 0; i < row.length; i++) {
      let reviewURL =
        abrListUrl +
        "/AllItems.aspx?View={BC3455D0-DFC9-41F3-B0DA-379CAD42E8B0}&FilterField1=ID&FilterValue1=" +
        row[i].ReviewID;
      let reportURL = actionPlanReport.replace("{0}", row[i].ReviewID);
      actionPlanDetail.push({
        reviewId: row[i].ReviewID,
        brigadeId: row[i].BrigadeId,
        brigadeName: row[i].BrigadeTitle,
        reviewPeriod: row[i].Year,
        dateStarted: row[i].DateStarted,
        completedBy: row[i].ActionPlanCompletedBy,
        districtId: row[i].DistrictId,
        districtName: row[i].DistrictTitle,
        regionId: row[i].RegionId,
        regionName: row[i].RegionTitle,
        actionPlanReportURL: reportURL,
        reviewDetail: reviewURL,
        classification: row[i].Classification
      });
    }
    console.log("test1");
    console.log(actionPlanDetail);
    return actionPlanDetail;
  }




  ////Get From Chioce Field
  public async _getReviewPeriodOption(): Promise<ISolutionDropdownOption[]> {
    sp.web.lists
      .getByTitle("Statements")
      .fields.getByInternalNameOrTitle("Review Period")
      .get()

      .then(f => {

        f.Choices.forEach(e => {
          let reviewPeriodObj: ISolutionDropdownOption = {
            key: e,
            text: e
          };
          this.reviewPeriod.push(reviewPeriodObj);
        });
      });
    return this.reviewPeriod;
  }



  public async _getItemListOption(): Promise<void> {
    let objField = sp.web.lists
      .getByTitle("	Action Plan Items")
      .fields;

    let assignTo = await objField.getByInternalNameOrTitle("AssignedTo").get();
    assignTo.Choices.forEach(element => {

      this.supportOption["'" + element + "'"] = element;

    });

    let prioritys = await objField.getByInternalNameOrTitle("Priority")
      .get();
    prioritys.Choices.forEach(element => {

      this.priorityOption["'" + element + "'"] = element;
    });

    let due = await objField.getByInternalNameOrTitle("Due").get();
    due.Choices.forEach(element => {
      this.dueOption["'" + element + "'"] = element;
    });

    let status = await objField.getByInternalNameOrTitle("Status")
      .get();
    status.Choices.forEach(element => {
      this.statusOpion["'" + element + "'"] = element;
    });

  }
}
