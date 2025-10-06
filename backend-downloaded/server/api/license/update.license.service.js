const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const { exec } = require('child_process');
const crypto = require('crypto');
const common = require("../../util/common");
const constant = require('../../util/constant');
const { client } = require("../../util/common");
const organizationDAL = require("../organization/organization.helper");
const licensePlanDAL = require('../licenseplan/licenseplan.helper');
const licenseDAL = require('./license.helper');
const licenseService = require('./license.service');
const publicKey = fs.readFileSync(path.join(__dirname, '../../security/public.pem'), 'utf8');

const LICENSE_DIR = '/opt/duettodata';
const LICENSE_FILE = path.join(LICENSE_DIR, 'license.enc');

// Constants
const MQTT_TOPICS = {
    LICENSE: "duetto_analytics/system/license",
    LICENSE_VERIFY: "duetto_analytics/system/license_verify"
};

const LICENSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    IN_PROGRESS: 'inprogress'
};

// Helper Functions
const publishLicenseStatus = (status, percent_completed, message) => {
    client.publish(MQTT_TOPICS.LICENSE, JSON.stringify({
        status,
        percent_completed,
        message
    }));
};

const publishVerificationStatus = (status, filePath, data = {}) => {
    client.publish(MQTT_TOPICS.LICENSE_VERIFY, JSON.stringify({
        verify_started: true,
        status,
        file_path: filePath,
        ...data
    }));
};

// RSA decryption function
const verifyLicense = (signedData) => {
    try {
        return crypto.publicDecrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(signedData, 'base64')
        );
    } catch (error) {
        console.error('License verification error:', error);
        return false;
    }
};

async function verifyLicenseData(licenseData) {
    try {
        console.info("-------verify------")
        console.info(licenseData);
        const organizations = await organizationDAL.getAllOrganizations();

        if (!organizations || organizations.length === 0) {
            throw new Error('No organization found in the database');
        }

        const organization = organizations[0];
        console.info('Verifying license against organization:', organization);

        const mismatches = [];

        // host: 'b15ff48e0a63e70a80be56d34cd7125719de307dc6d9745f07571ebd60fc29c7',
        // 0|backend    | 2025-01-20 18:37 +00:00:   prod: 'duetto_analytics',
        // 0|backend    | 2025-01-20 18:37 +00:00:   ver: '0.0.5',
        // 0|backend    | 2025-01-20 18:37 +00:00:   exp: '2025-12-31T23:59:59Z',
        // 0|backend    | 2025-01-20 18:37 +00:00:   iat: '2025-01-20T15:19:02.933Z'
        const checks = {
            'host_id': { licenseKey: 'host', orgKey: 'host_id' },
        };

        for (const [key, { licenseKey, orgKey }] of Object.entries(checks)) {
            if (organization[orgKey] !== licenseData[licenseKey]) {
                mismatches.push({
                    field: key,
                    expected: organization[orgKey],
                    received: licenseData[licenseKey]
                });
            }
        }

        if (mismatches.length > 0) {
            console.error('Hardware verification failed:', { mismatches });
            throw new Error(`Hardware mismatch in: ${mismatches.map(m => m.field).join(', ')}`);
        }

        return { isValid: true, organization };
    } catch (error) {
        console.error('License verification failed:', error.message);
        return { isValid: false, error: error.message };
    }
}

// Add function to handle license file management
async function manageLicenseFile(tempFilePath) {
    try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(LICENSE_DIR)) {
            await fs.promises.mkdir(LICENSE_DIR, { recursive: true });
        }

        // Remove existing license file if it exists
        if (fs.existsSync(LICENSE_FILE)) {
            await fs.promises.unlink(LICENSE_FILE);
        }
        console.info("came her to copy file");
        // Copy new license file
        await fs.promises.copyFile(tempFilePath, LICENSE_FILE);
        console.info('License file saved successfully at:', LICENSE_FILE);
        return true;
    } catch (error) {
        console.error('Error managing license file:', error);
        return false;
    }
}

// Main License Upload Handler
exports.uploadLicense = async (req, res) => {
    console.info("license.service -> uploadLicense");

    try {
        publishLicenseStatus(LICENSE_STATUS.IN_PROGRESS, 5, 'Starting license upload');

        const form = formidable({
            uploadDir: '/tmp',
            multiples: false
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('File upload error:', err);
                publishLicenseStatus(LICENSE_STATUS.ERROR, 0, constant.requestMessages.UPLOAD_ERROR.message);
                return common.sendResponse(res, constant.requestMessages.UPLOAD_ERROR.message, false, 500);
            }

            try {
                // Validate file format
                if (!files?.file?.name?.toLowerCase().endsWith('.enc')) {
                    publishLicenseStatus(LICENSE_STATUS.ERROR, 0, constant.requestMessages.INVALID_FORMAT.message);
                    return common.sendResponse(res, constant.requestMessages.INVALID_FORMAT.message, false, 400);
                }

                // Save the license file to the specified location
                const savedFile = await manageLicenseFile(files.file.path);
                if (!savedFile) {
                    publishLicenseStatus(LICENSE_STATUS.ERROR, 0, 'Failed to save license file');
                    return common.sendResponse(res, 'Failed to save license file', false, 500);
                }

                // Read the encrypted file
                try {
                    const encryptedContent = await fs.promises.readFile(LICENSE_FILE, 'utf8');

                    // Decrypt and verify the license using RSA
                    const decryptedData = verifyLicense(encryptedContent);
                    console.info("decryptedData--->", decryptedData);
                    if (!decryptedData) {
                        publishLicenseStatus(LICENSE_STATUS.ERROR, 0, constant.requestMessages.DECRYPTION_FAILED.message);
                        return common.sendResponse(res, constant.requestMessages.DECRYPTION_FAILED.message, false, 400);
                    }

                    const licenseData = JSON.parse(decryptedData);
                    const verificationResult = await verifyLicenseData(licenseData);

                    if (verificationResult.isValid) {
                        const license_plan = await licensePlanDAL.getLicensePlanByCode(licenseData.license_code);
                        console.info("license_plan--->", license_plan);

                        if (!license_plan) {
                            throw new Error(constant.requestMessages.LICENSE_PLAN_NOT_FOUND.message);
                        }

                        // check if active license exists
                        const active_license = await licenseService.checkActiveLicense();
                        console.info("active_license--->", active_license);

                        if (active_license.isLicensed) {
                            try {
                                const update_license = await licenseDAL.updateLicense(active_license.license.id, {
                                    is_active: false,
                                    status: 9
                                });
                                console.info("Previous active license disabled:", update_license);
                            } catch (updateError) {
                                console.error("Error disabling previous license:", updateError);
                                throw new Error("Failed to disable previous active license");
                            }
                        }

                        try {
                            const new_license = await licenseDAL.insertLicense({
                                status: 1,
                                license_key: licenseData.host,
                                license_version: licenseData.ver,
                                is_active: true,
                                expiry_date: licenseData.exp,
                                license_plan_id: license_plan.id
                            });
                            console.info("New license inserted successfully:", new_license);
                        } catch (insertError) {
                            console.error("Error inserting new license:", insertError);
                            throw new Error("Failed to insert new license");
                        }

                        console.info(constant.requestMessages.LICENSE_ADDED.message);

                        publishVerificationStatus(LICENSE_STATUS.SUCCESS, LICENSE_FILE, {
                            license_data: licenseData,
                            organization: verificationResult.organization
                        });

                        // Only cleanup the temp file, not the saved license file
                        handleLicenseCleanup([files.file.path]);
                        return common.sendResponse(res, constant.requestMessages.VERIFICATION_SUCCESS.message, true, 200);
                    } else {
                        handleLicenseCleanup([files.file.path]);
                        // Also remove the saved license file if verification fails
                        if (fs.existsSync(LICENSE_FILE)) {
                            await fs.promises.unlink(LICENSE_FILE);
                        }
                        publishLicenseStatus(LICENSE_STATUS.ERROR, 0, verificationResult.error);
                        return common.sendResponse(res, verificationResult.error, false, 400);
                    }

                } catch (error) {
                    console.error('License processing error:', error);
                    handleLicenseCleanup([files.file.path]);
                    publishLicenseStatus(LICENSE_STATUS.ERROR, 0, constant.requestMessages.PROCESSING_ERROR.message);
                    return common.sendResponse(res, constant.requestMessages.PROCESSING_ERROR.message, false, 500);
                }

            } catch (error) {
                console.error('Processing error:', error);
                handleLicenseCleanup([files.file.path]);
                publishLicenseStatus(LICENSE_STATUS.ERROR, 0, constant.requestMessages.PROCESSING_ERROR.message);
                return common.sendResponse(res, constant.requestMessages.PROCESSING_ERROR.message, false, 500);
            }
        });
    } catch (error) {
        console.error('Upload handler error:', error);
        publishLicenseStatus(LICENSE_STATUS.ERROR, 0, 'Internal server error');
        return common.sendResponse(res, constant.requestMessages.INTERNAL_SERVER_ERROR.message, false, 500);
    }
};

function handleLicenseCleanup(paths) {
    console.info('Cleaning up license files:', paths);
    paths.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Cleanup error for ${filePath}:`, err);
                }
            });
        }
    });
}

// MQTT Message Handler
client.subscribe(MQTT_TOPICS.LICENSE_VERIFY);

client.on('message', async (topic, message) => {
    if (topic !== MQTT_TOPICS.LICENSE_VERIFY) return true;

    try {
        const licenseConfig = JSON.parse(message);

        publishLicenseStatus(LICENSE_STATUS.IN_PROGRESS, 90, 'Finalizing verification');

        if (licenseConfig.status === LICENSE_STATUS.SUCCESS) {
            // console.info('License verification successful:', licenseConfig);
            // handleLicenseCleanup([licenseConfig.file_path]);
            publishLicenseStatus(LICENSE_STATUS.SUCCESS, 100, 'License installed successfully');
        } else {
            handleLicenseCleanup([licenseConfig.file_path]);
            publishLicenseStatus(LICENSE_STATUS.ERROR, 0, 'License verification failed');
        }
    } catch (error) {
        console.error('MQTT message handling error:', error);
        publishLicenseStatus(LICENSE_STATUS.ERROR, 0, 'License processing failed');
    }
    return true;
});