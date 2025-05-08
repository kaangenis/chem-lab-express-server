import { Router } from "express";
import {
    createNewContactFromHolderSide,
    getInitialContactsFromWorkerSide,
    getMoreContactsFromWorkerSide,
    getInitialContactsFromHolderSide,
    getMoreContactsFromHolderSide,
    updateContactFromWorkerSide,
    updateContactFromHolderSide,
    deleteContactFromWorkerSide,
    deleteContactFromHolderSide,
    createNewContactFromWorkerSide,
    searchContactsFromWorkerSide,
    searchContactsFromHolderSide,
} from "../../controllers/CRM/CRM_contacts_controller";

const CRM_contactsRoute: Router = Router();

CRM_contactsRoute.post("/worker/create-new-contact", createNewContactFromWorkerSide);
CRM_contactsRoute.post("/holder/create-new-contact", createNewContactFromHolderSide);

CRM_contactsRoute.get("/worker/get-initial-contacts", getInitialContactsFromWorkerSide);
CRM_contactsRoute.get("/worker/get-more-contacts", getMoreContactsFromWorkerSide);

CRM_contactsRoute.get("/holder/get-initial-contacts", getInitialContactsFromHolderSide);
CRM_contactsRoute.get("/holder/get-more-contacts", getMoreContactsFromHolderSide);

CRM_contactsRoute.put("/worker/update-contact", updateContactFromWorkerSide);
CRM_contactsRoute.put("/holder/update-contact", updateContactFromHolderSide);

CRM_contactsRoute.delete("/worker/delete-contact", deleteContactFromWorkerSide);
CRM_contactsRoute.delete("/holder/delete-contact", deleteContactFromHolderSide);

CRM_contactsRoute.get("/worker/search-contacts", searchContactsFromWorkerSide);
CRM_contactsRoute.get("/holder/search-contacts", searchContactsFromHolderSide);


export default CRM_contactsRoute;