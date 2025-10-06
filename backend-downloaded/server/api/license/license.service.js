const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const formidable = require('formidable');

const common = require("../../util/common");
const constant = require("../../util/constant");
const licenseDAL = require("./license.helper");
const licensePlanDAL = require('../licenseplan/licenseplan.helper');
const organizationDAL = require("../organization/organization.helper");

const publicKey = fs.readFileSync(path.join(__dirname, '../../security/public.pem'), 'utf8');


const secretKey = 'your-secret-key';

function validateLicenseKey(licenseKey) {
    try {
        const decodedToken = jwt.verify(licenseKey, secretKey);
        const currentDate = new Date();
        const expirationDate = new Date(decodedToken.expirationDate);

        return currentDate <= expirationDate;
    } catch (error) {
        console.error('Error validating license key:', error);
        return false;
    }
}

exports.getHostId = async (req, res) => {
    try {
        // const host_id = common.retrieveHostInfo();
        const org_info = await organizationDAL.getAllOrganizations();
        if (org_info && org_info.length > 0) {
            res.status(200).json({ success: true, host_id: org_info[0] });
        }
    } catch (error) {
        console.error('Error getting host ID:', error);
        res.status(500).json({ success: false, message: 'Error getting host ID' });
    }
};

exports.getHostInfo = async (req, res) => {
    try {
        const org_info = await organizationDAL.getAllOrganizations();
        if(org_info && org_info.length > 0){
            res.status(200).json({ success: true, host_info: org_info[0] });
        } else {
            res.status(200).json({ success: true, host_info: 'Error getting host info' });
        }
    } catch (error) {
        console.error('Error getting host info:', error);
        res.status(500).json({ success: false, message: 'Error getting host info' });
    }
}

exports.activateLicense = async (req, res) => {
    try {
        const { hostId, licenseKey } = req.body;
        const isValid = validateLicenseKey(licenseKey);
        if (isValid) {
            res.status(200).json({ success: true, message: 'License activated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid license key' });
        }
    } catch (error) {
        console.error('Error activating license:', error);
        res.status(500).json({ success: false, message: 'Error activating license' });
    }
};

exports.validateLicense = async (req, res) => {
    try {
        const form = formidable({
            uploadDir: '/tmp',
            multiples: false
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading license file'
                });
            }

            try {
                // Check if file exists and has correct extension
                console.info("files--->", files);
                if (!files?.file?.name?.toLowerCase().endsWith('.enc')) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid license file format'
                    });
                }

                // Read the encrypted file content
                const encryptedContent = fs.readFileSync(files.file.path, 'utf8');

                // Decrypt and verify the license
                const decryptedData = verifyLicense(encryptedContent);

                if (!decryptedData) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid license or decryption failed'
                    });
                }

                // Parse the decrypted data
                try {
                    const licenseData = JSON.parse(decryptedData.toString());
                    console.info('Decrypted license data:', licenseData);

                    // Validate license data structure
                    if (!licenseData.host || !licenseData.prod || !licenseData.exp) {
                        throw new Error('Invalid license data structure');
                    }

                    // Check expiration
                    const expirationDate = new Date(licenseData.exp);
                    if (expirationDate < new Date()) {
                        return res.status(400).json({
                            success: false,
                            message: 'License has expired',
                            expiration: licenseData.exp
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'License is valid',
                        license: {
                            host_id: licenseData.host,
                            product_id: licenseData.prod,
                            expiration_date: licenseData.exp,
                            issued_at: licenseData.iat
                        }
                    });

                } catch (parseError) {
                    console.error('License parsing error:', parseError);
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid license format'
                    });
                }

            } catch (error) {
                console.error('License validation error:', error);
                return res.status(400).json({
                    success: false,
                    message: 'License validation failed'
                });
            } finally {
                // Clean up uploaded file
                if (files?.file?.path) {
                    fs.unlink(files.file.path, (err) => {
                        if (err) console.error('Error cleaning up uploaded file:', err);
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error in validateLicense:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Helper function to verify the license
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

exports.saveLicense = async (req, res) => {
    try {
        const { status, host_id, expiry_date, license_key, license_version, mac_address, machine_id, cpu_id } = req.body;
        let body = {
            status,
            host_id,
            license_key,
            license_version,
            mac_address,
            machine_id,
            cpu_id,
            expiry_date
        }
        console.info("body-->", body);
        await licenseDAL.insertLicense(body);
        res.status(200).json({ success: true, host_id });
    } catch (error) {
        console.error('error--->', error);
    }
}

exports.removeLicense = async (req, res) => {
    try {
        const id = req.params.id;
        await licenseDAL.deleteLicense(id);
    } catch (error) {
        console.error('error--->', error);
    }
}

exports.checkActiveLicense = async () => {
    try {
        const licenses = await licenseDAL.getAllLicenses();

        const activeLicense = licenses?.find(license =>
            license.is_active &&
            license.status === 1 &&
            new Date(license.expiry_date) > new Date()
        );

        let licensePlan = null;
        if (activeLicense && activeLicense.license_plan_id) {
            const licensePlanData = await licensePlanDAL.getLicensePlan(activeLicense.license_plan_id);
            licensePlan = licensePlanData?.dataValues || null;
        }

        return {
            isLicensed: !!activeLicense,
            license: activeLicense || null,
            licensePlan: licensePlan,
            error: null
        };
    } catch (error) {
        console.error('Error checking active license:', error);
        return {
            isLicensed: false,
            license: null,
            error: error
        };
    }
};

exports.getActiveLicense = async (req, res) => {
    try {
        const licenseStatus = await exports.checkActiveLicense();
        
        if (licenseStatus.error) {
            return common.sendResponse(res, constant.requestMessages.LICENSE_CHECK_ERROR, false, 500);
        }
        return common.sendResponse(res, {
            ...licenseStatus,
            message: constant.requestMessages.EXECUTED_QUERY_SUCCESSFULLY
        }, true, 200);

    } catch (error) {
        console.error('Error in license API:', error);
        return common.sendResponse(res, constant.requestMessages.LICENSE_CHECK_ERROR, false, 500);
    }
};