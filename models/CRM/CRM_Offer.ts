import mongoose from "mongoose";

const CRM_Offer = new mongoose.Schema({
    offerId: String,
    offerOrganizationId: String,
    offerInformations: {
        offerCustomerName: String,
        offerContactName: String,
        offerType: String,
        offerDate: Number,
        offerActivationDate: Number,
        offerRememberDate: Number,
        offerPaymentType: String,
        offerPaymentStatus: String,
    },
    offerOtherInformations: {
        offerCustomerAddressType: String,
        offerCustomerAddress: String,
        offerCustomerDescription: String,
        offerRate: Number,
        offerAcceptDate: Number,
        offerStatus: String,
    },
    offerAdvisorDetails: {
        offerAdvisorName1: String,
        offerAdvisorPhone1: String,
        offerAdvisorName2: String,
        offerAdvisorPhone2: String,
        offerAdvisorNotes: String,
        offerScopeType: String,
        offerScopeDescription: String,
    },
    offerCreatorDetails: {
        offerCreatorId: String,
        offerCreatorName: String,
        offerCreatorPhone: String,
        offerCreatorEmail: String,
        offerCreatorNotes: String,
    },
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const CRM_OfferModel = mongoose.model("CRM_Offer", CRM_Offer);

export {
    CRM_OfferModel,
};
