import { Router } from "express";
import { createNewOffer, getAllOffersByOrganizationId } from "../../controllers/CRM/CRM_offer_controller";

const CRM_offerRouter: Router = Router();

CRM_offerRouter.get("/get-all-offers", getAllOffersByOrganizationId);
CRM_offerRouter.post("/create-new-offer", createNewOffer);

export default CRM_offerRouter;
