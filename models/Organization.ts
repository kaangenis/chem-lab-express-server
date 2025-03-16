import mongoose from "mongoose";

const OrganizationInfoSchema = new mongoose.Schema({
    organizationId: String,
    organizationName: String,
    organizationHolderFullname: String,
    organizationHolderUID: String,
    organizationUsername: String,
    organizationEmail: String,
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
    organizationId: String,
    organizationHolderFullname: String,
    organizationHolderEmail: String,
    organizationHolderPhone: String,
    organizationHolderPassword: String,
    organizationHolderRole: String,
    organizationHolderStatus: Boolean,
    organizationHolderIsDeleted: Boolean,
    organizationHolderImage: String,
    createdAt: Number,
    updatedAt: Number,
});

const OrganizationWorkerSchema = new mongoose.Schema({
    organizationWorkerUID: String,
    organizationId: String,
    organizationWorkerFullname: String,
    organizationWorkerEmail: String,
    organizationWorkerPhone: String,
    organizationWorkerPassword: String,
    organizationWorkerRole: String,
    organizationWorkerStatus: Boolean,
    organizationWorkerIsDeleted: Boolean,
    organizationWorkerWhitelist: Array,
    organizationWorkerBlacklist: Array,
    organizationWorkerImage: String,
    createdAt: Number,
    updatedAt: Number,
});

const OrganizationInfoModel = mongoose.model("OrganizationInfo", OrganizationInfoSchema);
const OrganizationHolderModel = mongoose.model("OrganizationHolderInfo", OrganizationHolderSchema);
const OrganizationWorkerModel = mongoose.model("OrganizationWorkerInfo", OrganizationWorkerSchema);

export {
    OrganizationInfoModel,
    OrganizationHolderModel,
    OrganizationWorkerModel,
};

