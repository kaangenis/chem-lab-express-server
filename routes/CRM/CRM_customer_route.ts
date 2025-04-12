import { Router } from "express";
import { createNewAuthorizedPerson, createNewCustomer, getInitialAuthorizedPersons, getInitialCustomers, getMoreAuthorizedPersons, getMoreCustomers } from "../../controllers/CRM/CRM_customer_controller";

const CRM_customerRoute: Router = Router();

CRM_customerRoute.post("/general/create-new-customer", createNewCustomer);
CRM_customerRoute.get("/general/get-initial-customers", getInitialCustomers);
CRM_customerRoute.get("/general/get-more-customers", getMoreCustomers);
CRM_customerRoute.post("/general/create-new-authorized-person", createNewAuthorizedPerson);
CRM_customerRoute.get("/general/get-initial-authorized-persons", getInitialAuthorizedPersons);
CRM_customerRoute.get("/general/get-more-authorized-persons", getMoreAuthorizedPersons);

export default CRM_customerRoute;
