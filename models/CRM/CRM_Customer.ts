import mongoose from "mongoose";

const CRM_Customer = new mongoose.Schema({
    customerId: String,
    customerOrganizationId: String,
    customerName: String,
    customerPhone1: String,
    customerInformations: {
        customerCode: String,
        customerTitle: String,
        customerType: String,
        customerCategory: String,
        customerIndustry: String,
        customerSource: String,
        customerActivity: Boolean,
        customerCrew: Array,
        customerDescription: String,
        customerTracking: Boolean,
    },
    customerAuthorizedData: {
        customerAuthorizedId: String,
        customerAuthorizedName: String,
        customerAuthorizedPhone: String,
        customerAuthorizedEmail: String,
    },
    customerContactDetails: {
        customerAddressType: String,
        customerAddress1: String,
        customerAddress2: String,
        customerCountry: String,
        customerCity: String,
        customerDistrict: String,
        customerPostalCode: String,
        customerPhone2: String,
        customerFax: String,
        customerMobilePhone: String,
        customerEmail: String,
        customerEmail2: String,
        customerWebsite: String,
    },
    customerFinancialDetails: {
        customerTaxOffice: String,
        customerTaxNumber: String,
        customerCurrencyUnit: String,
        customerRiskStatus: String,
        customerDiscountRate: Number,
        customerBalance: Number,
    },
    customerSocialMediaDetails: {
        customerFacebook: String,
        customerInstagram: String,
        customerLinkedin: String,
        customerTwitter: String,
        customerYoutube: String,
        customerSkype: String,
    },
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const CRM_Contact = new mongoose.Schema({
    contactId: String,
    contactName: String,
    contactOrganizationId: String,
    contactPhone1: String,
    contactDetails: {
        contactTitle: String,
        contactDepartment: String,
        contactPhone2: String,
        contactEmail1: String,
        contactEmail2: String,
        contactFaxNumber: String,
    },
    contactOtherDetails: {
        contactAddressType: String,
        contactAuthorizationType: String,
        contactPositiviteNegativeStatus: String,
        contactStatus: String,
        contactGender: String,
        contactBirthDate: Number,
        contactMarriageStatus: String,
        contactMarriageDate: Number,
        contactDescription: String,
    },
    contactAssistantDetails: {
        contactAssistantName: String,
        contactAssistantPhone: String,
        contactCardVisit: String,
    },
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

CRM_Customer.index({ customerName: "text", customerPhone1: "text" });
CRM_Contact.index({ contactName: "text", contactPhone1: "text" });

const CRM_CustomerModel = mongoose.model("CRM_Customer", CRM_Customer);
const CRM_ContactModel = mongoose.model("CRM_Contact", CRM_Contact);

export { CRM_CustomerModel, CRM_ContactModel };
