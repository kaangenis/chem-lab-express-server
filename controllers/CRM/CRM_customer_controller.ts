import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { CRM_CustomerAuthorizedPersonModel, CRM_CustomerModel } from "../../models/CRM/CRM_Customer";

export async function createNewCustomer(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const {
            customerInformations,
            customerContactDetails,
            customerFinancialDetails,
            customerSocialMediaDetails,
        } = req.body;

        if (
            !customerInformations ||
            !customerContactDetails ||
            !customerFinancialDetails ||
            !customerSocialMediaDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const customerId = uuidv4();
        const customerOrganizationId = user.organizationId;

        const newCustomer = new CRM_CustomerModel({
            customerId,
            customerOrganizationId,
            customerInformations,
            customerContactDetails,
            customerFinancialDetails,
            customerSocialMediaDetails,
            isDeleted: false,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer Created Successfully.",
                data: newCustomer
            });
            return;
        }
        catch (error: any) {
            res.status(500).json({
                status: false,
                msg: "Internal Server Error.",
                error: error.message
            });
            return;
        }

    });

};

export async function getInitialCustomers(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findCustomer = await CRM_CustomerModel.find({ customerOrganizationId: user.organizationId }).limit(10);

        if (!findCustomer) {
            res.status(200).json({
                status: false,
                msg: "Customer not found.",
                data: [],
                lastPage: true,
                lastId: ""
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Customer Found Successfully.",
            data: findCustomer,
            lastPage: findCustomer.length < 10 ? true : false,
            lastId: findCustomer[findCustomer.length - 1].customerId
        });

    });

};

export async function getMoreCustomers(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findCustomer = await CRM_CustomerModel.find({ customerOrganizationId: user.organizationId, customerId: { $lt: lastId } }).limit(10);

        if (!findCustomer) {
            res.status(200).json({
                status: false,
                msg: "Customer not found.",
                data: [],
            });
            return;
        };

        if (findCustomer.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No more customers found.",
                data: [],
                lastPage: true,
                lastId: null
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Customers Found Successfully.",
            data: findCustomer,
            lastPage: findCustomer.length < 10 ? true : false,
            lastId: findCustomer[findCustomer.length - 1].customerId
        });

    });
};

export async function createNewAuthorizedPerson(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        };


        const { customerAuthorizedPersonName, customerAuthorizedPersonDetails, customerAssistantDetails } = req.body;

        if (!customerAuthorizedPersonName || !customerAuthorizedPersonDetails || !customerAssistantDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const customerAuthorizedPersonId = uuidv4();

        const newAuthorizedPerson = new CRM_CustomerAuthorizedPersonModel({
            customerAuthorizedPersonId: customerAuthorizedPersonId,
            customerOrganizationId: "",
            customerAuthorizedPersonName: customerAuthorizedPersonName,
            customerAuthorizedPersonDetails: customerAuthorizedPersonDetails,
            customerAssistantDetails: customerAssistantDetails,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newAuthorizedPerson.save();
            res.status(200).json({
                status: true,
                msg: "Authorized Person Created Successfully.",
                data: newAuthorizedPerson
            });
            return;
        }
        catch (error: any) {
            res.status(500).json({
                status: false,
                msg: "Internal Server Error.",
                error: error.message
            });
            return;
        }

    });
};

export async function getInitialAuthorizedPersons(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findAuthorizedPerson = await CRM_CustomerAuthorizedPersonModel.find({}).limit(10);

        if (!findAuthorizedPerson) {
            res.status(200).json({
                status: false,
                msg: "Authorized Person not found.",
                data: [],
                lastPage: true,
                lastId: ""
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Authorized Person Found Successfully.",
            data: findAuthorizedPerson,
            lastPage: findAuthorizedPerson.length < 10 ? true : false,
            lastId: findAuthorizedPerson[findAuthorizedPerson.length - 1].customerAuthorizedPersonId
        });

    });

};

export async function getMoreAuthorizedPersons(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findAuthorizedPerson = await CRM_CustomerAuthorizedPersonModel.find({ customerAuthorizedPersonId: { $lt: lastId } }).limit(10);

        if (!findAuthorizedPerson) {
            res.status(200).json({
                status: false,
                msg: "Authorized Person not found.",
                data: [],
            });
            return;
        };

        if (findAuthorizedPerson.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No more authorized persons found.",
                data: [],
                lastPage: true,
                lastId: null
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Authorized Persons Found Successfully.",
            data: findAuthorizedPerson,
            lastPage: findAuthorizedPerson.length < 10 ? true : false,
            lastId: findAuthorizedPerson[findAuthorizedPerson.length - 1].customerAuthorizedPersonId
        });

    });
};