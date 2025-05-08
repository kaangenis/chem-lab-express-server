import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationWorkerModel, OrganizationHolderModel } from "../../models/Organization";
import { CRM_ContactModel } from "../../models/CRM/CRM_Customer";


export async function createNewContactFromWorkerSide(req: any, res: any) {
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
            contactName,
            contactPhone1,
            contactDetails,
            contactOtherDetails,
            contactAssistantDetails,
        } = req.body;

        if (!contactName || !contactPhone1 || !contactDetails || !contactOtherDetails || !contactAssistantDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents.",
                data: [],
            });
            return;
        }

        const contactId = uuidv4();

        const newContact = new CRM_ContactModel({
            contactId,
            contactName,
            contactPhone1,
            contactDetails,
            contactOtherDetails,
            contactAssistantDetails,
        });

        try {
            await newContact.save();
            res.status(200).json({
                status: true,
                msg: "Contact created successfully.",
                data: newContact,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating contact.",
                data: [],
            });
            return;
        }
    });
};

export async function createNewContactFromHolderSide(req: any, res: any) {
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
            contactName,
            contactPhone1,
            contactDetails,
            contactOtherDetails,
            contactAssistantDetails,
        } = req.body;

        if (!contactName || !contactPhone1 || !contactDetails || !contactOtherDetails || !contactAssistantDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents.",
                data: [],
            });
            return;
        }

        const contactId = uuidv4();

        const newContact = new CRM_ContactModel({
            contactId,
            contactName,
            contactPhone1,
            contactDetails,
            contactOtherDetails,
            contactAssistantDetails,
        });

        try {
            await newContact.save();
            res.status(200).json({
                status: true,
                msg: "Contact created successfully.",
                data: newContact,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating contact.",
                data: [],
            });
            return;
        }
    });
};

export async function getInitialContactsFromWorkerSide(req: any, res: any) {
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


        const contacts = await CRM_ContactModel.find({
            contactOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!contacts || contacts.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No contacts found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Contacts fetched successfully.",
            data: contacts,
        });
        return;
    });
};

export async function getMoreContactsFromWorkerSide(req: any, res: any) {
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

        const { lastId } = req.query;

        try {
            const contacts = await CRM_ContactModel.find({
                contactOrganizationId: findOrganization.organizationId,
                _id: { $gt: lastId },
                isDeleted: false,
                status: true,
            }).sort({ createdAt: -1 }).limit(10);

            if (!contacts || contacts.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No contacts found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Contacts fetched successfully.",
                data: contacts,
                lastPage: contacts.length < 10 ? true : false,
                lastId: contacts[contacts.length - 1]._id,
                itemCount: contacts.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching contacts."
            });
            return;
        }
    });
};

export async function getInitialContactsFromHolderSide(req: any, res: any) {
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


        const contacts = await CRM_ContactModel.find({
            contactOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!contacts || contacts.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No contacts found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Contacts fetched successfully.",
            data: contacts,
        });
        return;
    });
};

export async function getMoreContactsFromHolderSide(req: any, res: any) {
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

        const { lastId } = req.query;

        try {
            const contacts = await CRM_ContactModel.find({
                contactOrganizationId: findOrganization.organizationId,
                _id: { $gt: lastId },
                isDeleted: false,
                status: true,
            }).sort({ createdAt: -1 }).limit(10);

            if (!contacts || contacts.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No contacts found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Contacts fetched successfully.",
                data: contacts,
                lastPage: contacts.length < 10 ? true : false,
                lastId: contacts[contacts.length - 1]._id,
                itemCount: contacts.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching contacts."
            });
            return;
        }
    });
};

export async function updateContactFromWorkerSide(req: any, res: any) {
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

        const { contactId } = req.params;

        const { contactName, contactPhone1, contactDetails, contactOtherDetails, contactAssistantDetails } = req.body;

        const updateContact = await CRM_ContactModel.findOneAndUpdate({ contactId }, { contactName, contactPhone1, contactDetails, contactOtherDetails, contactAssistantDetails }, { new: true });

        if (!updateContact) {
            res.status(400).json({
                status: false,
                msg: "Contact not found."
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Contact updated successfully.",
            data: updateContact,
        });
        return;
    });
};

export async function updateContactFromHolderSide(req: any, res: any) {
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

        const { contactId } = req.params;

        const { contactName, contactPhone1, contactDetails, contactOtherDetails, contactAssistantDetails } = req.body;

        const updateContact = await CRM_ContactModel.findOneAndUpdate({ contactId }, { contactName, contactPhone1, contactDetails, contactOtherDetails, contactAssistantDetails }, { new: true });

        if (!updateContact) {
            res.status(400).json({
                status: false,
                msg: "Contact not found."
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Contact updated successfully.",
            data: updateContact,
        });
        return;
    });
};

export async function deleteContactFromWorkerSide(req: any, res: any) {
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

        const { contactId } = req.params;

        const deleteContact = await CRM_ContactModel.findOneAndUpdate({ contactId }, { isDeleted: true }, { new: true });

        if (!deleteContact) {
            res.status(400).json({
                status: false,
                msg: "Contact not found."
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Contact deleted successfully.",
            data: deleteContact,
        });
        return;
    });
};

export async function deleteContactFromHolderSide(req: any, res: any) {
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

        const { contactId } = req.params;

        const deleteContact = await CRM_ContactModel.findOneAndUpdate({ contactId }, { isDeleted: true }, { new: true });

        if (!deleteContact) {
            res.status(400).json({
                status: false,
                msg: "Contact not found."
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Contact deleted successfully.",
            data: deleteContact,
        });
        return;
    });
};

export async function searchContactsFromWorkerSide(req: any, res: any) {
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

        const contacts = await CRM_ContactModel.find({
            contactOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        res.status(200).json({
            status: true,
            msg: "Contacts fetched successfully.",
            data: contacts,
        });
        return;
    });
};

export async function searchContactsFromHolderSide(req: any, res: any) {
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

        const contacts = await CRM_ContactModel.find({
            contactOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        res.status(200).json({
            status: true,
            msg: "Contacts fetched successfully.",
            data: contacts,
        });
        return;
    });
};