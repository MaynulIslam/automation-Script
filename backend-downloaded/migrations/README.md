# Database Migrations

This directory contains database migrations for Duetto Analytics using Umzug with Sequelize.

## Migration: maestrolib 0.0.78 to 0.0.85

### Overview
This migration updates the database schema to support new features introduced in maestrolib version 0.0.85.

### Changes Included

#### New Tables:
1. **Departments** - Organizational units for grouping users and devices
2. **UserDepartments** - Junction table for user-department relationships
3. **DepartmentModules** - Junction table for department-module permissions
4. **Notifications** - System-wide notification storage
5. **UserNotifications** - User-specific notification tracking

#### Updated Tables:
1. **Users**
   - Added `department_id` - Reference to primary department
   - Added `last_login_at` - Track last login time
   - Added `notification_preferences` - JSON field for notification settings

2. **Devices**
   - Added `department_id` - Assign devices to departments
   - Added `maintenance_schedule` - JSON field for maintenance planning

3. **AlarmLogs**
   - Added `acknowledged_by` - Track who acknowledged alarms
   - Added `acknowledged_at` - Track when alarms were acknowledged
   - Added `notes` - Additional notes for alarm handling

4. **Organizations**
   - Added `timezone` - Organization-specific timezone
   - Added `settings` - JSON field for organization settings

#### Performance Improvements:
- Added indexes on frequently queried columns:
  - `AlarmLogs.device_id`
  - `AlarmLogs.createdAt`
  - Composite index on `GasSensorData(device_id, sensor_id, createdAt)`

### Running Migrations

Migrations are automatically run when the backend server starts. They can also be run manually:

```javascript
// In your Node.js application
const { runMigrations } = require('./server/config/data.config');
const sequelize = require('./server/config/database');

await runMigrations(sequelize);
```

### Migration Safety Features

1. **Transaction Support**: All changes are wrapped in transactions for atomicity
2. **Existence Checks**: Tables and columns are only created if they don't exist
3. **Safe Rollback**: Down migration safely removes added elements
4. **Error Handling**: Detailed error logging for troubleshooting

### Data Migration

The `20250123-data-migration-0078-to-0085.js` file handles:
- Creating default department for existing installations
- Assigning existing users to departments
- Setting up default notification preferences
- Cleaning up orphaned records
- Creating welcome notification for the upgrade

### Rollback

To rollback migrations:
```javascript
const umzug = new Umzug({
  migrations: { glob: path.resolve(__dirname, '../../migrations/*.js') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

await umzug.down({ to: 'previous-migration-name' });
```

### Best Practices

1. **Always test migrations** on a copy of production data first
2. **Backup your database** before running migrations
3. **Monitor migration logs** for any warnings or errors
4. **Check data integrity** after migration completes

### Troubleshooting

If a migration fails:
1. Check the error logs for specific issues
2. Verify database connectivity
3. Ensure proper permissions for creating/modifying tables
4. Check if partial changes were applied (migrations use transactions, but verify)
5. Use the rollback functionality if needed

### Version Compatibility

- **From Version**: maestrolib 0.0.78
- **To Version**: maestrolib 0.0.85
- **Duetto Version**: 0.9.2
- **Database**: PostgreSQL (tested with versions 12+)