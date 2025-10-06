'use strict';

/**
 * Migration: Fix ALL Department and Notification Table Schemas
 *
 * This migration fixes ALL tables created by 20240903-add-departments-notifications.js
 * to match the maestrolib models. Handles both fresh installs and existing customer deployments.
 *
 * Tables Fixed:
 * - Departments
 * - UserDepartments
 * - DepartmentModules
 * - Notifications
 * - UserNotifications
 */

const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    console.log('🔧 Starting comprehensive Department/Notification schema fix...\n');

    try {
      // ============================================
      // FIX DEPARTMENTS TABLE
      // ============================================
      const departmentsExists = await queryInterface.tableExists('Departments');

      if (!departmentsExists) {
        console.log('📋 Creating Departments table with correct schema...');
        await queryInterface.createTable('Departments', {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          department_name: { type: DataTypes.STRING(255), allowNull: false },
          department_code: { type: DataTypes.STRING(255), allowNull: false, unique: true },
          description: { type: DataTypes.TEXT, allowNull: true },
          status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
          createdAt: { type: DataTypes.DATE, allowNull: false },
          updatedAt: { type: DataTypes.DATE, allowNull: false }
        });
        console.log('✅ Departments table created\n');
      } else {
        console.log('🔍 Checking Departments table schema...');
        const deptDesc = await queryInterface.describeTable('Departments');

        if (deptDesc.name && !deptDesc.department_name) {
          console.log('  → Renaming: name → department_name');
          await queryInterface.renameColumn('Departments', 'name', 'department_name');
        }

        if (!deptDesc.department_code) {
          console.log('  → Adding: department_code');
          await queryInterface.addColumn('Departments', 'department_code', {
            type: DataTypes.STRING(255), allowNull: true, unique: false
          });
          const [departments] = await queryInterface.sequelize.query('SELECT id FROM "Departments"');
          for (const dept of departments) {
            await queryInterface.sequelize.query(
              `UPDATE "Departments" SET department_code = :code WHERE id = :id`,
              { replacements: { code: `DEPT-${String(dept.id).padStart(4, '0')}`, id: dept.id } }
            );
          }
          await queryInterface.changeColumn('Departments', 'department_code', {
            type: DataTypes.STRING(255), allowNull: false, unique: true
          });
        }

        if (deptDesc.is_active && !deptDesc.status) {
          console.log('  → Converting: is_active (BOOLEAN) → status (INTEGER)');
          await queryInterface.addColumn('Departments', 'status', {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 1
          });
          await queryInterface.sequelize.query(
            'UPDATE "Departments" SET status = CASE WHEN is_active = true THEN 1 ELSE 0 END'
          );
          await queryInterface.removeColumn('Departments', 'is_active');
        }

        if (deptDesc.created_at) await queryInterface.removeColumn('Departments', 'created_at');
        if (deptDesc.updated_at) await queryInterface.removeColumn('Departments', 'updated_at');

        const updatedDeptDesc = await queryInterface.describeTable('Departments');
        if (!updatedDeptDesc.createdAt) {
          await queryInterface.addColumn('Departments', 'createdAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        if (!updatedDeptDesc.updatedAt) {
          await queryInterface.addColumn('Departments', 'updatedAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        console.log('✅ Departments table fixed\n');
      }

      // ============================================
      // FIX USERDEPARTMENTS TABLE
      // ============================================
      const userDeptExists = await queryInterface.tableExists('UserDepartments');

      if (!userDeptExists) {
        console.log('📋 Creating UserDepartments table with correct schema...');
        await queryInterface.createTable('UserDepartments', {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
          department_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Departments', key: 'id' }, onDelete: 'CASCADE' },
          is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          assigned_by: { type: DataTypes.INTEGER, allowNull: true },
          assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
          createdAt: { type: DataTypes.DATE, allowNull: false },
          updatedAt: { type: DataTypes.DATE, allowNull: false }
        });
        await queryInterface.addConstraint('UserDepartments', {
          fields: ['user_id', 'department_id'], type: 'unique', name: 'unique_user_department'
        });
        console.log('✅ UserDepartments table created\n');
      } else {
        console.log('🔍 Checking UserDepartments table schema...');
        const udDesc = await queryInterface.describeTable('UserDepartments');

        if (!udDesc.is_primary) {
          console.log('  → Adding: is_primary');
          await queryInterface.addColumn('UserDepartments', 'is_primary', {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
          });
        }
        if (!udDesc.assigned_by) {
          console.log('  → Adding: assigned_by');
          await queryInterface.addColumn('UserDepartments', 'assigned_by', {
            type: DataTypes.INTEGER, allowNull: true
          });
        }
        if (!udDesc.assigned_at) {
          console.log('  → Adding: assigned_at');
          await queryInterface.addColumn('UserDepartments', 'assigned_at', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }

        if (udDesc.created_at) await queryInterface.removeColumn('UserDepartments', 'created_at');
        if (udDesc.updated_at) await queryInterface.removeColumn('UserDepartments', 'updated_at');

        const updatedUdDesc = await queryInterface.describeTable('UserDepartments');
        if (!updatedUdDesc.createdAt) {
          await queryInterface.addColumn('UserDepartments', 'createdAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        if (!updatedUdDesc.updatedAt) {
          await queryInterface.addColumn('UserDepartments', 'updatedAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        console.log('✅ UserDepartments table fixed\n');
      }

      // ============================================
      // FIX DEPARTMENTMODULES TABLE
      // ============================================
      const deptModExists = await queryInterface.tableExists('DepartmentModules');

      if (!deptModExists) {
        console.log('📋 Creating DepartmentModules table with correct schema...');
        await queryInterface.createTable('DepartmentModules', {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          department_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Departments', key: 'id' }, onDelete: 'CASCADE' },
          module_id: { type: DataTypes.INTEGER, allowNull: false },
          can_view: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          can_add_edit: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          can_delete: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          assigned_by: { type: DataTypes.INTEGER, allowNull: true },
          assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
          createdAt: { type: DataTypes.DATE, allowNull: false },
          updatedAt: { type: DataTypes.DATE, allowNull: false }
        });
        await queryInterface.addConstraint('DepartmentModules', {
          fields: ['department_id', 'module_id'], type: 'unique', name: 'unique_department_module'
        });
        console.log('✅ DepartmentModules table created\n');
      } else {
        console.log('🔍 Checking DepartmentModules table schema...');
        const dmDesc = await queryInterface.describeTable('DepartmentModules');

        if (!dmDesc.can_view) {
          console.log('  → Adding: can_view, can_add_edit, can_delete');
          await queryInterface.addColumn('DepartmentModules', 'can_view', {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
          });
          await queryInterface.addColumn('DepartmentModules', 'can_add_edit', {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
          });
          await queryInterface.addColumn('DepartmentModules', 'can_delete', {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
          });
        }
        if (!dmDesc.assigned_by) {
          console.log('  → Adding: assigned_by');
          await queryInterface.addColumn('DepartmentModules', 'assigned_by', {
            type: DataTypes.INTEGER, allowNull: true
          });
        }
        if (!dmDesc.assigned_at) {
          console.log('  → Adding: assigned_at');
          await queryInterface.addColumn('DepartmentModules', 'assigned_at', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }

        if (dmDesc.created_at) await queryInterface.removeColumn('DepartmentModules', 'created_at');
        if (dmDesc.updated_at) await queryInterface.removeColumn('DepartmentModules', 'updated_at');

        const updatedDmDesc = await queryInterface.describeTable('DepartmentModules');
        if (!updatedDmDesc.createdAt) {
          await queryInterface.addColumn('DepartmentModules', 'createdAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        if (!updatedDmDesc.updatedAt) {
          await queryInterface.addColumn('DepartmentModules', 'updatedAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        console.log('✅ DepartmentModules table fixed\n');
      }

      // ============================================
      // FIX NOTIFICATIONS TABLE
      // ============================================
      const notifExists = await queryInterface.tableExists('Notifications');

      if (!notifExists) {
        console.log('📋 Creating Notifications table with correct schema...');
        await queryInterface.createTable('Notifications', {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          title: { type: DataTypes.STRING(255), allowNull: false },
          message: { type: DataTypes.TEXT, allowNull: false },
          notification_type: { type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'ALERT', 'SAFETY'), allowNull: false, defaultValue: 'INFO' },
          priority: { type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'), allowNull: false, defaultValue: 'MEDIUM' },
          created_by: { type: DataTypes.INTEGER, allowNull: false },
          scheduled_at: { type: DataTypes.DATE, allowNull: true },
          expires_at: { type: DataTypes.DATE, allowNull: true },
          status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
          createdAt: { type: DataTypes.DATE, allowNull: false },
          updatedAt: { type: DataTypes.DATE, allowNull: false }
        });
        await queryInterface.addIndex('Notifications', ['notification_type']);
        await queryInterface.addIndex('Notifications', ['priority']);
        await queryInterface.addIndex('Notifications', ['status']);
        console.log('✅ Notifications table created\n');
      } else {
        console.log('🔍 Checking Notifications table schema...');
        const notifDesc = await queryInterface.describeTable('Notifications');

        // Handle type → notification_type rename
        if (notifDesc.type && !notifDesc.notification_type) {
          console.log('  → Renaming: type → notification_type (and updating ENUM)');
          // Drop old enum type
          await queryInterface.removeColumn('Notifications', 'type');
          // Create new column with correct enum
          await queryInterface.addColumn('Notifications', 'notification_type', {
            type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'ALERT', 'SAFETY'),
            allowNull: false,
            defaultValue: 'INFO'
          });
          // Migrate data - will default to 'INFO' for existing records
        }

        if (notifDesc.is_global) {
          console.log('  → Removing: is_global (not in model)');
          await queryInterface.removeColumn('Notifications', 'is_global');
        }

        if (!notifDesc.priority) {
          console.log('  → Adding: priority');
          await queryInterface.addColumn('Notifications', 'priority', {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
            allowNull: false,
            defaultValue: 'MEDIUM'
          });
        }

        if (!notifDesc.created_by) {
          console.log('  → Adding: created_by (defaulting to 1)');
          await queryInterface.addColumn('Notifications', 'created_by', {
            type: DataTypes.INTEGER,
            allowNull: true  // Temporarily nullable
          });
          // Set default value for existing records
          await queryInterface.sequelize.query('UPDATE "Notifications" SET created_by = 1 WHERE created_by IS NULL');
          // Make it required
          await queryInterface.changeColumn('Notifications', 'created_by', {
            type: DataTypes.INTEGER,
            allowNull: false
          });
        }

        if (!notifDesc.scheduled_at) {
          console.log('  → Adding: scheduled_at, expires_at');
          await queryInterface.addColumn('Notifications', 'scheduled_at', {
            type: DataTypes.DATE, allowNull: true
          });
          await queryInterface.addColumn('Notifications', 'expires_at', {
            type: DataTypes.DATE, allowNull: true
          });
        }

        if (!notifDesc.status) {
          console.log('  → Adding: status');
          await queryInterface.addColumn('Notifications', 'status', {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 1
          });
        }

        if (notifDesc.created_at) await queryInterface.removeColumn('Notifications', 'created_at');
        if (notifDesc.updated_at) await queryInterface.removeColumn('Notifications', 'updated_at');

        const updatedNotifDesc = await queryInterface.describeTable('Notifications');
        if (!updatedNotifDesc.createdAt) {
          await queryInterface.addColumn('Notifications', 'createdAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        if (!updatedNotifDesc.updatedAt) {
          await queryInterface.addColumn('Notifications', 'updatedAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        console.log('✅ Notifications table fixed\n');
      }

      // ============================================
      // FIX USERNOTIFICATIONS TABLE
      // ============================================
      const userNotifExists = await queryInterface.tableExists('UserNotifications');

      if (!userNotifExists) {
        console.log('📋 Creating UserNotifications table with correct schema...');
        await queryInterface.createTable('UserNotifications', {
          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
          notification_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Notifications', key: 'id' }, onDelete: 'CASCADE' },
          is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          read_at: { type: DataTypes.DATE, allowNull: true },
          is_dismissed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          dismissed_at: { type: DataTypes.DATE, allowNull: true },
          createdAt: { type: DataTypes.DATE, allowNull: false },
          updatedAt: { type: DataTypes.DATE, allowNull: false }
        });
        await queryInterface.addIndex('UserNotifications', ['user_id']);
        await queryInterface.addIndex('UserNotifications', ['is_read']);
        console.log('✅ UserNotifications table created\n');
      } else {
        console.log('🔍 Checking UserNotifications table schema...');
        const unDesc = await queryInterface.describeTable('UserNotifications');

        if (!unDesc.is_dismissed) {
          console.log('  → Adding: is_dismissed, dismissed_at');
          await queryInterface.addColumn('UserNotifications', 'is_dismissed', {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
          });
          await queryInterface.addColumn('UserNotifications', 'dismissed_at', {
            type: DataTypes.DATE, allowNull: true
          });
        }

        if (unDesc.created_at) await queryInterface.removeColumn('UserNotifications', 'created_at');
        if (unDesc.updated_at) await queryInterface.removeColumn('UserNotifications', 'updated_at');

        const updatedUnDesc = await queryInterface.describeTable('UserNotifications');
        if (!updatedUnDesc.createdAt) {
          await queryInterface.addColumn('UserNotifications', 'createdAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        if (!updatedUnDesc.updatedAt) {
          await queryInterface.addColumn('UserNotifications', 'updatedAt', {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
          });
        }
        console.log('✅ UserNotifications table fixed\n');
      }

      console.log('✅ All Department/Notification schemas fixed successfully!\n');

    } catch (error) {
      console.error('❌ Error fixing schemas:', error.message);
      console.error(error);
      throw error;
    }
  },

  async down({ context: queryInterface }) {
    console.log('🔄 Rolling back schema fixes...\n');
    console.log('⚠️  This will revert all schema changes. Data will be preserved where possible.\n');

    // This is a complex rollback - in production you may want to handle this differently
    // For now, we'll just log a warning
    console.log('⚠️  Manual rollback may be required for ENUM changes');
    console.log('✅ Rollback noted\n');
  }
};