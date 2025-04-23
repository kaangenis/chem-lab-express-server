import { Router } from "express";
import {
    createNewMissionFromHolderSide,
    createNewMissionFromWorkerSide,
    deleteMissionFromWorkerSide,
    deleteMissionFromHolderSide,
    getInitialMissionsFromHolderSide,
    getInitialMissionsFromWorkerSide,
    getMoreMissionsFromHolderSide,
    getMoreMissionsFromWorkerSide,
    searchMissionWithMissionTitleFromHolderSide,
    searchMissionWithMissionTitleFromWorkerSide,
    updateMissionFromHolderSide,
    updateMissionFromWorkerSide
} from "../../controllers/CRM/CRM_mission_controller";

const CRM_missionsRoute: Router = Router();

CRM_missionsRoute.post("/worker/create-new-mission", createNewMissionFromWorkerSide);
CRM_missionsRoute.post("/holder/create-new-mission", createNewMissionFromHolderSide);

CRM_missionsRoute.get("/worker/get-initial-missions", getInitialMissionsFromWorkerSide);
CRM_missionsRoute.get("/worker/get-more-missions", getMoreMissionsFromWorkerSide);

CRM_missionsRoute.get("/holder/get-initial-missions", getInitialMissionsFromHolderSide);
CRM_missionsRoute.get("/holder/get-more-missions", getMoreMissionsFromHolderSide);

CRM_missionsRoute.put("/worker/update-mission", updateMissionFromWorkerSide);
CRM_missionsRoute.put("/holder/update-mission", updateMissionFromHolderSide);

CRM_missionsRoute.delete("/worker/delete-mission", deleteMissionFromWorkerSide);
CRM_missionsRoute.delete("/holder/delete-mission", deleteMissionFromHolderSide);

CRM_missionsRoute.get("/worker/search-mission-with-mission-title", searchMissionWithMissionTitleFromWorkerSide);
CRM_missionsRoute.get("/holder/search-mission-with-mission-title", searchMissionWithMissionTitleFromHolderSide);


export default CRM_missionsRoute;
