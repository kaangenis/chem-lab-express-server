import { Router } from "express";
import {
    createLicense,
    createNewAdminDirectly,
    createNewAdminFromAnotherAdminSide,
    createOrganization,
    getAllLicenses,
    getAllOrganizations,
    loginToAdmin,
    renewAdminToken,
} from "../controllers/admin_controller";

const adminRouter: Router = Router();

adminRouter.post("/admin-directly", createNewAdminDirectly);
adminRouter.post("/admin-manually", createNewAdminFromAnotherAdminSide);
adminRouter.post("/admin-login", loginToAdmin);
adminRouter.post("/renew-admin", renewAdminToken);
adminRouter.post("/create-organization", createOrganization);
adminRouter.get("/get-organizations", getAllOrganizations);
adminRouter.post("/create-license", createLicense);
adminRouter.get("/get-licenses", getAllLicenses);


export default adminRouter;
