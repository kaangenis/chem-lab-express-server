import mongoose from "mongoose";

const SystemAdminSchema = new mongoose.Schema({
    UID: String,
    email: String,
    password: String,
    fullName: String,
    profileImage: String,
    createdAt: Number,
    updatedAt: Number,
    status: Boolean,
    isBlocked: Boolean,
    isDeleted: Boolean,
    isMailVerified: Boolean,
    role: String,
});

const LicenseSchema = new mongoose.Schema({
    licenseId: String,
    licenseName: String,
    licenseType: String,
    licenseExpire: Number,
    licenseOrganizationId: String,
    licenseOrganizationName: String,
    licenseAdminId: String,
    licenseAdminName: String,
    licenseAdminEmail: String,
    licenseAdminPhone: String,
    licenseStatus: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const SystemAdminModel = mongoose.model("SystemAdmin", SystemAdminSchema);
const LicenseModel = mongoose.model("License", LicenseSchema);

export {
    SystemAdminModel,
    LicenseModel,
};

