export interface IActionPlan {
  reviewId: string;
  brigadeId?: string;
  brigadeName?: string;
  reviewPeriod: string;
  dateStarted?: string;
  completedBy?: string;
  districtId?: string;
  districtName?: string;
  regionId?: string;
  regionName?: string;
  actionPlanReportURL?: string;
  reviewDetail?: string;
  classification?: string;
}
