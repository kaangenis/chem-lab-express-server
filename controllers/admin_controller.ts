import { LicenseModel, SystemAdminModel } from "../models/Admin";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { OrganizationHolderModel, OrganizationInfoModel } from "../models/Organization";


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
            data: admin,
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
        licenseAdminId,
        licenseAdminName,
        licenseAdminEmail,
        licenseAdminPhone,
    } = req.body;

    if (
        !licenseName ||
        !licenseType ||
        !licenseExpire ||
        !licenseOrganizationId ||
        !licenseAdminId ||
        !licenseAdminName ||
        !licenseAdminEmail ||
        !licenseAdminPhone
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

        const newLicense = new LicenseModel({
            licenseId: uuidv4(),
            licenseName: licenseName,
            licenseType: licenseType,
            licenseExpire: licenseExpire,
            licenseStatus: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
            licenseOrganizationId: licenseOrganizationId,
            licenseAdminId: licenseAdminId,
            licenseAdminName: licenseAdminName,
            licenseAdminEmail: licenseAdminEmail,
            licenseAdminPhone: licenseAdminPhone,
        });

        try {
            await newLicense.save();
            res.status(201).json({ status: true, msg: "License Created Successfully." });
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

            const newOrganizationHolder = new OrganizationHolderModel({
                organizationHolderUID: OrganizationHolderUID,
                organizationHolderFullname: organizationHolderFullName,
                organizationId: '',
                organizationHolderEmail: organizationHolderEmail,
                organizationHolderPhone: organizationHolderPhone,
                organizationHolderPassword: organizationHolderPassword,
                organizationHolderRole: "OWNER",
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

        const organizations = await OrganizationInfoModel.find({});

        if (organizations.length === 0 || !organizations) {
            res.status(200).json({
                status: false,
                msg: "No Organization Found.",
                data: [],
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Organizations Fetched Successfully.",
            organizations: organizations,
        });
        return;

    });
};