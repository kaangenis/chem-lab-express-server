import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationWorkerModel, OrganizationHolderModel } from "../../models/Organization";
import { CRM_CustomerModel } from "../../models/CRM/CRM_Customer";


export async function createNewCustomerFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const {
            customerName,
            customerPhone1,
            customerInformations,
            customerAuthorizedData,
            customerContactDetails,
            customerFinancialDetails,
            customerSocialMediaDetails
        } = req.body;


        if (
            !customerName ||
            !customerPhone1 ||
            !customerInformations ||
            !customerAuthorizedData ||
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
        const customerOrganizationId = findOrganization.organizationId;

        const newCustomer = new CRM_CustomerModel({
            customerId: customerId,
            customerOrganizationId: customerOrganizationId,
            customerName: customerName,
            customerPhone1: customerPhone1,
            customerInformations: customerInformations,
            customerAuthorizedData: customerAuthorizedData,
            customerContactDetails: customerContactDetails,
            customerFinancialDetails: customerFinancialDetails,
            customerSocialMediaDetails: customerSocialMediaDetails,
        });


        try {
            await newCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer created successfully.",
                data: newCustomer,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating customer."
            });
            return;
        };
    });
};

export async function createNewCustomerFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const {
            customerName,
            customerPhone1,
            customerInformations,
            customerAuthorizedData,
            customerContactDetails,
            customerFinancialDetails,
            customerSocialMediaDetails
        } = req.body;


        if (
            !customerName ||
            !customerPhone1 ||
            !customerInformations ||
            !customerAuthorizedData ||
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
        const customerOrganizationId = findOrganization.organizationId;

        const newCustomer = new CRM_CustomerModel({
            customerId: customerId,
            customerOrganizationId: customerOrganizationId,
            customerName: customerName,
            customerPhone1: customerPhone1,
            customerInformations: customerInformations,
            customerAuthorizedData: customerAuthorizedData,
            customerContactDetails: customerContactDetails,
            customerFinancialDetails: customerFinancialDetails,
            customerSocialMediaDetails: customerSocialMediaDetails,
        });


        try {
            await newCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer created successfully.",
                data: newCustomer,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating customer."
            });
            return;
        };
    });
};

export async function getInitialCustomersFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        };

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const customers = await CRM_CustomerModel.find({
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!customers || customers.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No customers found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Customers fetched successfully.",
            data: customers,
        });
        return;
    });
};

export async function getMoreCustomersFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        };

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };
        try {
            const customers = await CRM_CustomerModel.find({
                customerOrganizationId: findOrganization.organizationId,
                _id: { $gt: lastId },
                isDeleted: false,
                status: true,
            }).sort({ createdAt: -1 }).limit(10);

            if (!customers || customers.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No customers found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Customers fetched successfully.",
                data: customers,
                lastPage: customers.length < 10 ? true : false,
                lastId: customers[customers.length - 1]._id,
                itemCount: customers.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching customers."
            });
            return;
        }
    });
};

export async function getInitialCustomersFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        };

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const customers = await CRM_CustomerModel.find({
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!customers || customers.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No customers found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Customers fetched successfully.",
            data: customers,
        });
        return;
    });
};

export async function getMoreCustomersFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        };

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        try {
            const customers = await CRM_CustomerModel.find({
                customerOrganizationId: findOrganization.organizationId,
                _id: { $gt: lastId },
                isDeleted: false,
                status: true,
            }).sort({ createdAt: -1 }).limit(10);

            if (!customers || customers.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No customers found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Customers fetched successfully.",
                data: customers,
                lastPage: customers.length < 10 ? true : false,
                lastId: customers[customers.length - 1]._id,
                itemCount: customers.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching customers."
            });
            return;
        }
    });
};

export async function updateCustomerFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        };

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const {
            customerId,
            customerName,
            customerPhone1,
            customerInformations,
            customerContactDetails,
            customerFinancialDetails,
            customerSocialMediaDetails,
            customerAuthorizedData,
        } = req.body;

        if (
            !customerId ||
            !customerName ||
            !customerPhone1 ||
            !customerInformations ||
            !customerAuthorizedData ||
            !customerContactDetails ||
            !customerFinancialDetails ||
            !customerSocialMediaDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findCustomer = await CRM_CustomerModel.findOne({
            customerId: customerId,
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true
        });

        if (!findCustomer) {
            res.status(400).json({
                status: false,
                msg: "Customer not found."
            });
            return;
        };

        findCustomer.customerName = customerName;
        findCustomer.customerPhone1 = customerPhone1;
        findCustomer.customerInformations = customerInformations;
        findCustomer.customerAuthorizedData = customerAuthorizedData;
        findCustomer.customerContactDetails = customerContactDetails;
        findCustomer.customerFinancialDetails = customerFinancialDetails;
        findCustomer.customerSocialMediaDetails = customerSocialMediaDetails;

        try {
            await findCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer updated successfully.",
                data: findCustomer,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating customer."
            });
            return;
        }
    });
};

export async function updateCustomerFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const {
            customerId,
            customerName,
            customerPhone1,
            customerInformations,
            customerAuthorizedData,
            customerContactDetails,
            customerFinancialDetails,
            customerSocialMediaDetails,
        } = req.body;

        if (
            !customerId ||
            !customerName ||
            !customerPhone1 ||
            !customerInformations ||
            !customerAuthorizedData ||
            !customerContactDetails ||
            !customerFinancialDetails ||
            !customerSocialMediaDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findCustomer = await CRM_CustomerModel.findOne({
            customerId: customerId,
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findCustomer) {
            res.status(400).json({
                status: false,
                msg: "Customer not found."
            });
            return;
        };

        findCustomer.customerName = customerName;
        findCustomer.customerPhone1 = customerPhone1;
        findCustomer.customerInformations = customerInformations;
        findCustomer.customerAuthorizedData = customerAuthorizedData;
        findCustomer.customerContactDetails = customerContactDetails;
        findCustomer.customerFinancialDetails = customerFinancialDetails;
        findCustomer.customerSocialMediaDetails = customerSocialMediaDetails;

        try {
            await findCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer updated successfully.",
                data: findCustomer,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating customer."
            });
            return;
        }
    });
};

export async function deleteCustomerFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const { customerId } = req.body;

        if (!customerId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findCustomer = await CRM_CustomerModel.findOne({
            customerId: customerId,
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findCustomer) {
            res.status(400).json({
                status: false,
                msg: "Customer not found."
            });
            return;
        }

        findCustomer.isDeleted = true;
        findCustomer.status = false;

        try {
            await findCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer deleted successfully.",
                data: findCustomer,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting customer."
            });
            return;
        }
    });
};

export async function deleteCustomerFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const { customerId } = req.body;

        if (!customerId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findCustomer = await CRM_CustomerModel.findOne({
            customerId: customerId,
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findCustomer) {
            res.status(400).json({
                status: false,
                msg: "Customer not found."
            });
            return;
        }

        findCustomer.isDeleted = true;
        findCustomer.status = false;

        try {
            await findCustomer.save();
            res.status(200).json({
                status: true,
                msg: "Customer deleted successfully.",
                data: findCustomer,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting customer."
            });
            return;
        }
    });
};

export async function searchCustomerFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });

            return;
        }

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const { searchQuery } = req.query;

        if (!searchQuery) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const customers = await CRM_CustomerModel.find({
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
            $or: [
                { customerName: { $regex: searchQuery, $options: "i" } },
                { customerPhone1: { $regex: searchQuery, $options: "i" } },
            ],
        });

        if (!customers || customers.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No customers found.",
                data: [],
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Customers fetched successfully.",
            data: customers,
        });
        return;
    });
};

export async function searchCustomerFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    let splitToken = accessToken.split(' ')[1];

    jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access") {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const { searchQuery } = req.query;

        if (!searchQuery) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const customers = await CRM_CustomerModel.find({
            customerOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
            $or: [
                { customerName: { $regex: searchQuery, $options: "i" } },
                { customerPhone1: { $regex: searchQuery, $options: "i" } },
            ],
        });

        if (!customers || customers.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No customers found.",
                data: [],
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Customers fetched successfully.",
            data: customers,
        });
        return;
    });
};