import { Router } from "express";
import {
    createNewMeasurementFromHolderSide,
    createNewMeasurementFromWorkerSide,
    getInitialMeasurementsFromHolderSide,
    getInitialMeasurementsFromWorkerSide,
    getMoreMeasurementsFromHolderSide,
    getMoreMeasurementsFromWorkerSide,
    updateMeasurementFromWorkerSide,
    updateMeasurementFromHolderSide,
    deleteMeasurementFromWorkerSide,
    deleteMeasurementFromHolderSide,
    searchMeasurementWithMeasurementScopeFromWorkerSide,
    searchMeasurementWithMeasurementScopeFromHolderSide,
} from "../../controllers/CRM/CRM_measurements_controller";

const CRM_measurementsRoute: Router = Router();

CRM_measurementsRoute.post("/worker/create-new-measurement", createNewMeasurementFromWorkerSide);
CRM_measurementsRoute.post("/holder/create-new-measurement", createNewMeasurementFromHolderSide);
CRM_measurementsRoute.get("/worker/get-initial-measurements", getInitialMeasurementsFromWorkerSide);
CRM_measurementsRoute.get("/worker/get-more-measurements", getMoreMeasurementsFromWorkerSide);
CRM_measurementsRoute.get("/holder/get-initial-measurements", getInitialMeasurementsFromHolderSide);
CRM_measurementsRoute.get("/holder/get-more-measurements", getMoreMeasurementsFromHolderSide);
CRM_measurementsRoute.put("/worker/update-measurement", updateMeasurementFromWorkerSide);
CRM_measurementsRoute.put("/holder/update-measurement", updateMeasurementFromHolderSide);
CRM_measurementsRoute.delete("/worker/delete-measurement", deleteMeasurementFromWorkerSide);
CRM_measurementsRoute.delete("/holder/delete-measurement", deleteMeasurementFromHolderSide);
CRM_measurementsRoute.get("/worker/search-measurement", searchMeasurementWithMeasurementScopeFromWorkerSide);
CRM_measurementsRoute.get("/holder/search-measurement", searchMeasurementWithMeasurementScopeFromHolderSide);

export default CRM_measurementsRoute;