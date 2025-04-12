import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationWorkerModel } from "../../models/Organization";
import { CRM_ActivitesModel } from "../../models/CRM/CRM_Activities";


export async function getActivitiesFromWorkerSideLimit10(req: any, res: any) {
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

        if (user.role !== 'WORKER') {
            res.status(400).json({
                status: false,
                msg: "Invalid Role."
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
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });
        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        // Fetch all activities by organizationId
        const allActivities = await CRM_ActivitesModel.find({ activityOrganizationId: findOrganization.organizationId }).limit(10);

        if (!allActivities) {
            res.status(400).json({
                status: false,
                msg: "No activities found."
            });
            return;
        };

        if (allActivities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
                totalCount: 0,
                lastPage: true,
                lastId: null
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "All activities fetched successfully.",
            data: allActivities,
            totalCount: allActivities.length,
            lastPage: allActivities.length < 10 ? true : false,
            lastId: allActivities[allActivities.length - 1].activityId
        });

    });
};

export async function getActivitiesContinueByIdFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;
    let { lastId } = req.params;

    if (!accessToken || !lastId) {
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

        if (user.role !== 'WORKER') {
            res.status(400).json({
                status: false,
                msg: "Invalid Role."
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
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });
        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        // Fetch all activities by organizationId
        const allActivities = await CRM_ActivitesModel.find({ activityOrganizationId: findOrganization.organizationId, activityId: { $lt: lastId } }).limit(10);

        if (!allActivities) {
            res.status(400).json({
                status: false,
                msg: "No activities found."
            });
            return;
        };

        if (allActivities.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No activities found.",
                data: [],
                totalCount: 0,
                lastPage: true,
                lastId: null
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "All activities fetched successfully.",
            data: allActivities,
            totalCount: allActivities.length,
            lastPage: allActivities.length < 10 ? true : false,
            lastId: allActivities[allActivities.length - 1].activityId
        });

    });
};

export async function createNewActivityFromWorkerSide(req: any, res: any) {
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

        if (user.role !== 'WORKER') {
            res.status(400).json({
                status: false,
                msg: "Invalid Role."
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
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });
        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const { activityCustomerId, activityCustomerName, activityContacts, activityType, activityStatus, activityDate, activityOtherDetails } = req.body;

        const newActivity = new CRM_ActivitesModel({
            activityId: uuidv4(),
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

        await newActivity.save();

        res.status(200).json({
            status: true,
            msg: "New Activity Created Successfully.",
            data: newActivity
        });

    });
};