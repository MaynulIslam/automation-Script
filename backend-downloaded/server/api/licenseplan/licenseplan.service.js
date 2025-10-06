const common = require("../../util/common");
const constant = require("../../util/constant");
const licensePlanDAL = require("./licenseplan.helper");

// Add new license plan
exports.addLicensePlan = async (req, res) => {
    try {
        const { name, code, description, features, billing_cycle, status } = req.body;

        // Basic validation
        if (!name || !code || !billing_cycle) {
            return common.sendResponse(res, constant.requestMessages.REQUIRED_FIELDS_MISSING, false, 400);
        }

        // Check if license plan with same code already exists
        const existingPlans = await licensePlanDAL.getAllLicensePlans();
        const codeExists = existingPlans.some(plan => plan.code === code);
        
        if (codeExists) {
            return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_CODE_EXISTS, false, 400);
        }

        // Create new license plan
        const newLicensePlan = await licensePlanDAL.insertLicensePlan({
            name,
            code,
            description,
            features,
            billing_cycle,
            status: status || 1
        });

        return common.sendObjectResponse(res, newLicensePlan, true, 201);

    } catch (error) {
        console.error("Error in addLicensePlan:", error);
        return common.sendResponse(res, constant.requestMessages.FAILED_TO_CREATE_LICENSE_PLAN, false, 500);
    }
};

// Update existing license plan
exports.updateLicensePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if license plan exists
        const existingPlan = await licensePlanDAL.getLicensePlan(id);
        if (!existingPlan) {
            return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_NOT_FOUND, false, 404);
        }

        // If code is being updated, check for uniqueness
        if (updateData.code && updateData.code !== existingPlan.code) {
            const existingPlans = await licensePlanDAL.getAllLicensePlans();
            const codeExists = existingPlans.some(plan => 
                plan.code === updateData.code && plan.id !== parseInt(id)
            );
            
            if (codeExists) {
                return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_CODE_EXISTS, false, 400);
            }
        }

        // Update license plan
        const updatedPlan = await licensePlanDAL.updateLicensePlan(id, updateData);
        return common.sendObjectResponse(res, updatedPlan, true, 200);

    } catch (error) {
        console.error("Error in updateLicensePlan:", error);
        return common.sendResponse(res, constant.requestMessages.FAILED_TO_UPDATE_LICENSE_PLAN, false, 500);
    }
};

// Delete license plan
exports.deleteLicensePlan = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if license plan exists
        const existingPlan = await licensePlanDAL.getLicensePlan(id);
        if (!existingPlan) {
            return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_NOT_FOUND, false, 404);
        }

        // Check if license plan is associated with any active licenses
        const hasActiveAssociations = await existingPlan.hasLicenses();
        if (hasActiveAssociations) {
            return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_HAS_ACTIVE_LICENSES, false, 400);
        }

        // Delete license plan
        await licensePlanDAL.deleteLicensePlan(id);
        return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_DELETED, true, 200);

    } catch (error) {
        console.error("Error in deleteLicensePlan:", error);
        return common.sendResponse(res, constant.requestMessages.FAILED_TO_DELETE_LICENSE_PLAN, false, 500);
    }
};

// Get single license plan
exports.getLicensePlan = async (req, res) => {
    try {
        const { id } = req.params;
        
        const licensePlan = await licensePlanDAL.getLicensePlan(id);
        if (!licensePlan) {
            return common.sendResponse(res, constant.requestMessages.LICENSE_PLAN_NOT_FOUND, false, 404);
        }

        return common.sendObjectResponse(res, licensePlan, true, 200);

    } catch (error) {
        console.error("Error in getLicensePlan:", error);
        return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_LICENSE_PLAN, false, 500);
    }
};

// Get all license plans
exports.getAllLicensePlans = async (req, res) => {
    try {
        const licensePlans = await licensePlanDAL.getAllLicensePlans();
        return common.sendObjectResponse(res, licensePlans, true, 200);

    } catch (error) {
        console.error("Error in getAllLicensePlans:", error);
        return common.sendResponse(res, constant.requestMessages.FAILED_TO_RETRIEVE_LICENSE_PLANS, false, 500);
    }
};