import mongoose from "mongoose";

const CRM_Measurement = new mongoose.Schema({
    measurementId: String,
    measurementName: String,
    measurementOrganizationId: String,
    measurementPlanningId: String,
    measurementStartDate: Number,
    measurementEndDate: Number,
    measurementAuthorizedPersons: [],
    measurementInformations: {
        measurementScope: String,
        measurementStatus: String,
        measurementExaminationAcceptDate: Number,
        measurementDescription: String,
    },
    measurementOtherDetails: {
        measurementOfferId: String,
        measurementOfferTitle: String,
        measurementCustomerDetails: {
            customerId: String,
            customerName: String,
            customerEmail: String,
            customerPhone: String,
            customerOrganizationId: String,
            customerAddress: String,
        },
    },
    measurementDeviceDetails: {},
    measurementParameters: {},
    measurementBarcodes: {},
    isDeleted: Boolean,
    status: Boolean,
    createdAt: Number,
    updatedAt: Number,
});

CRM_Measurement.index({ measurementName: "text", measurementPlanningId: "text" });

const CRM_MeasurementModel = mongoose.model("CRM_Measurement", CRM_Measurement);

export { CRM_MeasurementModel };
