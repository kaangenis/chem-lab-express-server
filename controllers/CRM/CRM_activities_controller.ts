import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationWorkerModel, OrganizationHolderModel } from "../../models/Organization";
import { CRM_ActivitesModel } from "../../models/CRM/CRM_Activities";

export async function createNewActivityFromWorkerSide(req: any, res: any) {
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
            activityCustomerId,
            activityCustomerName,
            activityContacts,
            activityType,
            activityStatus,
            activityDate,
            activityOtherDetails
        } = req.body;

        if (
            !activityCustomerId ||
            !activityCustomerName ||
            !activityContacts ||
            !activityType ||
            !activityStatus ||
            !activityDate ||
            !activityOtherDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        //Add customer support later

        const activityId = uuidv4();

        const newActivity = new CRM_ActivitesModel({
            activityId: activityId,
            activityOrganizationId: findOrganization.organizationId,
            activityCustomerId: activityCustomerId,
            activityCustomerName: activityCustomerName,
            activityContacts: activityContacts,
            activityType: activityType,
            activityStatus: activityStatus,
            activityDate: activityDate,
            activityOtherDetails: activityOtherDetails,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newActivity.save();
            res.status(200).json({
                status: true,
                msg: "Activity created successfully.",
                data: newActivity,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating activity."
            });
            return;
        };
    });
};

export async function createNewActivityFromHolderSide(req: any, res: any) {
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

        const {
            activityCustomerId,
            activityCustomerName,
            activityContacts,
            activityType,
            activityStatus,
            activityDate,
            activityOtherDetails
        } = req.body;

        if (
            !activityCustomerId ||
            !activityCustomerName ||
            !activityContacts ||
            !activityType ||
            !activityStatus ||
            !activityDate ||
            !activityOtherDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const activityId = uuidv4();

        const newActivity = new CRM_ActivitesModel({
            activityId: activityId,
            activityOrganizationId: findOrganization.organizationId,
            activityCustomerId: activityCustomerId,
            activityCustomerName: activityCustomerName,
            activityContacts: activityContacts,
            activityType: activityType,
            activityStatus: activityStatus,
            activityDate: activityDate,
            activityOtherDetails: activityOtherDetails,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newActivity.save();
            res.status(200).json({
                status: true,
                msg: "Activity created successfully.",
                data: newActivity,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating activity."
            });
            return;
        };
    });
};

export async function getInitialActivitiesFromWorkerSide(req: any, res: any) {
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

        const activities = await CRM_ActivitesModel.find({
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!activities || activities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Activities fetched successfully.",
            data: activities,
        });
        return;
    });
};

export async function getMoreActivitiesFromWorkerSide(req: any, res: any) {
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

        const activities = await CRM_ActivitesModel.find({
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!activities || activities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Activities fetched successfully.",
            data: activities,
            lastPage: activities.length < 10 ? true : false,
            lastId: activities[activities.length - 1]._id,
            itemCount: activities.length,
        });
        return;
    });
};

export async function getInitialActivitiesFromHolderSide(req: any, res: any) {
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

        const activities = await CRM_ActivitesModel.find({
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!activities || activities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Activities fetched successfully.",
            data: activities,
        });
        return;
    });
};

export async function getMoreActivitiesFromHolderSide(req: any, res: any) {
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

        const activities = await CRM_ActivitesModel.find({
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 }).limit(10);

        if (!activities || activities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Activities fetched successfully.",
            data: activities,
            lastPage: activities.length < 10 ? true : false,
            lastId: activities[activities.length - 1]._id,
            itemCount: activities.length,
        });
        return;
    });
};

export async function updateActivityFromWorkerSide(req: any, res: any) {
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
            activityId,
            activityCustomerId,
            activityCustomerName,
            activityContacts,
            activityType,
            activityStatus,
            activityDate,
            activityOtherDetails
        } = req.body;

        if (!activityId ||
            !activityCustomerId ||
            !activityCustomerName ||
            !activityContacts ||
            !activityType ||
            !activityStatus ||
            !activityDate ||
            !activityOtherDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findActivity = await CRM_ActivitesModel.findOne({
            activityId: activityId,
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findActivity) {
            res.status(400).json({
                status: false,
                msg: "Activity not found."
            });
            return;
        };

        findActivity.activityCustomerId = activityCustomerId;
        findActivity.activityCustomerName = activityCustomerName;
        findActivity.activityContacts = activityContacts;
        findActivity.activityType = activityType;
        findActivity.activityStatus = activityStatus;
        findActivity.activityDate = activityDate;
        findActivity.activityOtherDetails = activityOtherDetails;
        findActivity.updatedAt = req.currentTime;

        try {
            await findActivity.save();
            res.status(200).json({
                status: true,
                msg: "Activity updated successfully.",
                data: findActivity,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating activity."
            });
            return;
        };
    });
};

export async function updateActivityFromHolderSide(req: any, res: any) {
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

        const {
            activityId,
            activityCustomerId,
            activityCustomerName,
            activityContacts,
            activityType,
            activityStatus,
            activityDate,
            activityOtherDetails
        } = req.body;

        if (!activityId ||
            !activityCustomerId ||
            !activityCustomerName ||
            !activityContacts ||
            !activityType ||
            !activityStatus ||
            !activityDate ||
            !activityOtherDetails
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findActivity = await CRM_ActivitesModel.findOne({
            activityId: activityId,
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findActivity) {
            res.status(400).json({
                status: false,
                msg: "Activity not found."
            });
            return;
        };

        findActivity.activityCustomerId = activityCustomerId;
        findActivity.activityCustomerName = activityCustomerName;
        findActivity.activityContacts = activityContacts;
        findActivity.activityType = activityType;
        findActivity.activityStatus = activityStatus;
        findActivity.activityDate = activityDate;
        findActivity.activityOtherDetails = activityOtherDetails;
        findActivity.updatedAt = req.currentTime;

        try {
            await findActivity.save();
            res.status(200).json({
                status: true,
                msg: "Activity updated successfully.",
                data: findActivity,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating activity."
            });
            return;
        };
    });
};

export async function deleteActivityFromWorkerSide(req: any, res: any) {
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
            activityId,
        } = req.body;

        if (!activityId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findActivity = await CRM_ActivitesModel.findOne({
            activityId: activityId,
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findActivity) {
            res.status(400).json({
                status: false,
                msg: "Activity not found."
            });
            return;
        };

        findActivity.isDeleted = true;
        findActivity.status = false;

        try {
            await findActivity.save();
            res.status(200).json({
                status: true,
                msg: "Activity deleted successfully.",
                data: findActivity,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting activity."
            });
            return;
        };
    });
};

export async function deleteActivityFromHolderSide(req: any, res: any) {
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

        const {
            activityId,
        } = req.body;

        if (!activityId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findActivity = await CRM_ActivitesModel.findOne({
            activityId: activityId,
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        });

        if (!findActivity) {
            res.status(400).json({
                status: false,
                msg: "Activity not found."
            });
            return;
        };

        findActivity.isDeleted = true;
        findActivity.status = false;

        try {
            await findActivity.save();
            res.status(200).json({
                status: true,
                msg: "Activity deleted successfully.",
                data: findActivity,
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting activity."
            });
            return;
        };
    });
};

export async function searchActivityWithActivityCustomerNameFromWorkerSide(req: any, res: any) {
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
            activityCustomerName,
        } = req.params;

        if (!activityCustomerName) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const activities = await CRM_ActivitesModel.find({
            activityCustomerName: { $regex: activityCustomerName, $options: "i" },
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 });

        if (!activities || activities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Activities fetched successfully.",
            data: activities,
        });
        return;
    });
};

export async function searchActivityWithActivityCustomerNameFromHolderSide(req: any, res: any) {
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

        const {
            activityCustomerName,
        } = req.params;

        if (!activityCustomerName) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const activities = await CRM_ActivitesModel.find({
            activityCustomerName: { $regex: activityCustomerName, $options: "i" },
            activityOrganizationId: findOrganization.organizationId,
            isDeleted: false,
            status: true,
        }).sort({ createdAt: -1 });

        if (!activities || activities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Activities fetched successfully.",
            data: activities,
        });
        return;
    });
};
