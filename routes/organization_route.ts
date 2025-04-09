import { Router } from "express";
import { addNewOrganizationWorker, getAllWorkersFromOrganizationSide, loginOrganizationHolder, loginOrganizationWorker, updateOrganizationHolderPassword, updateWorkerPassword } from "../controllers/organization_controller";

const organizationRouter: Router = Router();

organizationRouter.post("/login-holder", loginOrganizationHolder);
organizationRouter.post("/create-worker", addNewOrganizationWorker);
organizationRouter.post("/login-worker", loginOrganizationWorker);
organizationRouter.post("/update-worker-pw", updateWorkerPassword);
organizationRouter.post("/update-holder-pw", updateOrganizationHolderPassword);
organizationRouter.get("/get-all-workers", getAllWorkersFromOrganizationSide);


export default organizationRouter;
