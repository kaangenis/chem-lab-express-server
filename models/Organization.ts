import mongoose from "mongoose";

const OrganizationInfoSchema = new mongoose.Schema({
    organizationId: String,
    organizationName: String,
    organizationHolderFullname: String,
    organizationHolderUID: String,
    organizationUsername: String,
    organizationEmail: String,
    organizationPassword: String,
    organizationPhone: String,
    organizationAddress: String,
    organizationCity: String,
    organizationCountry: String,
    organizationLogo: String,
    organizationRole: String,
    organizationLicense: String,
    organizationLicenseExpire: Number,
    isActive: Boolean,
    isDeleted: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const OrganizationHolderSchema = new mongoose.Schema({
    organizationHolderUID: String,
    organizationHolderFullname: String,
    organizationHolderEmail: String,
    organizationHolderPhone: String,
    organizationHolderPassword: String,
    organizationHolderRole: String,
    organizationHolderStatus: Boolean,
    organizationHolderIsDeleted: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const OrganizationInfoModel = mongoose.model("OrganizationInfo", OrganizationInfoSchema);
const OrganizationHolderModel = mongoose.model("OrganizationHolderInfo", OrganizationHolderSchema);

export {
    OrganizationInfoModel,
    OrganizationHolderModel,
};

