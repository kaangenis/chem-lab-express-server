import { LicenseModel, SystemAdminModel } from "../models/Admin";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { OrganizationHolderModel, OrganizationInfoModel, OrganizationWorkerModel } from "../models/Organization";


export async function createNewAdminDirectly(req: any, res: any) {
    const {
        email,
        password,
        fullName,
        secretKey,
    } = req.body;

    if (!email || !password || !fullName || !secretKey) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        res.status(400).json({
            status: false,
            msg: "Invalid Secret Key."
        });
        return;
    };

    const adminExist = await SystemAdminModel.findOne({ email: email });
    if (adminExist) {
        res.status(400).json({
            status: false,
            msg: "Admin Already Exist."
        });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({
            status: false,
            msg: "Password must be at least 6 characters."
        });
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        res.status(400).json({
            status: false,
            msg: "Invalid Email Address."
        });
        return;
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const UID = uuidv4();

    const newAdmin = new SystemAdminModel({
        UID: UID,
        email: email,
        password: hashedPassword,
        fullName: fullName,
        profileImage: "",
        createdAt: req.currentTime,
        updatedAt: req.currentTime,
        status: true,
        isBlocked: false,
        isDeleted: false,
        isMailVerified: false,
        isPremium: false,
        role: "ADMIN",
    });

    try {
        await newAdmin.save();
        res.status(201).json({ status: true, msg: "User Created Successfully." });
    }
    catch (error: any) {
        res.status(409).json({
            status: false,
            msg: "Something went wrong in Authentication, Check the error.",
            error: error.message,
        });
    }
};

export async function loginToAdmin(req: any, res: any) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    const admin = await SystemAdminModel.findOne({ email: email });
    const adminWithoutPassword = {
        UID: admin?.UID,
        email: admin?.email,
        fullName: admin?.fullName,
        createdAt: admin?.createdAt,
        updatedAt: admin?.updatedAt,
        status: admin?.status,
        isBlocked: admin?.isBlocked,
        isDeleted: admin?.isDeleted,
        isMailVerified: admin?.isMailVerified,
        role: admin?.role,
    };

    if (!admin) {
        res.status(400).json({
            status: false,
            msg: "User Not Found."
        });
        return;
    }

    if (admin.isDeleted === true || admin.status === false) {
        res.status(400).json({
            status: false,
            msg: "User Deleted or Blocked."
        });
        return;
    };

    const isMatch = await bcrypt.compare(password, admin.password!);

    if (!isMatch) {
        res.status(400).json({
            status: false,
            msg: "Invalid Credentials."
        });
        return;
    } else {
        const accessToken = await jwt.sign(
            {
                UID: admin.UID,
                email: admin.email,
                admin: true,
                tokenType: "access",
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        );
        const refreshToken = await jwt.sign(
            {
                uid: admin.UID,
                email: admin.email,
                admin: true,
                tokenType: "refresh",
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '30d'
            }
        );

        res.status(200).json({
            status: true,
            msg: "User Logged In Successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: adminWithoutPassword,
        });
    }

};

export async function getAdminData(req: any, res: any) {
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
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found - 1."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found - 2."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Admin Data Fetched Successfully.",
            data: userindb,
        });

    });
};

export async function createNewAdminFromAnotherAdminSide(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    const {
        email,
        password,
        fullName,
    } = req.body;

    if (!email || !password || !fullName) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    const adminExist = await SystemAdminModel.findOne({ email: email });
    if (adminExist) {
        res.status(400).json({
            status: false,
            msg: "Admin Already Exist."
        });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({
            status: false,
            msg: "Password must be at least 6 characters."
        });
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        res.status(400).json({
            status: false,
            msg: "Invalid Email Address."
        });
        return;
    };

    const salt = await bcrypt.genSalt(10);

    await jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        try {
            const hashedPassword = await bcrypt.hash(password, salt);
            const UID = uuidv4();

            const newAdmin = new SystemAdminModel({
                UID: UID,
                email: email,
                password: hashedPassword,
                fullName: fullName,
                profileImage: "",
                createdAt: req.currentTime,
                updatedAt: req.currentTime,
                status: true,
                isBlocked: false,
                isDeleted: false,
                isMailVerified: false,
                isPremium: false,
                role: "ADMIN",
            });

            await newAdmin.save();
            res.status(201).json({ status: true, msg: "Admin Created Successfully." });

        }
        catch (error: any) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found.",
                error: error.message,
            });
        }

    });


};

export async function getAllAdmins(req: any, res: any) {
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
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        let dataToReturn = [];
        const admins = await SystemAdminModel.find({});
        for (let i = 0; i < admins.length; i++) {
            dataToReturn.push({
                UID: admins[i].UID,
                email: admins[i].email,
                fullName: admins[i].fullName,
                createdAt: admins[i].createdAt,
                updatedAt: admins[i].updatedAt,
                status: admins[i].status,
                isBlocked: admins[i].isBlocked,
                isDeleted: admins[i].isDeleted,
                isMailVerified: admins[i].isMailVerified,
                role: admins[i].role,
            });
        };

        res.status(200).json({
            status: true,
            msg: "Admins Fetched Successfully.",
            admins: dataToReturn,
        });

    });
};

export async function renewAdminToken(req: any, res: any) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "refresh" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token.",
                error: error,
            });
            return;
        }

        const accessToken = await jwt.sign(
            {
                UID: user.UID,
                email: user.email,
                tokenType: "access",
                admin: true,
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        );
        const newRefreshToken = await jwt.sign(
            {
                UID: user.UID,
                email: user.email,
                tokenType: "refresh",
                admin: true,
            },
            process.env.JWT_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '30d'
            }
        );

        res.status(200).json({
            status: true,
            msg: "Token Refreshed Successfully.",
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        });
    });

};

export async function getAllLicenses(req: any, res: any) {
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
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        const licenses = await LicenseModel.find({});

        res.status(200).json({
            status: true,
            msg: "Licenses Fetched Successfully.",
            licenses: licenses,
        });

    });
};

export async function createLicense(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    const {
        licenseName,
        licenseType,
        licenseExpire,
        licenseOrganizationId,
    } = req.body;

    if (
        !licenseName ||
        !licenseType ||
        !licenseExpire ||
        !licenseOrganizationId
    ) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    await jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        const findOrganization = await OrganizationInfoModel.findOne({ organizationId: licenseOrganizationId });
        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization Not Found."
            });
            return;
        }

        const newLicense = new LicenseModel({
            licenseId: uuidv4(),
            licenseName: licenseName,
            licenseType: licenseType,
            licenseExpire: licenseExpire,
            licenseOrganizationId: licenseOrganizationId,
            licenseOrganizationName: findOrganization?.organizationName,
            licenseAdminId: findOrganization.organizationHolderUID,
            licenseAdminName: findOrganization.organizationHolderFullname,
            licenseAdminEmail: findOrganization.organizationEmail,
            licenseAdminPhone: findOrganization.organizationPhone,
            licenseStatus: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newLicense.save();

            const findOrganizationAndUpdate = await OrganizationInfoModel.findOne({ organizationId: licenseOrganizationId });
            if (findOrganizationAndUpdate) {
                findOrganizationAndUpdate.organizationLicense = newLicense.licenseId;
                findOrganizationAndUpdate.organizationLicenseExpire = licenseExpire;
                try {
                    await findOrganizationAndUpdate.save();
                    res.status(201).json({ status: true, msg: "License Created Successfully." });
                    return;
                } catch (error: any) {
                    res.status(400).json({
                        status: false,
                        msg: "Error while creating License.",
                        error: error.message,
                    });
                    return;
                }
            }

        }
        catch (error: any) {
            res.status(400).json({
                status: false,
                msg: "Error while creating License.",
                error: error.message,
            });
        }
    });
};

export async function createOrganization(req: any, res: any) {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    let splitToken = accessToken.split(' ')[1];

    const {
        organizationName,
        organizationHolderFullName,
        organizationUsername,
        organizationEmail,
        organizationHolderEmail,
        organizationHolderPassword,
        organizationPhone,
        organizationHolderPhone,
        organizationAddress,
        organizationCity,
        organizationCountry,
        organizationLogo,
    } = req.body;

    if (
        !organizationName ||
        !organizationHolderFullName ||
        !organizationHolderEmail ||
        !organizationHolderPassword ||
        !organizationHolderPhone ||
        !organizationUsername ||
        !organizationEmail ||
        !organizationPhone ||
        !organizationAddress ||
        !organizationCity ||
        !organizationCountry ||
        !organizationLogo
    ) {
        res.status(400).json({
            status: false,
            msg: "Missing Fields, Please check API Documents."
        });
        return;
    };

    const organizationExistEmail = await OrganizationInfoModel.findOne({ organizationEmail: organizationEmail });
    const organizationExistUsername = await OrganizationInfoModel.findOne({ organizationUsername: organizationUsername });
    const organizationHolderExistEmail = await OrganizationHolderModel.findOne({ organizationHolderEmail: organizationHolderEmail });
    const organizationHolderExistPhone = await OrganizationHolderModel.findOne({ organizationHolderPhone: organizationHolderPhone });

    if (organizationHolderExistEmail) {
        res.status(400).json({
            status: false,
            msg: "Organization Holder Already Exist with this Email."
        });
        return;
    };

    if (organizationHolderExistPhone) {
        res.status(400).json({
            status: false,
            msg: "Organization Holder Already Exist with this Phone."
        });
        return;
    };

    if (organizationExistEmail) {
        res.status(400).json({
            status: false,
            msg: "Organization Already Exist with this Email."
        });
        return;
    };

    if (organizationExistUsername) {
        res.status(400).json({
            status: false,
            msg: "Organization Already Exist with this Username."
        });
        return;
    };


    if (organizationHolderPassword.length < 6) {
        res.status(400).json({
            status: false,
            msg: "Password must be at least 6 characters."
        });
        return;
    };

    if (!organizationEmail.includes("@") || !organizationEmail.includes(".")) {
        res.status(400).json({
            status: false,
            msg: "Invalid Email Address."
        });
        return;
    };

    if (!organizationHolderEmail.includes("@") || !organizationHolderEmail.includes(".")) {
        res.status(400).json({
            status: false,
            msg: "Invalid Email Address."
        });
        return;
    };

    await jwt.verify(splitToken, process.env.JWT_SECRET!, async (error: any, user: any) => {

        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        try {
            const OrganizationHolderUID = uuidv4();
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(organizationHolderPassword, salt);

            const newOrganizationHolder = new OrganizationHolderModel({
                organizationHolderUID: OrganizationHolderUID,
                organizationHolderFullname: organizationHolderFullName,
                organizationId: '',
                organizationName: organizationName,
                organizationHolderEmail: organizationHolderEmail,
                organizationHolderPhone: organizationHolderPhone,
                organizationHolderPassword: hashedPassword,
                organizationHolderRole: "OWNER",
                organizationHolderImage: "",
                organizationHolderStatus: true,
                organizationHolderIsDeleted: false,
                createdAt: req.currentTime,
                updatedAt: req.currentTime,
            });

            try {
                await newOrganizationHolder.save();
            } catch (error: any) {
                res.status(400).json({
                    status: false,
                    msg: "Error while creating Organization Holder.",
                    error: error.message,
                });
                return;
            }

            const newOrganization = new OrganizationInfoModel({
                organizationId: uuidv4(),
                organizationName: organizationName,
                organizationHolderFullname: organizationHolderFullName,
                organizationHolderUID: user.UID,
                organizationUsername: organizationUsername,
                organizationEmail: organizationEmail,
                organizationPhone: organizationPhone,
                organizationAddress: organizationAddress,
                organizationCity: organizationCity,
                organizationCountry: organizationCountry,
                organizationLogo: organizationLogo,
                organizationRole: "ORGANIZATION",
                organizationLicense: "",
                organizationLicenseExpire: 0,
                isActive: true,
                isDeleted: false,
                createdAt: req.currentTime,
                updatedAt: req.currentTime,
            });

            try {
                await newOrganization.save();
                const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: OrganizationHolderUID });
                if (findHolder) {
                    findHolder.organizationId = newOrganization.organizationId;
                    try {
                        await findHolder.save();
                        res.status(201).json({ status: true, msg: "Organization Created Successfully." });
                        return;
                    } catch (error: any) {
                        res.status(400).json({
                            status: false,
                            msg: "Error while creating Organization.",
                            error: error.message,
                        });
                        return;
                    };
                };
            }
            catch (error: any) {
                res.status(400).json({
                    status: false,
                    msg: "Error while creating Organization.",
                    error: error.message,
                });
            }
        }
        catch (error: any) {
            res.status(400).json({
                status: false,
                msg: "Organization Not Found.",
                error: error.message,
            });
        }
    });

};

export async function getAllOrganizations(req: any, res: any) {
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
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        const dataToReturn = [];
        const organizations = await OrganizationInfoModel.find({});
        for (let i = 0; i < organizations.length; i++) {
            dataToReturn.push({
                organizationId: organizations[i].organizationId,
                organizationName: organizations[i].organizationName,
                organizationHolderFullname: organizations[i].organizationHolderFullname,
                organizationHolderUID: organizations[i].organizationHolderUID,
                organizationUsername: organizations[i].organizationUsername,
                organizationEmail: organizations[i].organizationEmail,
                organizationPhone: organizations[i].organizationPhone,
                organizationAddress: organizations[i].organizationAddress,
                organizationCity: organizations[i].organizationCity,
                organizationCountry: organizations[i].organizationCountry,
                organizationLogo: organizations[i].organizationLogo,
                organizationRole: organizations[i].organizationRole,
                organizationLicense: organizations[i].organizationLicense,
                organizationLicenseExpire: organizations[i].organizationLicenseExpire,
                isActive: organizations[i].isActive,
                isDeleted: organizations[i].isDeleted,
                createdAt: organizations[i].createdAt,
                updatedAt: organizations[i].updatedAt,
            });
        };

        if (organizations.length === 0 || !organizations) {
            res.status(200).json({
                status: false,
                msg: "No Organization Found.",
                organizations: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Organizations Fetched Successfully.",
            organizations: dataToReturn,
        });
        return;

    });
};

export async function getAllUsersFromAdminSide(req: any, res: any) {
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
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        const dataToReturn = [];
        const users = await OrganizationWorkerModel.find({});
        for (let i = 0; i < users.length; i++) {
            dataToReturn.push({
                organizationWorkerUID: users[i].organizationWorkerUID,
                organizationId: users[i].organizationId,
                organizationName: users[i].organizationName,
                organizationWorkerFullname: users[i].organizationWorkerFullname,
                organizationWorkerEmail: users[i].organizationWorkerEmail,
                organizationWorkerPhone: users[i].organizationWorkerPhone,
                organizationWorkerRole: users[i].organizationWorkerRole,
                organizationWorkerImage: users[i].organizationWorkerImage,
                organizationWorkerStatus: users[i].organizationWorkerStatus,
                organizationWorkerIsDeleted: users[i].organizationWorkerIsDeleted,
                organizationWorkerWhitelist: users[i].organizationWorkerWhitelist,
                organizationWorkerBlacklist: users[i].organizationWorkerBlacklist,
                createdAt: users[i].createdAt,
                updatedAt: users[i].updatedAt,
            });
        };

        if (users.length === 0 || !users) {
            res.status(200).json({
                status: false,
                msg: "No User Found.",
                users: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Users Fetched Successfully.",
            users: dataToReturn,
        });
        return;

    });
};

export async function getAllHoldersFromAdminSide(req: any, res: any) {
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
        if (error || user.tokenType !== "access" || user.admin !== true) {
            res.status(401).json({
                status: false,
                msg: "Invalid Token."
            });
            return;
        }

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        }

        const userindb = await SystemAdminModel.findOne({ UID: user.UID })

        if (!userindb) {
            res.status(400).json({
                status: false,
                msg: "Admin Not Found."
            });
            return;
        };

        if (user.isDeleted === true || user.status === false) {
            res.status(400).json({
                status: false,
                msg: "Admin Deleted or Blocked."
            });
            return;
        };

        const dataToReturn = [];
        const users = await OrganizationHolderModel.find({});
        for (let i = 0; i < users.length; i++) {
            dataToReturn.push({
                organizationHolderUID: users[i].organizationHolderUID,
                organizationHolderFullname: users[i].organizationHolderFullname,
                organizationId: users[i].organizationId,
                organizationName: users[i].organizationName,
                organizationHolderEmail: users[i].organizationHolderEmail,
                organizationHolderPhone: users[i].organizationHolderPhone,
                organizationHolderRole: users[i].organizationHolderRole,
                organizationHolderImage: users[i].organizationHolderImage,
                organizationHolderStatus: users[i].organizationHolderStatus,
                organizationHolderIsDeleted: users[i].organizationHolderIsDeleted,
                createdAt: users[i].createdAt,
                updatedAt: users[i].updatedAt,
            });
        };

        if (users.length === 0 || !users) {
            res.status(200).json({
                status: false,
                msg: "No User Found.",
                users: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Users Fetched Successfully.",
            users: dataToReturn,
        });
        return;

    });
};