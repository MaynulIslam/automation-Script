INSERT INTO public."LicensePlans"
("name", code, description, features, billing_cycle, status, "createdAt", "updatedAt")
VALUES
(
    'Standard 5',
    'DAS-5',
    'Standard plan for small teams with up to 5 devices',
    '{
        "maxDevices": 5,
        "storage": "50GB",
        "customDomain": false,
        "apiAccess": false,
        "support": "email",
        "backups": "weekly"
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Standard 10',
    'DAS-10',
    'Standard plan for growing teams with up to 10 devices',
    '{
        "maxDevices": 10,
        "storage": "50GB",
        "customDomain": false,
        "apiAccess": false,
        "support": "email",
        "backups": "weekly"
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Standard 25',
    'DAS-25',
    'Standard plan for medium teams with up to 25 devices',
    '{
        "maxDevices": 25,
        "storage": "50GB",
        "customDomain": false,
        "apiAccess": false,
        "support": "email",
        "backups": "weekly"
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional 5',
    'DAP-5',
    'Professional plan with advanced features for up to 5 devices',
    '{
        "maxDevices": 5,
        "storage": "250GB",
        "customDomain": true,
        "apiAccess": true,
        "support": "priority",
        "backups": "daily",
        "ssoAuth": true,
        "advancedAnalytics": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional 10',
    'DAP-10',
    'Professional plan with advanced features for up to 10 devices',
    '{
        "maxDevices": 10,
        "storage": "250GB",
        "customDomain": true,
        "apiAccess": true,
        "support": "priority",
        "backups": "daily",
        "ssoAuth": true,
        "advancedAnalytics": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional 25',
    'DAP-25',
    'Professional plan with advanced features for up to 25 devices',
    '{
        "maxDevices": 25,
        "storage": "250GB",
        "customDomain": true,
        "apiAccess": true,
        "support": "priority",
        "backups": "daily",
        "ssoAuth": true,
        "advancedAnalytics": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional 50',
    'DAP-50',
    'Professional plan with advanced features for up to 50 devices',
    '{
        "maxDevices": 50,
        "storage": "500GB",
        "customDomain": true,
        "apiAccess": true,
        "support": "priority",
        "backups": "daily",
        "ssoAuth": true,
        "advancedAnalytics": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional 100',
    'DAP-100',
    'Professional plan with advanced features for up to 100 devices',
    '{
        "maxDevices": 100,
        "storage": "750GB",
        "customDomain": true,
        "apiAccess": true,
        "support": "priority",
        "backups": "daily",
        "ssoAuth": true,
        "advancedAnalytics": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional 200',
    'DAP-200',
    'Professional plan with advanced features for up to 200 devices',
    '{
        "maxDevices": 200,
        "storage": "1TB",
        "customDomain": true,
        "apiAccess": true,
        "support": "priority",
        "backups": "daily",
        "ssoAuth": true,
        "advancedAnalytics": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Professional Unlimited',
    'DAP-X',
    'Professional plan with advanced features for unlimited devices',
    '{
        "maxDevices": "unlimited",
        "storage": "2TB",
        "customDomain": true,
        "apiAccess": true,
        "support": "24/7 dedicated",
        "backups": "real-time",
        "ssoAuth": true,
        "advancedAnalytics": true,
        "sla": "99.99%",
        "customization": true,
        "dedicated": true
    }',
    'monthly'::"enum_LicensePlans_billing_cycle",
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);