import { Router } from "express";
import {
    createNewCustomerFromWorkerSide,
    createNewCustomerFromHolderSide,
    getInitialCustomersFromWorkerSide,
    getMoreCustomersFromWorkerSide,
    getInitialCustomersFromHolderSide,
    getMoreCustomersFromHolderSide,
    updateCustomerFromWorkerSide,
    updateCustomerFromHolderSide,
    deleteCustomerFromWorkerSide,
    deleteCustomerFromHolderSide,
    searchCustomerFromWorkerSide,
    searchCustomerFromHolderSide,
} from "../../controllers/CRM/CRM_customer_controller";


const CRM_customersRoute: Router = Router();

CRM_customersRoute.post("/worker/create-new-customer", createNewCustomerFromWorkerSide);
CRM_customersRoute.post("/holder/create-new-customer", createNewCustomerFromHolderSide);

CRM_customersRoute.get("/worker/get-initial-customers", getInitialCustomersFromWorkerSide);
CRM_customersRoute.get("/worker/get-more-customers", getMoreCustomersFromWorkerSide);

CRM_customersRoute.get("/holder/get-initial-customers", getInitialCustomersFromHolderSide);
CRM_customersRoute.get("/holder/get-more-customers", getMoreCustomersFromHolderSide);

CRM_customersRoute.put("/worker/update-customer", updateCustomerFromWorkerSide);
CRM_customersRoute.put("/holder/update-customer", updateCustomerFromHolderSide);

CRM_customersRoute.delete("/worker/delete-customer", deleteCustomerFromWorkerSide);
CRM_customersRoute.delete("/holder/delete-customer", deleteCustomerFromHolderSide);

CRM_customersRoute.get("/worker/search-customers", searchCustomerFromWorkerSide);
CRM_customersRoute.get("/holder/search-customers", searchCustomerFromHolderSide);


export default CRM_customersRoute;