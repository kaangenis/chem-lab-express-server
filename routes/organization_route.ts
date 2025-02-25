import { Router } from "express";
import { addNewOrganizationWorker, loginOrganizationHolder, loginOrganizationWorker, updateWorkerPassword } from "../controllers/organization_controller";

const organizationRouter: Router = Router();

organizationRouter.post("/login-holder", loginOrganizationHolder);
organizationRouter.post("/create-worker", addNewOrganizationWorker);
organizationRouter.post("/login-worker", loginOrganizationWorker);
organizationRouter.post("/update-worker-pw", updateWorkerPassword);

export default organizationRouter;
