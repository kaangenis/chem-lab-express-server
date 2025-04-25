import { Router } from "express";
import {
    createNewActivityFromWorkerSide,
    getInitialActivitiesFromWorkerSide,
    getMoreActivitiesFromWorkerSide,
    searchActivityWithActivityCustomerNameFromHolderSide,
    searchActivityWithActivityCustomerNameFromWorkerSide,
    updateActivityFromHolderSide,
    updateActivityFromWorkerSide,
    deleteActivityFromHolderSide,
    deleteActivityFromWorkerSide,
    createNewActivityFromHolderSide,
    getInitialActivitiesFromHolderSide,
    getMoreActivitiesFromHolderSide,
} from "../../controllers/CRM/CRM_activities_controller";

const CRM_activitiesRoute: Router = Router();

CRM_activitiesRoute.post("/worker/create-new-activity", createNewActivityFromWorkerSide);
CRM_activitiesRoute.get("/worker/get-initial-activities", getInitialActivitiesFromWorkerSide);
CRM_activitiesRoute.get("/worker/get-more-activities", getMoreActivitiesFromWorkerSide);
CRM_activitiesRoute.put("/worker/update-activity", updateActivityFromWorkerSide);
CRM_activitiesRoute.delete("/worker/delete-activity", deleteActivityFromWorkerSide);
CRM_activitiesRoute.get("/worker/search-activity", searchActivityWithActivityCustomerNameFromWorkerSide);

CRM_activitiesRoute.post("/holder/create-new-activity", createNewActivityFromHolderSide);
CRM_activitiesRoute.get("/holder/get-initial-activities", getInitialActivitiesFromHolderSide);
CRM_activitiesRoute.get("/holder/get-more-activities", getMoreActivitiesFromHolderSide);
CRM_activitiesRoute.put("/holder/update-activity", updateActivityFromHolderSide);
CRM_activitiesRoute.delete("/holder/delete-activity", deleteActivityFromHolderSide);
CRM_activitiesRoute.get("/holder/search-activity", searchActivityWithActivityCustomerNameFromHolderSide);

export default CRM_activitiesRoute;
