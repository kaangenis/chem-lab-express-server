import { Router } from "express";
import {
    createLicense,
    createNewAdminDirectly,
    createNewAdminFromAnotherAdminSide,
    createOrganization,
    getAdminData,
    getAllLicenses,
    getAllOrganizations,
    getAllUsersFromAdminSide,
    loginToAdmin,
    renewAdminToken,
} from "../controllers/admin_controller";

const adminRouter: Router = Router();

adminRouter.post("/admin-directly", createNewAdminDirectly);
adminRouter.post("/admin-manually", createNewAdminFromAnotherAdminSide);
adminRouter.get("/get-admin", getAdminData);
adminRouter.post("/admin-login", loginToAdmin);
adminRouter.post("/renew-admin", renewAdminToken);
adminRouter.post("/create-organization", createOrganization);
adminRouter.get("/get-organizations", getAllOrganizations);
adminRouter.post("/create-license", createLicense);
adminRouter.get("/get-licenses", getAllLicenses);
adminRouter.get("/get-all-workers", getAllUsersFromAdminSide);


export default adminRouter;
