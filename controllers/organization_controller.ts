import { OrganizationCustomFieldModel, OrganizationHolderModel, OrganizationInfoModel, OrganizationWorkerModel } from "../models/Organization";
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

                const emailExists = await OrganizationWorkerModel.findOne({ organizationWorkerEmail: organizationWorkerEmail });
                if (emailExists) {
                    res.status(400).json({
                        status: false,
                        msg: "Email Already Exists."
                    });
                    return;
                }

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
                    const createdAt = req.currentTime;
                    const updatedAt = req.currentTime;

                    console.log("Organization Name => ", organizationExists.organizationName);

                    const newOrganizationWorker = new OrganizationWorkerModel({
                        organizationWorkerUID: organizationWorkerUID,
                        organizationName: organizationExists.organizationName,
                        organizationId: organizationHolder.organizationId,
                        organizationWorkerFullname: organizationWorkerFullname,
                        organizationWorkerEmail: organizationWorkerEmail,
                        organizationWorkerPhone: organizationWorkerPhone,
                        organizationWorkerPassword: hashedPassword,
                        organizationWorkerRole: organizationWorkerRole,
                        organizationWorkerImage: "",
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

export const updateOrganizationHolderPassword = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    const { organizationHolderNewPassword } = req.body;

    if (!organizationHolderNewPassword) {
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
                const organizationHolder = await OrganizationHolderModel.findOne({ organizationHolderEmail: user.email });

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

                await OrganizationHolderModel.findOneAndUpdate({ organizationHolderEmail: user.email }, {
                    organizationHolderPassword: organizationHolderNewPassword,
                    updatedAt: req.currentTime,
                });

                res.status(200).json({
                    status: true,
                    msg: "Holder Password Updated Successfully."
                });
                return;

            }
        }
    });
};


export const getAllWorkersFromOrganizationSide = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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

                const dataToReturn = [];
                const workers = await OrganizationWorkerModel.find({ organizationId: organizationHolder.organizationId });
                for (let i = 0; i < workers.length; i++) {
                    dataToReturn.push({
                        organizationWorkerUID: workers[i].organizationWorkerUID,
                        organizationId: workers[i].organizationId,
                        organizationName: workers[i].organizationName,
                        organizationWorkerFullname: workers[i].organizationWorkerFullname,
                        organizationWorkerEmail: workers[i].organizationWorkerEmail,
                        organizationWorkerPhone: workers[i].organizationWorkerPhone,
                        organizationWorkerRole: workers[i].organizationWorkerRole,
                        organizationWorkerStatus: workers[i].organizationWorkerStatus,
                        organizationWorkerIsDeleted: workers[i].organizationWorkerIsDeleted,
                        organizationWorkerWhitelist: workers[i].organizationWorkerWhitelist,
                        organizationWorkerBlacklist: workers[i].organizationWorkerBlacklist,
                        createdAt: workers[i].createdAt,
                        updatedAt: workers[i].updatedAt,
                    });
                };

                res.status(200).json({
                    status: true,
                    msg: "Workers Fetched Successfully.",
                    data: dataToReturn,
                });
                return;
            }
        }
    });

};

export const updateWorkersWhitelist = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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
        };

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder Not Found."
            });
            return;
        };

        if (findHolder.organizationHolderIsDeleted === true || findHolder.organizationHolderStatus === false) {
            res.status(400).json({
                status: false,
                msg: "Holder Deleted or Blocked."
            });
            return;
        };

        const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: req.body.workerUID });

        if (!findWorker) {
            res.status(400).json({
                status: false,
                msg: "Worker Not Found."
            });
            return;
        };

        if (findWorker.organizationId !== findHolder.organizationId) {
            res.status(400).json({
                status: false,
                msg: "Worker Not Found."
            });
            return;
        };


        const findOrganization = await OrganizationInfoModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization Not Found."
            });
            return;
        };

        const { workerUID, whitelist } = req.body;

        if (!workerUID || !whitelist) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const worker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: workerUID });

        if (!worker) {
            res.status(400).json({
                status: false,
                msg: "Worker Not Found."
            });
            return;
        };

        const updatedWhitelist = await OrganizationWorkerModel.findOneAndUpdate({ organizationWorkerUID: workerUID }, {
            organizationWorkerWhitelist: whitelist,
            updatedAt: req.currentTime,
        });

        res.status(200).json({
            status: true,
            msg: "Whitelist Updated Successfully."
        });
        return;
    });
};

export const createNewCustomFieldFromHolderSide = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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
        };

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "Holder Not Found."
            });
            return;
        }

        if (findHolder.organizationHolderIsDeleted === true || findHolder.organizationHolderStatus === false) {
            res.status(400).json({
                status: false,
                msg: "Holder Deleted or Blocked."
            });
            return;
        }

        const findOrganization = await OrganizationInfoModel.findOne({ organizationId: findHolder.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization Not Found."
            });
            return;
        }

        const { organizationCustomFieldValues } = req.body;

        if (!organizationCustomFieldValues) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });

            return;
        };

        const randomCustomFieldId = uuidv4();

        const newCustomField = new OrganizationCustomFieldModel({
            organizationId: findOrganization.organizationId,
            organizationCustomFieldId: randomCustomFieldId,
            organizationCustomFieldValues: organizationCustomFieldValues,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newCustomField.save();

            res.status(200).json({
                status: true,
                msg: "Custom Field Created Successfully."
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error While Creating Custom Field."
            });
            return;
        }

    });
};

export const updateCustomFieldFromHolderSide = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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
                const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

                if (!findHolder) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Not Found."
                    });
                    return;
                }

                if (findHolder.organizationHolderIsDeleted === true || findHolder.organizationHolderStatus === false) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Deleted or Blocked."
                    });
                    return;
                }

                const findOrganization = await OrganizationInfoModel.findOne({ organizationId: findHolder.organizationId });

                if (!findOrganization) {
                    res.status(400).json({
                        status: false,
                        msg: "Organization Not Found."
                    });

                    return;
                }

                const { organizationCustomFieldId, organizationCustomFieldValues } = req.body;

                if (!organizationCustomFieldId || !organizationCustomFieldValues) {
                    res.status(400).json({
                        status: false,
                        msg: "Missing Fields, Please check API Documents."
                    });

                    return;
                }

                const findCustomField = await OrganizationCustomFieldModel.findOne({ organizationCustomFieldId: organizationCustomFieldId });

                if (!findCustomField) {
                    res.status(400).json({
                        status: false,
                        msg: "Custom Field Not Found."
                    });
                    return;
                }

                if (findCustomField.organizationId !== findOrganization.organizationId) {
                    res.status(400).json({
                        status: false,
                        msg: "Custom Field Not Found."
                    });
                    return;
                }

                const updatedCustomField = await OrganizationCustomFieldModel.findOneAndUpdate({ organizationCustomFieldId: organizationCustomFieldId }, {
                    organizationCustomFieldValues: organizationCustomFieldValues,
                    updatedAt: req.currentTime,
                });

                res.status(200).json({
                    status: true,
                    msg: "Custom Field Updated Successfully."
                });
                return;
            }
        }
    });
};

export const deleteCustomFieldFromHolderSide = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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
                const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

                if (!findHolder) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Not Found."
                    });
                    return;
                }

                if (findHolder.organizationHolderIsDeleted === true || findHolder.organizationHolderStatus === false) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Deleted or Blocked."
                    });
                    return;
                }

                const findOrganization = await OrganizationInfoModel.findOne({ organizationId: findHolder.organizationId });

                if (!findOrganization) {
                    res.status(400).json({
                        status: false,
                        msg: "Organization Not Found."
                    });
                    return;
                }

                const { organizationCustomFieldId } = req.body;

                if (!organizationCustomFieldId) {
                    res.status(400).json({
                        status: false,
                        msg: "Missing Fields, Please check API Documents."
                    });
                    return;
                }

                const findCustomField = await OrganizationCustomFieldModel.findOne({ organizationCustomFieldId: organizationCustomFieldId });

                if (!findCustomField) {
                    res.status(400).json({
                        status: false,
                        msg: "Custom Field Not Found."
                    });
                    return;
                }

                if (findCustomField.organizationId !== findOrganization.organizationId) {
                    res.status(400).json({
                        status: false,
                        msg: "Custom Field Not Found."
                    });
                    return;
                }

                const deletedCustomField = await OrganizationCustomFieldModel.findOneAndDelete({ organizationCustomFieldId: organizationCustomFieldId });

                res.status(200).json({
                    status: true,
                    msg: "Custom Field Deleted Successfully."
                });
                return;
            }
        }
    });
};

export const getCustomFieldsFromHolderSide = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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
                const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

                if (!findHolder) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Not Found."
                    });
                    return;
                }

                if (findHolder.organizationHolderIsDeleted === true || findHolder.organizationHolderStatus === false) {
                    res.status(400).json({
                        status: false,
                        msg: "Holder Deleted or Blocked."
                    });
                    return;
                }

                const findOrganization = await OrganizationInfoModel.findOne({ organizationId: findHolder.organizationId });

                if (!findOrganization) {
                    res.status(400).json({
                        status: false,
                        msg: "Organization Not Found."
                    });
                    return;
                }

                const customFields = await OrganizationCustomFieldModel.find({ organizationId: findOrganization.organizationId });

                res.status(200).json({
                    status: true,
                    msg: "Custom Fields Fetched Successfully.",
                    data: customFields
                });
                return;
            }
        }
    });
};

export const getCustomFieldsFromWorkerSide = async (req: any, res: any) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
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
                const findWorker = await OrganizationWorkerModel.findOne({ organizationWorkerUID: user.UID });

                if (!findWorker) {
                    res.status(400).json({
                        status: false,
                        msg: "Worker Not Found."
                    });
                    return;
                }

                const findOrganization = await OrganizationInfoModel.findOne({ organizationId: findWorker.organizationId });

                if (!findOrganization) {
                    res.status(400).json({
                        status: false,
                        msg: "Organization Not Found."
                    });
                    return;
                }

                if (findWorker.organizationId !== findOrganization.organizationId) {
                    res.status(400).json({
                        status: false,
                        msg: "Worker Not Found.",
                    });
                    return;
                }

                const customFields = await OrganizationCustomFieldModel.find({ organizationId: findOrganization.organizationId });

                res.status(200).json({
                    status: true,
                    msg: "Custom Fields Fetched Successfully.",
                    data: customFields
                });
                return;
            }
        }
    });
};