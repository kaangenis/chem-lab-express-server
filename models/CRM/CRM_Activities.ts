import mongoose from "mongoose";

const CRM_Activities = new mongoose.Schema({
    activityId: String,
    activityOrganizationId: String,
    activityCustomerId: String,
    activityCustomerName: String,
    activityContacts: String,
    activityType: String,
    activityStatus: String,
    activityDate: Number,
    activityOtherDetails: {
        activityRememberDate: Number,
        activityHour: Number,
        activityDescription: String,
        offerId: String,
        activityTeam: String,
        addToAgenda: Boolean,
    },
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

const CRM_ActivitesModel = mongoose.model("CRM_Activities", CRM_Activities);

export { CRM_ActivitesModel };
