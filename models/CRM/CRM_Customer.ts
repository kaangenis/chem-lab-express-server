import mongoose from "mongoose";

const CRM_Customer = new mongoose.Schema({
    customerId: String,
    customerOrganizationId: String,
    customerInformations: {
        customerCode: String,
        customerName: String,
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
        customerPhoneCode: String,
        customerPhone1: String,
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

const CRM_AuthorizedPerson = new mongoose.Schema({
    customerAuthorizedPersonId: String,
    customerAuthorizedPersonName: String,
    customerOrganizationId: String,
    customerAuthorizedPersonDetails: {
        customerAuthorizedPersonTitle: String,
        customerAuthorizedPersonDepartment: String,
        customerAuthorizedPersonPhone1: String,
        customerAuthorizedPersonPhone2: String,
        customerAuthorizedPersonEmail1: String,
        customerAuthorizedPersonEmail2: String,
        customerAuthorizedPersonFax: String,
    },
    customerAssistantDetails: {
        customerAssistantName: String,
        customerAssistantPhone: String,
    },
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const CRM_CustomerModel = mongoose.model("CRM_Customer", CRM_Customer);
const CRM_CustomerAuthorizedPersonModel = mongoose.model("CRM_CustomerAuthorizedPerson", CRM_AuthorizedPerson);

export { CRM_CustomerModel, CRM_CustomerAuthorizedPersonModel };
