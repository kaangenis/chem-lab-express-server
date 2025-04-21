import { Router } from "express";
import {
    createNewOfferFromWorkerSide,
    createNewOfferFromHolderSide,
    getInitialOffersFromWorkerSide,
    getInitialOffersFromHolderSide,
    getMoreOffersFromWorkerSide,
    getMoreOffersFromHolderSide,
    updateOfferFromWorkerSide,
    updateOfferFromHolderSide,
    deleteOfferFromWorkerSide,
    deleteOfferFromHolderSide,
} from "../../controllers/CRM/CRM_offer_controller";

const CRM_offerRouter: Router = Router();

CRM_offerRouter.post("/worker/create-new-offer", createNewOfferFromWorkerSide);
CRM_offerRouter.post("/holder/create-new-offer", createNewOfferFromHolderSide);
CRM_offerRouter.get("/worker/get-initial-offers", getInitialOffersFromWorkerSide);
CRM_offerRouter.get("/holder/get-initial-offers", getInitialOffersFromHolderSide);
CRM_offerRouter.get("/worker/get-more-offers", getMoreOffersFromWorkerSide);
CRM_offerRouter.get("/holder/get-more-offers", getMoreOffersFromHolderSide);
CRM_offerRouter.put("/worker/update-offer", updateOfferFromWorkerSide);
CRM_offerRouter.put("/holder/update-offer", updateOfferFromHolderSide);
CRM_offerRouter.delete("/worker/delete-offer", deleteOfferFromWorkerSide);
CRM_offerRouter.delete("/holder/delete-offer", deleteOfferFromHolderSide);

export default CRM_offerRouter;
