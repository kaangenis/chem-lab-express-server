import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationHolderModel, OrganizationWorkerModel } from "../../models/Organization";
import { CRM_OfferModel } from "../../models/CRM/CRM_Offer";

export async function createNewOfferFromWorkerSide(req: any, res: any) {
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

        const { offerInformations, offerOtherInformations, offerAdvisorDetails, offerCreatorDetails } = req.body;

        if (!offerInformations || !offerOtherInformations || !offerAdvisorDetails || !offerCreatorDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
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

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const offerId = uuidv4();

        const newOffer = new CRM_OfferModel({
            offerId: offerId,
            offerOrganizationId: findOrganization.organizationId,
            offerInformations: offerInformations,
            offerOtherInformations: offerOtherInformations,
            offerAdvisorDetails: offerAdvisorDetails,
            offerCreatorDetails: offerCreatorDetails,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newOffer.save();
            res.status(200).json({
                status: true,
                msg: "Offer created successfully.",
                data: newOffer
            });
            return;
        } catch (error) {
            console.log(String(error));
            res.status(400).json({
                status: false,
                msg: "Error creating offer.",
                error: String(error)
            });
            return;
        }

    });

}

export async function createNewOfferFromHolderSide(req: any, res: any) {
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

        const { offerInformations, offerOtherInformations, offerAdvisorDetails, offerCreatorDetails } = req.body;

        if (!offerInformations || !offerOtherInformations || !offerAdvisorDetails || !offerCreatorDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        };

        const findUser = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findUser) {
            res.status(400).json({
                status: false,
                msg: "User not found."
            });
            return;
        };

        const findOrganization = await OrganizationHolderModel.findOne({ organizationId: findUser.organizationId })

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        };

        const offerId = uuidv4();

        const newOffer = new CRM_OfferModel({
            offerId: offerId,
            offerOrganizationId: findOrganization.organizationId,
            offerInformations: offerInformations,
            offerOtherInformations: offerOtherInformations,
            offerAdvisorDetails: offerAdvisorDetails,
            offerCreatorDetails: offerCreatorDetails,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime,
        });

        try {
            await newOffer.save();
            res.status(200).json({
                status: true,
                msg: "Offer created successfully.",
                data: newOffer
            });
            return;
        } catch (error) {
            console.log(String(error));
            res.status(400).json({
                status: false,
                msg: "Error creating offer.",
                error: String(error)
            });
            return;
        }
    });
}

export async function getInitialOffersFromWorkerSide(req: any, res: any) {
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

        const offers = await CRM_OfferModel.find({ offerOrganizationId: findOrganization.organizationId, isDeleted: false }).sort({ createdAt: -1 }).limit(10);

        if (!offers || offers.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No offers found.",
                data: [],
                lastPage: true,
                lastId: "",
                itemCount: 0
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: "Offers fetched successfully.",
            data: offers,
            lastPage: offers.length < 10 ? true : false,
            lastId: offers[offers.length - 1]._id,
            itemCount: offers.length
        });
        return;
    });

}


export async function getMoreOffersFromWorkerSide(req: any, res: any) {
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
            const offers = await CRM_OfferModel.find({ offerOrganizationId: findOrganization.organizationId, _id: { $gt: lastId }, isDeleted: false }).limit(10);

            if (!offers || offers.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No offers found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Offers fetched successfully.",
                data: offers,
                lastPage: offers.length < 10 ? true : false,
                lastId: offers[offers.length - 1]._id,
                itemCount: offers.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching offers."
            });
            return;
        }
    });
}

export async function getInitialOffersFromHolderSide(req: any, res: any) {
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

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "User not found."
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

        const offers = await CRM_OfferModel.find({ offerOrganizationId: findOrganization.organizationId}).sort({ createdAt: -1 }).limit(10);

        if (!offers || offers.length === 0) {
            res.status(200).json({
                status: false,
                msg: "No offers found.",
                data: [],
                lastPage: true,
                itemCount: 0,
                lastId: ""
            });
            return;
        };

        res.status(200).json({
            status: true,
            msg: "Offers fetched successfully.",
            data: offers,
            lastPage: offers.length < 10 ? true : false,
            lastId: offers[offers.length - 1]._id,
            itemCount: offers.length
        });
        return;
    });
}


export async function getMoreOffersFromHolderSide(req: any, res: any) {
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

        const findHolder = await OrganizationHolderModel.findOne({ organizationHolderUID: user.UID });

        if (!findHolder) {
            res.status(400).json({
                status: false,
                msg: "User not found."
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

        const { lastId } = req.query;

        if (!lastId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        try {
            const offers = await CRM_OfferModel.find({ offerOrganizationId: findOrganization.organizationId, _id: { $gt: lastId }}).limit(10);

            if (!offers || offers.length === 0) {
                res.status(200).json({
                    status: false,
                    msg: "No offers found.",
                    data: [],
                    lastPage: true,
                    itemCount: 0,
                    lastId: ""
                });
                return;
            }

            res.status(200).json({
                status: true,
                msg: "Offers fetched successfully.",
                data: offers,
                lastPage: offers.length < 10 ? true : false,
                lastId: offers[offers.length - 1]._id,
                itemCount: offers.length
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error fetching offers."
            });
            return;
        }
    });
}

export async function updateOfferFromWorkerSide(req: any, res: any) {
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

        const { offerId, offerInformations, offerOtherInformations, offerAdvisorDetails, offerCreatorDetails } = req.body;

        if (!offerId || !offerInformations || !offerOtherInformations || !offerAdvisorDetails || !offerCreatorDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findOffer = await CRM_OfferModel.findOne({ offerId: offerId, offerOrganizationId: findOrganization.organizationId, isDeleted: false });

        if (!findOffer) {
            res.status(400).json({
                status: false,
                msg: "Offer not found."
            });
            return;
        }

        findOffer.offerInformations = offerInformations;
        findOffer.offerOtherInformations = offerOtherInformations;
        findOffer.offerAdvisorDetails = offerAdvisorDetails;
        findOffer.offerCreatorDetails = offerCreatorDetails;
        findOffer.updatedAt = req.currentTime;

        try {
            await findOffer.save();
            res.status(200).json({
                status: true,
                msg: "Offer updated successfully.",
                data: findOffer
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating offer.",
                error: String(error)
            });
            return;
        }
    });
}

export async function updateOfferFromHolderSide(req: any, res: any) {
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
                msg: "User not found."
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

        const { offerId, offerInformations, offerOtherInformations, offerAdvisorDetails, offerCreatorDetails } = req.body;

        if (!offerId || !offerInformations || !offerOtherInformations || !offerAdvisorDetails || !offerCreatorDetails) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findOffer = await CRM_OfferModel.findOne({ offerId: offerId, offerOrganizationId: findOrganization.organizationId });

        if (!findOffer) {
            res.status(400).json({
                status: false,
                msg: "Offer not found."
            });
            return;
        }

        findOffer.offerInformations = offerInformations;
        findOffer.offerOtherInformations = offerOtherInformations;
        findOffer.offerAdvisorDetails = offerAdvisorDetails;
        findOffer.offerCreatorDetails = offerCreatorDetails;
        findOffer.updatedAt = req.currentTime;

        try {
            await findOffer.save();
            res.status(200).json({
                status: true,
                msg: "Offer updated successfully.",
                data: findOffer
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error updating offer.",
                error: String(error)
            });
            return;
        }
    });
}

export async function deleteOfferFromWorkerSide(req: any, res: any) {
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
        }

        const findOrganization = await OrganizationWorkerModel.findOne({ organizationId: findWorker.organizationId });

        if (!findOrganization) {
            res.status(400).json({
                status: false,
                msg: "Organization not found."
            });
            return;
        }

        const { offerId } = req.body;

        if (!offerId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findOffer = await CRM_OfferModel.findOne({ offerId: offerId, offerOrganizationId: findOrganization.organizationId, isDeleted: false });

        if (!findOffer) {
            res.status(400).json({
                status: false,
                msg: "Offer not found."
            });
            return;
        }

        findOffer.isDeleted = true;
        findOffer.updatedAt = req.currentTime;

        try {
            await findOffer.save();
            res.status(200).json({
                status: true,
                msg: "Offer deleted successfully.",
                data: findOffer
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting offer.",
                error: String(error)
            });
            return;
        }
    });

}


export async function deleteOfferFromHolderSide(req: any, res: any) {
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
                msg: "User not found."
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

        const { offerId } = req.body;

        if (!offerId) {
            res.status(400).json({
                status: false,
                msg: "Missing Fields, Please check API Documents."
            });
            return;
        }

        const findOffer = await CRM_OfferModel.findOne({ offerId: offerId, offerOrganizationId: findOrganization.organizationId, isDeleted: false });

        if (!findOffer) {
            res.status(400).json({
                status: false,
                msg: "Offer not found."
            });
            return;
        }

        findOffer.isDeleted = true;
        findOffer.updatedAt = req.currentTime;

        try {
            await findOffer.save();
            res.status(200).json({
                status: true,
                msg: "Offer deleted successfully.",
                data: findOffer
            });
            return;
        } catch (error) {
            res.status(400).json({
                status: false,
                msg: "Error deleting offer.",
                error: String(error)
            });
            return;
        }
    });
}

