import { Router } from "express";
import { createNewOffer, getAllOffersByOrganizationId, getOffersContinueByIdFromHolderSide, getOffersFromHolderSideLimit10 } from "../../controllers/CRM/CRM_offer_controller";

const CRM_offerRouter: Router = Router();

CRM_offerRouter.get("/get-all-offers", getAllOffersByOrganizationId);
CRM_offerRouter.post("/create-new-offer", createNewOffer);
CRM_offerRouter.get("/get-offers-from-holder", getOffersFromHolderSideLimit10);
CRM_offerRouter.get("/get-offers-from-holder-continue", getOffersContinueByIdFromHolderSide);


export default CRM_offerRouter;
