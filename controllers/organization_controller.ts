import { OrganizationHolderModel, OrganizationInfoModel, OrganizationWorkerModel } from "../models/Organization";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";


export const loginOrganizationHolder = async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    const organizationHolder = await OrganizationHolderModel.findOne({ organizationHolderEmail: email });

    if (!organizationHolder) {
        res.status(400).json({
            status: false,
            msg: "User Not Found."
        });
        return;
    };

    const organizationExists = await OrganizationInfoModel.findOne({ organizationId: organizationHolder?.organizationId });

    if (!organizationExists) {
        res.status(400).json({
            status: false,
            msg: "Organization Not Found."
        });
        return;
    };

    if (organizationHolder.organizationHolderIsDeleted === true || organizationHolder.organizationHolderStatus === false) {
        res.status(400).json({
            status: false,
            msg: "User Deleted or Blocked."
        });
        return;
    };

    const isMatch = await bcrypt.compare(password, organizationHolder.organizationHolderPassword!);

    if (!isMatch) {
        res.status(400).json({
            status: false,
            msg: "Invalid Credentials."
        });
        return;
    } else {
        const accessToken = await jwt.sign(
            {
                UID: organizationHolder.organizationHolderUID,
                email: organizationHolder.organizationHolderEmail,
                tokenType: "access",
                role: 'HOLDER'
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        );
        const refreshToken = await jwt.sign(
            {
                uid: organizationHolder.organizationHolderUID,
                email: organizationHolder.organizationHolderEmail,
                tokenType: "refresh",
                role: 'HOLDER'
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '30d'
            }
        );

        const workerData = await OrganizationHolderModel.findOne({ organizationHolderUID: organizationHolder.organizationHolderUID });
        const workerDataWithoutPassword = {
            organizationHolderUID: workerData?.organizationHolderUID,
            organizationId: workerData?.organizationId,
            organizationHolderFullname: workerData?.organizationHolderFullname,
            organizationHolderEmail: workerData?.organizationHolderEmail,
            organizationHolderPhone: workerData?.organizationHolderPhone,
            organizationHolderRole: workerData?.organizationHolderRole,
            organizationHolderStatus: workerData?.organizationHolderStatus,
            organizationHolderIsDeleted: workerData?.organizationHolderIsDeleted,
            createdAt: workerData?.createdAt,
            updatedAt: workerData?.updatedAt,
        };

        res.status(200).json({
            status: true,
            msg: "User Logged In Successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: workerDataWithoutPassword,
        });
        return;
    }

};

export const addNewOrganizationWorker = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    const {
        organizationWorkerFullname,
        organizationWorkerEmail,
        organizationWorkerPassword,
        organizationWorkerPhone,
        organizationWorkerRole,
    } = req.body;

    if (!organizationWorkerFullname || !organizationWorkerEmail || !organizationWorkerPassword || !organizationWorkerPhone || !organizationWorkerRole) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];


    await jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error) {
            res.status(400).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        } else {
            if (user.role !== 'HOLDER') {
                res.status(400).json({
                    status: false,
                    msg: "Invalid Role."
                });
                return;
            } else {
                const organizationHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

                if (!organizationHolder) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Not Found."
                    });
                    return;
                };

                const organizationExists = await OrganizationInfoModel.findOne({ organizationId: organizationHolder?.organizationId });

                if (!organizationExists) {
                    res.status(400).json({
                        status: false,
                        msg: "Organization Not Found."
                    });
                    return;
                };

                if (organizationHolder.organizationHolderIsDeleted === true || organizationHolder.organizationHolderStatus === false) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Deleted or Blocked."
                    });
                    return;
                };

                if (organizationHolder.organizationHolderRole !== 'OWNER') {
                    res.status(400).json({
                        status: false,
                        msg: "Invalid Role."
                    });
                    return;
                } else {
                    const organizationWorkerUID = uuidv4();
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(organizationWorkerPassword, salt);
                    const createdAt = new Date().getTime();
                    const updatedAt = new Date().getTime();

                    const newOrganizationWorker = new OrganizationWorkerModel({
                        organizationWorkerUID: organizationWorkerUID,
                        organizationId: organizationHolder.organizationId,
                        organizationWorkerFullname: organizationWorkerFullname,
                        organizationWorkerEmail: organizationWorkerEmail,
                        organizationWorkerPhone: organizationWorkerPhone,
                        organizationWorkerPassword: hashedPassword,
                        organizationWorkerRole: organizationWorkerRole,
                        organizationWorkerStatus: true,
                        organizationWorkerIsDeleted: false,
                        organizationWorkerWhitelist: [],
                        organizationWorkerBlacklist: [],
                        createdAt: createdAt,
                        updatedAt: updatedAt,
                    });

                    await newOrganizationWorker.save();

                    res.status(200).json({
                        status: true,
                        msg: "Organization Worker Added Successfully."
                    });
                    return;
                }
            }
        }
    });

};

export const updateWorkerPassword = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    const { organizationWorkerNewPassword } = req.body;

    if (!organizationWorkerNewPassword) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    await jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error) {
            res.status(400).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        } else {
            if (user.role !== 'WORKER') {
                res.status(400).json({
                    status: false,
                    msg: "Invalid Role."
                });
                return;
            } else {
                const organizationWorker = await OrganizationWorkerModel.findOne({ organizationHolderEmail: user.email });

                if (!organizationWorker) {
                    res.status(400).json({
                        status: false,
                        msg: "Worker Not Found."
                    });
                    return;
                };

                const organizationExists = await OrganizationInfoModel.findOne({ organizationId: organizationWorker?.organizationId });

                if (!organizationExists) {
                    res.status(400).json({
                        status: false,
                        msg: "Organization Not Found."
                    });
                    return;
                };

                if (organizationWorker.organizationWorkerIsDeleted === true || organizationWorker.organizationWorkerStatus === false) {
                    res.status(400).json({
                        status: false,
                        msg: "Worker Deleted or Blocked."
                    });
                    return;
                };

                const updatedAt = new Date().getTime();

                await OrganizationHolderModel.findOneAndUpdate({ organizationHolderEmail: user.email }, {
                    organizationHolderPassword: organizationWorkerNewPassword,
                    updatedAt: updatedAt,
                });

                res.status(200).json({
                    status: true,
                    msg: "Worker Password Updated Successfully."
                });
                return;

            }
        }
    });


};

export const loginOrganizationWorker = async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    const organizationWorker = await OrganizationWorkerModel.findOne({ organizationWorkerEmail: email });

    if (!organizationWorker) {
        res.status(400).json({
            status: false,
            msg: "User Not Found."
        });
        return;
    };

    const organizationExists = await OrganizationInfoModel.findOne({ organizationId: organizationWorker?.organizationId });

    if (!organizationExists) {
        res.status(400).json({
            status: false,
            msg: "Organization Not Found."
        });
        return;
    };

    if (organizationWorker.organizationWorkerIsDeleted === true || organizationWorker.organizationWorkerStatus === false) {
        res.status(400).json({
            status: false,
            msg: "User Deleted or Blocked."
        });
        return;
    };

    const isMatch = await bcrypt.compare(password, organizationWorker.organizationWorkerPassword!);

    if (!isMatch) {
        res.status(400).json({
            status: false,
            msg: "Invalid Credentials."
        });
        return;
    } else {
        const accessToken = await jwt.sign(
            {
                UID: organizationWorker.organizationWorkerUID,
                email: organizationWorker.organizationWorkerEmail,
                tokenType: "access",
                role: 'WORKER'
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        );
        const refreshToken = await jwt.sign(
            {
                uid: organizationWorker.organizationWorkerUID,
                email: organizationWorker.organizationWorkerEmail,
                tokenType: "refresh",
                role: 'WORKER'
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '30d'
            }
        );

        const workerData = await OrganizationWorkerModel.findOne({ organizationWorkerUID: organizationWorker.organizationWorkerUID });
        const workerDataWithoutPassword = {
            organizationWorkerUID: workerData?.organizationWorkerUID,
            organizationId: workerData?.organizationId,
            organizationWorkerFullname: workerData?.organizationWorkerFullname,
            organizationWorkerEmail: workerData?.organizationWorkerEmail,
            organizationWorkerPhone: workerData?.organizationWorkerPhone,
            organizationWorkerRole: workerData?.organizationWorkerRole,
            organizationWorkerStatus: workerData?.organizationWorkerStatus,
            organizationWorkerIsDeleted: workerData?.organizationWorkerIsDeleted,
            organizationWorkerWhitelist: workerData?.organizationWorkerWhitelist,
            organizationWorkerBlacklist: workerData?.organizationWorkerBlacklist,
            createdAt: workerData?.createdAt,
            updatedAt: workerData?.updatedAt,
        }

        res.status(200).json({
            status: true,
            msg: "User Logged In Successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: workerDataWithoutPassword,
        });
        return;
    }
};