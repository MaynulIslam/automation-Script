DO $$
BEGIN
    -- Create roles with login capability
    CREATE ROLE admin WITH LOGIN;
    CREATE ROLE "user" WITH LOGIN;  -- Using quotes to handle reserved keyword
    CREATE ROLE service WITH LOGIN;

    -- Set passwords for each role
    ALTER ROLE admin WITH PASSWORD 'YourStrongAdminPassword';
    ALTER ROLE "user" WITH PASSWORD 'YourStrongUserPassword';  -- Using quotes here as well
    ALTER ROLE service WITH PASSWORD 'YourStrongServicePassword';

    -- Set admin as a superuser
    ALTER ROLE admin WITH SUPERUSER;

    -- Grant view access to user and service roles on a specified database
    GRANT CONNECT ON DATABASE duettoanalytics TO "user", service;  -- Using quotes here as well
    GRANT USAGE ON SCHEMA public TO "user", service;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO "user", service;

    -- Ensure future tables in the public schema also inherit SELECT permissions for user and service
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO "user", service;

    RAISE NOTICE 'Roles and permissions have been configured successfully.';
END $$;
