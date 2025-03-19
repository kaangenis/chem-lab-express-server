import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OrganizationWorkerModel } from "../../models/Organization";
import { CRM_OfferModel } from "../../models/CRM/CRM_Offer";

export async function getAllOffersByOrganizationId(req: any, res: any) {
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

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "User not found."
            });
            return;
        }

        const findWorker = await OrganizationWorkerModel.findOne({ workerId: user.UID });

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

        // Fetch all offers by organizationId
        const allOffers = await CRM_OfferModel.find({ offerOrganizationId: findOrganization.organizationId });

        res.status(200).json({
            status: true,
            msg: "All offers fetched successfully.",
            data: allOffers
        });

    });
};


export async function createNewOffer(req: any, res: any) {
    let accessToken = req.headers.authorization;
    let { offerInformations, offerOtherInformations, offerAdvisorDetails, offerCreatorNotes } = req.body;

    if (!accessToken || !offerInformations || !offerOtherInformations || !offerAdvisorDetails || !offerCreatorNotes) {
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

        if (!user.UID) {
            res.status(400).json({
                status: false,
                msg: "User not found."
            });
            return;
        }

        const findWorker = await OrganizationWorkerModel.findOne({ workerId: user.UID });

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

        const offerCreatorDetails = {
            offerCreatorId: findWorker.organizationWorkerUID,
            offerCreatorName: findWorker.organizationWorkerFullname,
            offerCreatorEmail: findWorker.organizationWorkerEmail,
            offerCreatorPhone: findWorker.organizationWorkerPhone,
            offerCreatorNotes: offerCreatorNotes
        };

        // Create new offer
        const newOffer = new CRM_OfferModel({
            offerId: uuidv4(),
            offerOrganizationId: findOrganization.organizationId,
            offerInformations: offerInformations,
            offerOtherInformations: offerOtherInformations,
            offerAdvisorDetails: offerAdvisorDetails,
            offerCreatorDetails: offerCreatorDetails,
            isDeleted: false,
            status: true,
            createdAt: req.currentTime,
            updatedAt: req.currentTime
        });

        await newOffer.save();

        res.status(200).json({
            status: true,
            msg: "Offer created successfully.",
            data: newOffer
        });

    });
}