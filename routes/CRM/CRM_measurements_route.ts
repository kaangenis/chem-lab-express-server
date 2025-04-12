import { Router } from "express";
import { createNewActivityFromWorkerSide, getActivitiesContinueByIdFromWorkerSide, getActivitiesFromWorkerSideLimit10 } from "../../controllers/CRM/CRM_activities_controller";

//fix

const CRM_activitiesRoute: Router = Router();

CRM_activitiesRoute.get("/worker/get-initial-activities", getActivitiesFromWorkerSideLimit10);
CRM_activitiesRoute.get("/worker/get-more-activities", getActivitiesContinueByIdFromWorkerSide);
CRM_activitiesRoute.post("/worker/create-new-activity", createNewActivityFromWorkerSide);

export default CRM_activitiesRoute;
