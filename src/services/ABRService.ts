import { registerBeforeUnloadHandler } from '@microsoft/teams-js';
import { sp, CamlQuery, Web } from "@pnp/sp";
import { CurrentUser } from '@pnp/sp/src/siteusers';
import {
  ISolutionDropdownOption,
  IBrigadeDataListOption,
  IActionPlan,
  IActionPlanItem,
  IActionPlanItemChoice
} from "../models/index";
import * as CamlBuilder from "camljs";
import * as strings from "ActionplanQuickEditListWebPartStrings";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PageContext } from '@microsoft/sp-page-context';

export class ABRService {
  private reviewPeriod: ISolutionDropdownOption[] = [];
  private district: ISolutionDropdownOption[] = [];
  private classification: ISolutionDropdownOption[] = [];
  private viabilityCategory: ISolutionDropdownOption[] = [];
  private ratingOpion: ISolutionDropdownOption[] = [];
  public supportOption: any = {};
  public priorityOption: any = {};
  public dueOption: any = {};
  public statusOpion: any = {};




  public async _getBrigadeOption(
    district: string,
    reviewPeriod: string
  ): Promise<IBrigadeDataListOption[]> {
    let q: string = "District/Title eq '" + district + "'" + "and Year eq '" + reviewPeriod + "'";
    let brigade: IBrigadeDataListOption[] = [];

    const allBrigade = await sp.web.lists
      .getByTitle("Action Plans")
      .items.select("ID", "Brigade/Title", "District/Title", "Year", "Brigade/Id")
      .expand("District", "Brigade")
      .filter(q)
      .getAll();

    for (let i = 0; i < allBrigade.length; i++) {
      brigade.push({
        key: i.toString(),
        title: allBrigade[i].Brigade.Title,
        description: allBrigade[i].Brigade.Id,
        chosen: false
      });
    }
    return brigade.sort((a, b) => a.title.localeCompare(b.title));
  }

  public async _getDistrictOption(): Promise<ISolutionDropdownOption[]> {
    await sp.web.lists
      .getByTitle("District")
      .items.select("Title", "Id")
      .get()
      .then((items: any[]) => {
        items.forEach(d => {

          let oNumber = Number(d.Title.replace("District ", ""));
          let districtObj: ISolutionDropdownOption = {
            key: d.Id,
            text: d.Title,
            order: oNumber
          };
          this.district.push(districtObj);
        });
      });


    return this.district.sort((a, b) => a.order - b.order);
  }

  public async _getClassificationOption(): Promise<ISolutionDropdownOption[]> {
    const cl = await sp.web.lists
      .getByTitle("Class")
      .items.select("Title")
      .get();

    cl.forEach(d => {
      let classificationObj: ISolutionDropdownOption = {
        key: d.Title,
        text: d.Title
      };
      this.classification.push(classificationObj);
    });
    this.classification.push({ key: "", text: "NULL" });

    return this.classification;
  }

  public _getRating(): ISolutionDropdownOption[] {
    this.ratingOpion = [
      {
        key: "Red",
        text: "Red"
      },
      {
        key: "Amber",
        text: "Amber"
      },
      {
        key: "Green",
        text: "Green"
      }
    ];
    return this.ratingOpion;
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
        key: d.Title,
        text: d.Title
      };
      this.viabilityCategory.push(vCategoryObj);
    });

    return this.viabilityCategory;
  }

  public async _getActionPlanItem(
    selectedBrigade?: ISolutionDropdownOption[],
    reviewsId?: string[]
  ): Promise<IActionPlanItem[]> {

    let brigadesId = new Array();

    selectedBrigade.forEach(e => {
      brigadesId.push(e.key);
    });


    let allActionPlanItemDetail: IActionPlanItem[] = [];

    const filterCond = reviewsId.map(id => `ReviewID/ID eq ${id}`).join(' or ');
    //Get row detail form Aciton Plan list
    const actionPlanItemDetail = await sp.web.lists
      .getByTitle("Action Plan Items").items
      .select(
        "ID"
        , "Brigade/Id"
        , "Brigade/Title"
        , "Title"
        , "ViabilityCategory"
        , "SubCategory"
        , "Rating"
        , "Challenge"
        , "Treatment"
        , "Initiative"
        , "AssignedTo"
        , "Priority"
        , "Due"
        //, "testDue"
        , "Status"
        , "ReviewID/ID"
        , "QuestionReference"
        , "ReviewComments"
      ).expand("Brigade", "ReviewID").filter(filterCond).getAll();


    // const row = actionPlanItemDetail.Row;
    for (let i = 0; i < actionPlanItemDetail.length; i++) {
      let index = actionPlanItemDetail[i].ReviewComments.indexOf("<p>");
      let cComment = '';
      if (index !== -1) {
        let startPos = index + "<p>".length;
        let endPos = actionPlanItemDetail[i].ReviewComments.indexOf("</p>");
        cComment = actionPlanItemDetail[i].ReviewComments.substring(startPos, endPos).trim();
      }
      //debugger;
      let formatedDate = '';
      if (actionPlanItemDetail[i].Due) {
        let duedate = new Date(actionPlanItemDetail[i].Due);
        
        let month = duedate.getMonth() + 1;
        let day = duedate.getDate();
        let year = duedate.getFullYear();
        formatedDate = day + "/" + (month.toString().length==1?"0"+month:month)+ "/" + year;
        
      }

      allActionPlanItemDetail.push({
        reviewId: actionPlanItemDetail[i].ReviewID.ID.toString(),
        brigadeId: actionPlanItemDetail[i].Brigade.Id.toString(),
        brigadeName: actionPlanItemDetail[i].Brigade.Title,
        endState: actionPlanItemDetail[i].Title,
        endStateId: i.toString(),
        viabilityCategory: actionPlanItemDetail[i].ViabilityCategory,
        subCategory: actionPlanItemDetail[i].SubCategory,
        rating: actionPlanItemDetail[i].Rating,
        statementSelection: actionPlanItemDetail[i].Challenge,
        treatment: actionPlanItemDetail[i].Treatment,
        initiative: actionPlanItemDetail[i].Initiative,
        supportRequired: actionPlanItemDetail[i].AssignedTo,
        priority: actionPlanItemDetail[i].Priority,
        //due: actionPlanItemDetail[i].Due,
        //due: actionPlanItemDetail[i].testDue,
        due: formatedDate,
        status: actionPlanItemDetail[i].Status,
        actionPlanItemId: actionPlanItemDetail[i].ID,
        questionReference: actionPlanItemDetail[i].QuestionReference,
        abrComment: cComment

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
        "Classification",
        "Modified"
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
        dateStarted: row[i].Modified,
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

    // let due = await objField.getByInternalNameOrTitle("Due").get();
    // due.Choices.forEach(element => {
    //   this.dueOption["'" + element + "'"] = element;
    // });

    let status = await objField.getByInternalNameOrTitle("Status")
      .get();
    status.Choices.forEach(element => {
      this.statusOpion["'" + element + "'"] = element;
    });

  }

  public async _saveActionPlanItems(row: IActionPlanItem[], siteUrl: string): Promise<IActionPlanItem[]> {
    let changedRows: IActionPlanItem[] = [];
    let uniqueReviewIdRows: string[] = [];

    row.forEach(r => {
      if (r.isUpdated) {
        changedRows.push(r);
        r.isUpdated = false;
      }
    });
    

    const webUrl: string = siteUrl;//"https://viccfa.sharepoint.com/sites/services/ABR";
    const ItemlistName: string = "Action Plan Items";
    const MasterListName: string = "Action Plans";
    const rootWeb = new Web(webUrl);
    const list = rootWeb.lists.getByTitle(ItemlistName);

    const currentUser = await sp.web.currentUser.get();


    const batch = sp.web.createBatch();
    const entityTypeFullName = await list.getListItemEntityTypeFullName();

    changedRows.forEach(c => {
      list.items.getItemByStringId(c.actionPlanItemId)
        .inBatch(batch)
        .update(
          {
            Treatment: c.treatment,
            Initiative: c.initiative,
            AssignedTo: c.supportRequired,//Support Required
            Priority: c.priority,
            Status: c.status,
            ApprovedBy: "",
            Due: this._getISODateStringFormat(c.due),
          }, "*", entityTypeFullName);

      if (c.reviewId !== null && c.reviewId !== '' && uniqueReviewIdRows.indexOf(c.reviewId) == -1) {
        uniqueReviewIdRows.push(c.reviewId);
      }
    });

    await batch.execute();

    const masterList = rootWeb.lists.getByTitle(MasterListName).expand("Review").select("ID", "Review/ID");
    uniqueReviewIdRows.forEach(m => {
      let fielterString: string = "Review/ID eq " + m;
      masterList.items.top(1).filter(fielterString).get()
        .then(
          (items: any[]) => {
            if (items.length > 0) {
              sp.web.lists.getByTitle(MasterListName).items.getById(items[0].Id).update(
                { ActionPlanCompletedBy: currentUser['Title'] }
              );
            }
          });
    });

    return row;

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
}
