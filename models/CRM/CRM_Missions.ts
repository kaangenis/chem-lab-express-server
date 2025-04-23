import mongoose from "mongoose";

const CRM_Missions = new mongoose.Schema({
    missionId: String,
    missionOrganizationId: String,
    missionTitle: String,
    missionCreatorDetails: {
        creatorId: String,
        creatorName: String,
        creatorRole: String,
        creatorEmail: String,
        creatorPhone: String,
        creatorOrganizationId: String,
    },
    missionStatus: String,
    missionStartDate: Number,
    missionsDetails: {
        missionGuessedFinishDate: Number,
        missionRememberDate: Number,
        missionPriority: String,
        missionAuthorizedPerson: [],
        missionPersonsToNotify: [],
        missionDescription: String,
    },
    missionOtherDetails: {
        missionActivityId: String,
        missionOfferId: String,
        missionPlanningId: String,
        missionCompleteRate: Number,
        missionCompletedAt: Number,
    },
    missionCustomerDetails: {
        customerId: String,
        customerName: String,
        customerEmail: String,
        customerPhone: String,
        customerOrganizationId: String,
        customerAddressType: String,
        customerAddress: String,
    },
    addToAgenda: Boolean,
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

CRM_Missions.index({ missionTitle: "text"});

const CRM_MissionsModel = mongoose.model("CRM_Missions", CRM_Missions);

export { CRM_MissionsModel };
