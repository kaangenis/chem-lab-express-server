import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationHolderModel, OrganizationWorkerModel } from "../../models/Organization";
import { CRM_MeasurementModel } from "../../models/CRM/CRM_Measurement";

export async function createNewMeasurementFromWorkerSide(req: any, res: any) {
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
            measurementName,
            measurementAuthorizedPersons,
            measurementInformations,
            measurementOtherDetails,
            measurementDeviceDetails,
            measurementParameters,
            measurementBarcodes,
            measurementPlanningId,
            measurementStartDate,
            measurementEndDate,
        } = req.body;

        if (
            !measurementName ||
            !measurementAuthorizedPersons ||
            !measurementInformations ||
            !measurementOtherDetails ||
            !measurementDeviceDetails ||
            !measurementParameters ||
            !measurementBarcodes ||
            !measurementPlanningId ||
            !measurementStartDate ||
            !measurementEndDate
        ) {
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

        const measurementId = uuidv4();

        const createNewMeasurement = await CRM_MeasurementModel.create({
            measurementId: measurementId,
            measurementName: measurementName,
            measurementOrganizationId: findOrganization.organizationId,
            measurementPlanningId: measurementPlanningId,
            measurementStartDate: measurementStartDate,
            measurementEndDate: measurementEndDate,
            measurementAuthorizedPersons: measurementAuthorizedPersons,
            measurementInformations: measurementInformations,
            measurementOtherDetails: measurementOtherDetails,
            measurementDeviceDetails: measurementDeviceDetails,
            measurementParameters: measurementParameters,
            measurementBarcodes: measurementBarcodes,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        })

        try {
            await createNewMeasurement.save();
            res.status(200).json({
                status: true,
                msg: "Measurement created successfully.",
                data: createNewMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating measurement."
            });
            return;
        }
    });

};

export async function createNewMeasurementFromHolderSide(req: any, res: any) {
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

        const {
            measurementName,
            measurementAuthorizedPersons,
            measurementInformations,
            measurementOtherDetails,
            measurementDeviceDetails,
            measurementParameters,
            measurementBarcodes,
            measurementPlanningId,
            measurementStartDate,
            measurementEndDate,
        } = req.body;

        if (
            !measurementName ||
            !measurementAuthorizedPersons ||
            !measurementInformations ||
            !measurementOtherDetails ||
            !measurementDeviceDetails ||
            !measurementParameters ||
            !measurementBarcodes ||
            !measurementPlanningId ||
            !measurementStartDate ||
            !measurementEndDate
        ) {
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

        const measurementId = uuidv4();

        const createNewMeasurement = await CRM_MeasurementModel.create({
            measurementId: measurementId,
            measurementName: measurementName,
            measurementOrganizationId: findOrganization.organizationId,
            measurementPlanningId: measurementPlanningId,
            measurementStartDate: measurementStartDate,
            measurementEndDate: measurementEndDate,
            measurementAuthorizedPersons: measurementAuthorizedPersons,
            measurementInformations: measurementInformations,
            measurementOtherDetails: measurementOtherDetails,
            measurementDeviceDetails: measurementDeviceDetails,
            measurementParameters: measurementParameters,
            measurementBarcodes: measurementBarcodes,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        })

        try {
            await createNewMeasurement.save();
            res.status(200).json({
                status: true,
                msg: "Measurement created successfully.",
                data: createNewMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error creating measurement."
            });
            return;
        }
    });
};

export async function getInitialMeasurementsFromWorkerSide(req: any, res: any) {
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

        const measurements = await CRM_MeasurementModel.find({ measurementOrganizationId: findOrganization.organizationId, isDeleted: false }).sort({ createdAt: -1 }).limit(10);

        if (!measurements || measurements.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No measurements found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Measurements fetched successfully.",
            data: measurements,
            lastPage: measurements.length < 10 ? true : false,
            lastId: measurements[measurements.length - 1]._id,
            itemCount: measurements.length
        });
        return;
    });
};

export async function getMoreMeasurementsFromWorkerSide(req: any, res: any) {
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

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        try {
            const measurements = await CRM_MeasurementModel.find({ measurementOrganizationId: findOrganization.organizationId, _id: { $gt: lastId }, isDeleted: false }).limit(10);

            if (!measurements || measurements.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No measurements found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Measurements fetched successfully.",
                data: measurements,
                lastPage: measurements.length < 10 ? true : false,
                lastId: measurements[measurements.length - 1]._id,
                itemCount: measurements.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching measurements."
            });
            return;
        }
    });
};

export async function getInitialMeasurementsFromHolderSide(req: any, res: any) {
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

        const measurements = await CRM_MeasurementModel.find({ measurementOrganizationId: findOrganization.organizationId }).sort({ createdAt: -1 }).limit(10);

        if (!measurements || measurements.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No measurements found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Measurements fetched successfully.",
            data: measurements,
            lastPage: measurements.length < 10 ? true : false,
            lastId: measurements[measurements.length - 1]._id,
            itemCount: measurements.length
        });
        return;
    });
};

export async function getMoreMeasurementsFromHolderSide(req: any, res: any) {
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

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        try {
            const measurements = await CRM_MeasurementModel.find({ measurementOrganizationId: findOrganization.organizationId, _id: { $gt: lastId } }).limit(10);
            if (!measurements || measurements.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No measurements found.",
                    data: [],
                    lastPage: true,
                    lastId: "",
                    itemCount: 0
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Measurements fetched successfully.",
                data: measurements,
                lastPage: measurements.length < 10 ? true : false,
                lastId: measurements[measurements.length - 1]._id,
                itemCount: measurements.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching measurements."
            });
            return;
        }
    });
};

export async function updateMeasurementFromWorkerSide(req: any, res: any) {
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

        const {
            measurementId,
            measurementName,
            measurementAuthorizedPersons,
            measurementInformations,
            measurementOtherDetails,
            measurementDeviceDetails,
            measurementParameters,
            measurementBarcodes,
            measurementPlanningId,
            measurementStartDate,
            measurementEndDate,
        } = req.body;

        if (
            !measurementId ||
            !measurementName ||
            !measurementAuthorizedPersons ||
            !measurementInformations ||
            !measurementOtherDetails ||
            !measurementDeviceDetails ||
            !measurementParameters ||
            !measurementBarcodes ||
            !measurementPlanningId ||
            !measurementStartDate ||
            !measurementEndDate
        ) {
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

        const findMeasurement = await CRM_MeasurementModel.findOne({ measurementId: measurementId, measurementOrganizationId: findOrganization.organizationId })

        if (!findMeasurement) {
            res.status(400).json({
                status: false,
                msg: "Measurement not found."
            });
            return;
        }

        findMeasurement.measurementName = measurementName;
        findMeasurement.measurementAuthorizedPersons = measurementAuthorizedPersons;
        findMeasurement.measurementInformations = measurementInformations;
        findMeasurement.measurementOtherDetails = measurementOtherDetails;
        findMeasurement.measurementDeviceDetails = measurementDeviceDetails;
        findMeasurement.measurementParameters = measurementParameters;
        findMeasurement.measurementBarcodes = measurementBarcodes;
        findMeasurement.measurementPlanningId = measurementPlanningId;
        findMeasurement.measurementStartDate = measurementStartDate;
        findMeasurement.measurementEndDate = measurementEndDate;
        findMeasurement.updatedAt = req.currentTime;

        try {
            await findMeasurement.save();
            res.status(200).json({
                status: true,
                msg: "Measurement updated successfully.",
                data: findMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating measurement."
            });
            return;
        }

    })
};

export async function updateMeasurementFromHolderSide(req: any, res: any) {
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

        const {
            measurementName,
            measurementId,
            measurementAuthorizedPersons,
            measurementInformations,
            measurementOtherDetails,
            measurementDeviceDetails,
            measurementParameters,
            measurementBarcodes,
            measurementPlanningId,
            measurementStartDate,
            measurementEndDate,
            isDeleted,
        } = req.body;

        if (
            !measurementName ||
            !measurementId ||
            !measurementAuthorizedPersons ||
            !measurementInformations ||
            !measurementOtherDetails ||
            !measurementDeviceDetails ||
            !measurementParameters ||
            !measurementBarcodes ||
            !measurementPlanningId ||
            !measurementStartDate ||
            !measurementEndDate ||
            isDeleted === undefined
        ) {
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
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const findMeasurement = await CRM_MeasurementModel.findOne({ measurementId: measurementId, measurementOrganizationId: findOrganization.organizationId })

        if (!findMeasurement) {
            res.status(400).json({
                status: false,
                msg: "Measurement not found."
            });
            return;
        }

        findMeasurement.measurementName = measurementName;
        findMeasurement.measurementAuthorizedPersons = measurementAuthorizedPersons;
        findMeasurement.measurementInformations = measurementInformations;
        findMeasurement.measurementOtherDetails = measurementOtherDetails;
        findMeasurement.measurementDeviceDetails = measurementDeviceDetails;
        findMeasurement.measurementParameters = measurementParameters;
        findMeasurement.measurementBarcodes = measurementBarcodes;
        findMeasurement.measurementPlanningId = measurementPlanningId;
        findMeasurement.measurementStartDate = measurementStartDate;
        findMeasurement.measurementEndDate = measurementEndDate;
        findMeasurement.isDeleted = isDeleted;
        findMeasurement.updatedAt = req.currentTime;

        try {
            await findMeasurement.save();
            res.status(200).json({
                status: true,
                msg: "Measurement updated successfully.",
                data: findMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating measurement."
            });
            return;
        }

    })
};

export async function deleteMeasurementFromWorkerSide(req: any, res: any) {
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

        const { measurementId } = req.body;

        if (!measurementId) {
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

        const findMeasurement = await CRM_MeasurementModel.findOne({ measurementId: measurementId, measurementOrganizationId: findOrganization.organizationId })

        if (!findMeasurement) {
            res.status(400).json({
                status: false,
                msg: "Measurement not found."
            });
            return;
        }

        if (findMeasurement.isDeleted === true || findMeasurement.status === false) {
            res.status(400).json({
                status: false,
                msg: "Measurement is already deleted."
            });
            return;
        }

        findMeasurement.isDeleted = true;
        findMeasurement.status = false;
        findMeasurement.updatedAt = req.currentTime;

        try {
            await findMeasurement.save();
            res.status(200).json({
                status: true,
                msg: "Measurement deleted successfully.",
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting measurement."
            });
            return;
        }
    })
};

export async function deleteMeasurementFromHolderSide(req: any, res: any) {
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

        const { measurementId } = req.body;

        if (!measurementId) {
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
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const findMeasurement = await CRM_MeasurementModel.findOne({ measurementId: measurementId, measurementOrganizationId: findOrganization.organizationId })

        if (!findMeasurement) {
            res.status(400).json({
                status: false,
                msg: "Measurement not found."
            });
            return;
        }

        if (findMeasurement.isDeleted === true || findMeasurement.status === false) {
            res.status(400).json({
                status: false,
                msg: "Measurement is already deleted."
            });
            return;
        }

        findMeasurement.isDeleted = true;
        findMeasurement.status = false;
        findMeasurement.updatedAt = req.currentTime;

        try {
            await findMeasurement.save();
            res.status(200).json({
                status: true,
                msg: "Measurement deleted successfully.",
                data: findMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting measurement."
            });
            return;
        }
    })
};

export async function searchMeasurementWithMeasurementNameFromWorkerSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents.",
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

        const { measurementName } = req.query;

        if (!measurementName) {
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

        try {
            const findMeasurement = await CRM_MeasurementModel.findOne({ $text: { $search: measurementName }, measurementOrganizationId: findOrganization.organizationId, isDeleted: false })

            if (!findMeasurement) {
                res.status(400).json({
                    status: false,
                    msg: "Measurement not found."
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Measurement found.",
                data: findMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error searching measurement."
            });
            return;
        }
    });
};

export async function searchMeasurementWithMeasurementNameFromHolderSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents.",
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

        const { measurementName } = req.query;

        if (!measurementName) {
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
        }

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findHolder.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        try {

            const findMeasurement = await CRM_MeasurementModel.findOne({ $text: { $search: measurementName }, measurementOrganizationId: findOrganization.organizationId, isDeleted: false })

            if (!findMeasurement) {
                res.status(400).json({
                    status: false,
                    msg: "Measurement not found."
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Measurement found.",
                data: findMeasurement
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error searching measurement."
            });
            return;
        }
    });
};
