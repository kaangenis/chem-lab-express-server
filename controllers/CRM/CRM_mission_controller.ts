import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationHolderModel, OrganizationWorkerModel } from "../../models/Organization";
import { CRM_MissionsModel } from "../../models/CRM/CRM_Missions";

export async function createNewMissionFromWorkerSide(req: any, res: any) {
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

        const {
            missionTitle,
            missionCreatorDetails,
            missionStatus,
            missionStartDate,
            missionsDetails,
            missionOtherDetails,
            missionCustomerDetails,
            addToAgenda
        } = req.body;

        if (
            !missionTitle ||
            !missionCreatorDetails ||
            !missionStatus ||
            !missionStartDate ||
            !missionsDetails ||
            !missionOtherDetails ||
            !missionCustomerDetails ||
            !addToAgenda
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID })

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const missionId = uuidv4();

        const createNewMission = await CRM_MissionsModel.create({
            missionId: missionId,
            missionOrganizationId: findOrganization.organizationId,
            missionTitle: missionTitle,
            missionCreatorDetails: missionCreatorDetails,
            missionStatus: missionStatus,
            missionStartDate: missionStartDate,
            missionsDetails: missionsDetails,
            missionOtherDetails: missionOtherDetails,
            missionCustomerDetails: missionCustomerDetails,
            addToAgenda: addToAgenda,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        })

        try {
            await createNewMission.save();
            res.status(200).json({
                status: true,
                msg: "Mission created successfully.",
                data: createNewMission
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating mission."
            });
            return;
        }
    });
};

export async function createNewMissionFromHolderSide(req: any, res: any) {
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

        const {
            missionTitle,
            missionCreatorDetails,
            missionStatus,
            missionStartDate,
            missionsDetails,
            missionOtherDetails,
            missionCustomerDetails,
            addToAgenda
        } = req.body;

        if (
            !missionTitle ||
            !missionCreatorDetails ||
            !missionStatus ||
            !missionStartDate ||
            !missionsDetails ||
            !missionOtherDetails ||
            !missionCustomerDetails ||
            !addToAgenda
        ) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID })

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const missionId = uuidv4();

        const createNewMission = await CRM_MissionsModel.create({
            missionId: missionId,
            missionOrganizationId: findOrganization.organizationId,
            missionTitle: missionTitle,
            missionCreatorDetails: missionCreatorDetails,
            missionStatus: missionStatus,
            missionStartDate: missionStartDate,
            missionsDetails: missionsDetails,
            missionOtherDetails: missionOtherDetails,
            missionCustomerDetails: missionCustomerDetails,
            addToAgenda: addToAgenda,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        })

        try {
            await createNewMission.save();
            res.status(200).json({
                status: true,
                msg: "Mission created successfully.",
                data: createNewMission
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating mission."
            });
            return;
        }
    });
};

export async function getInitialMissionsFromWorkerSide(req: any, res: any) {
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

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID })

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const missions = await CRM_MissionsModel.find({ missionOrganizationId: findOrganization.organizationId, isDeleted: false, status: true }).sort({ createdAt: -1 })

        if (!missions || missions.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No missions found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Missions fetched successfully.",
            data: missions,
            lastPage: missions.length < 10 ? true : false,
            lastId: missions[missions.length - 1]._id,
            itemCount: missions.length
        });
        return;
    });
};

export async function getMoreMissionsFromWorkerSide(req: any, res: any) {
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

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID })

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        };

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const missions = await CRM_MissionsModel.find({ missionOrganizationId: findOrganization.organizationId, isDeleted: false, status: true }).sort({ createdAt: -1 })

        if (!missions || missions.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No missions found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Missions fetched successfully.",
            data: missions,
            lastPage: missions.length < 10 ? true : false,
            lastId: missions[missions.length - 1]._id,
            itemCount: missions.length
        });
        return;
    });
};

export async function getInitialMissionsFromHolderSide(req: any, res: any) {
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

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID })

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const missions = await CRM_MissionsModel.find({ missionOrganizationId: findOrganization.organizationId, isDeleted: false, status: true }).sort({ createdAt: -1 })

        if (!missions || missions.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No missions found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Missions fetched successfully.",
            data: missions,
            lastPage: missions.length < 10 ? true : false,
            lastId: missions[missions.length - 1]._id,
            itemCount: missions.length
        });
        return;
    });
};

export async function getMoreMissionsFromHolderSide(req: any, res: any) {
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

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID })

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const missions = await CRM_MissionsModel.find({ missionOrganizationId: findOrganization.organizationId, isDeleted: false, status: true }).sort({ createdAt: -1 })

        if (!missions || missions.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No missions found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Missions fetched successfully.",
            data: missions,
            lastPage: missions.length < 10 ? true : false,
            lastId: missions[missions.length - 1]._id,
            itemCount: missions.length
        });
        return;
    });
};

export async function updateMissionFromWorkerSide(req: any, res: any) {
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

        const {
            missionId,
            missionTitle,
            missionCreatorDetails,
            missionStatus,
            missionStartDate,
            missionsDetails,
            missionOtherDetails,
            missionCustomerDetails
        } = req.body;

        if (!missionId || !missionTitle || !missionCreatorDetails || !missionStatus || !missionStartDate || !missionsDetails || !missionOtherDetails || !missionCustomerDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID })

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const findMission = await CRM_MissionsModel.findOne({ missionOrganizationId: findOrganization.organizationId, missionId: missionId, isDeleted: false, status: true })

        if (!findMission) {
            res.status(400).json({
                status: false,
                msg: "Mission not found."
            });
            return;
        }

        findMission.missionTitle = missionTitle;
        findMission.missionCreatorDetails = missionCreatorDetails;
        findMission.missionStatus = missionStatus;
        findMission.missionStartDate = missionStartDate;
        findMission.missionsDetails = missionsDetails;
        findMission.missionOtherDetails = missionOtherDetails;
        findMission.missionCustomerDetails = missionCustomerDetails;

        try {
            await findMission.save();
            res.status(200).json({
                status: true,
                msg: "Mission updated successfully.",
                data: findMission
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating mission."
            });
            return;
        }
    });
};

export async function updateMissionFromHolderSide(req: any, res: any) {
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

        const {
            missionId,
            missionTitle,
            missionCreatorDetails,
            missionStatus,
            missionStartDate,
            missionsDetails,
            missionOtherDetails,
            missionCustomerDetails
        } = req.body;

        if (!missionId || !missionTitle || !missionCreatorDetails || !missionStatus || !missionStartDate || !missionsDetails || !missionOtherDetails || !missionCustomerDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID })

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const findMission = await CRM_MissionsModel.findOne({ missionOrganizationId: findOrganization.organizationId, missionId: missionId, isDeleted: false, status: true })

        if (!findMission) {
            res.status(400).json({
                status: false,
                msg: "Mission not found."
            });
            return;
        }

        findMission.missionTitle = missionTitle;
        findMission.missionCreatorDetails = missionCreatorDetails;
        findMission.missionStatus = missionStatus;
        findMission.missionStartDate = missionStartDate;
        findMission.missionsDetails = missionsDetails;
        findMission.missionOtherDetails = missionOtherDetails;
        findMission.missionCustomerDetails = missionCustomerDetails;

        try {
            await findMission.save();
            res.status(200).json({
                status: true,
                msg: "Mission updated successfully.",
                data: findMission
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating mission."
            });
            return;
        }
    });
};

export async function deleteMissionFromWorkerSide(req: any, res: any) {
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

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID })

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const {
            missionId
        } = req.body;

        if (!missionId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findMission = await CRM_MissionsModel.findOne({ missionOrganizationId: findOrganization.organizationId, missionId: missionId, isDeleted: false, status: true })

        if (!findMission) {
            res.status(400).json({
                status: false,
                msg: "Mission not found."
            });
            return;
        }

        findMission.isDeleted = true;
        findMission.status = false;

        try {
            await findMission.save();
            res.status(200).json({
                status: true,
                msg: "Mission deleted successfully.",
                data: findMission
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting mission."
            });
            return;
        }
    });
};

export async function deleteMissionFromHolderSide(req: any, res: any) {
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

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID })

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const {
            missionId
        } = req.body;

        if (!missionId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findMission = await CRM_MissionsModel.findOne({ missionOrganizationId: findOrganization.organizationId, missionId: missionId, isDeleted: false, status: true })

        if (!findMission) {
            res.status(400).json({
                status: false,
                msg: "Mission not found."
            });
            return;
        };

        findMission.isDeleted = true;
        findMission.status = false;

        try {
            await findMission.save();
            res.status(200).json({
                status: true,
                msg: "Mission deleted successfully.",
                data: findMission
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting mission."
            });
            return;
        }
    });
};

export async function searchMissionWithMissionTitleFromWorkerSide(req: any, res: any) {
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

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID })

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker not found."
            });
            return;
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const {
            missionTitle
        } = req.params;

        if (!missionTitle) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const missions = await CRM_MissionsModel.find({ missionOrganizationId: findOrganization.organizationId, missionTitle: { $regex: missionTitle, $options: "i" }, isDeleted: false, status: true }).sort({ createdAt: -1 })

        if (!missions || missions.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No missions found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        } else {
            res.status(200).json({
                status: true,
                msg: "Missions fetched successfully.",
                data: missions,
                lastPage: missions.length < 10 ? true : false,
                lastId: missions[missions.length - 1]._id,
                itemCount: missions.length
            });
            return;
        }
    });
};

export async function searchMissionWithMissionTitleFromHolderSide(req: any, res: any) {
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

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID })

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder not found."
            });
            return;
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const {
            missionTitle
        } = req.params;

        if (!missionTitle) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const missions = await CRM_MissionsModel.find({ missionOrganizationId: findOrganization.organizationId, missionTitle: { $regex: missionTitle, $options: "i" }, isDeleted: false, status: true }).sort({ createdAt: -1 })

        if (!missions || missions.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No missions found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        } else {
            res.status(200).json({
                status: true,
                msg: "Missions fetched successfully.",
                data: missions,
                lastPage: missions.length < 10 ? true : false,
                lastId: missions[missions.length - 1]._id,
                itemCount: missions.length
            });
            return;
        }
    });
};