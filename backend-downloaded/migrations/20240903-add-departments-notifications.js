'use strict';

/**
 * Migration: Add Department and Notification System
 *
 * This migration creates the department and notification tables.
 * It checks what exists in the database and only creates missing tables.
 */

const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    console.log('🚀 Starting Department and Notification System migration...');
    console.log('📋 Analyzing current database state...\n');

    try {
      // Check if Departments table exists
      const departmentsExists = await queryInterface.tableExists('Departments');
      if (!departmentsExists) {
        console.log('📋 Creating Departments table...');
        await queryInterface.createTable('Departments', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          department_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          department_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
        });
        console.log('✅ Departments table created');
      } else {
        console.log('⏭️  Departments table already exists');
      }

      // Check if UserDepartments table exists
      const userDepartmentsExists = await queryInterface.tableExists('UserDepartments');
      if (!userDepartmentsExists) {
        console.log('📋 Creating UserDepartments table...');
        await queryInterface.createTable('UserDepartments', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Departments',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          is_primary: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          assigned_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          assigned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
        });

        // Add unique constraint
        await queryInterface.addConstraint('UserDepartments', {
          fields: ['user_id', 'department_id'],
          type: 'unique',
          name: 'unique_user_department'
        });

        console.log('✅ UserDepartments table created');
      } else {
        console.log('⏭️  UserDepartments table already exists');
      }

      // Check if DepartmentModules table exists
      const departmentModulesExists = await queryInterface.tableExists('DepartmentModules');
      if (!departmentModulesExists) {
        console.log('📋 Creating DepartmentModules table...');
        await queryInterface.createTable('DepartmentModules', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Departments',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          module_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          can_view: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          can_add_edit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          can_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          assigned_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          assigned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
        });

        // Add unique constraint
        await queryInterface.addConstraint('DepartmentModules', {
          fields: ['department_id', 'module_id'],
          type: 'unique',
          name: 'unique_department_module'
        });

        console.log('✅ DepartmentModules table created');
      } else {
        console.log('⏭️  DepartmentModules table already exists');
      }

      // Check if Notifications table exists
      const notificationsExists = await queryInterface.tableExists('Notifications');
      if (!notificationsExists) {
        console.log('📋 Creating Notifications table...');
        await queryInterface.createTable('Notifications', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          message: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          notification_type: {
            type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'ALERT', 'SAFETY'),
            allowNull: false,
            defaultValue: 'INFO',
          },
          priority: {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
            allowNull: false,
            defaultValue: 'MEDIUM',
          },
          created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          scheduled_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
        });

        await queryInterface.addIndex('Notifications', ['notification_type']);
        await queryInterface.addIndex('Notifications', ['priority']);
        await queryInterface.addIndex('Notifications', ['status']);

        console.log('✅ Notifications table created');
      } else {
        console.log('⏭️  Notifications table already exists');
      }

      // Check if UserNotifications table exists
      const userNotificationsExists = await queryInterface.tableExists('UserNotifications');
      if (!userNotificationsExists) {
        console.log('📋 Creating UserNotifications table...');
        await queryInterface.createTable('UserNotifications', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          notification_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Notifications',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          read_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          is_dismissed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          dismissed_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
        });

        await queryInterface.addIndex('UserNotifications', ['user_id']);
        await queryInterface.addIndex('UserNotifications', ['is_read']);

        console.log('✅ UserNotifications table created');
      } else {
        console.log('⏭️  UserNotifications table already exists');
      }

      console.log('✅ Department and Notification System migration completed successfully\n');

    } catch (error) {
      console.error('❌ Error in department/notification migration:', error.message);
      throw error;
    }
  },

  async down({ context: queryInterface }) {
    console.log('🔄 Rolling back Department and Notification System migration...\n');

    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('UserNotifications', { cascade: true });
    await queryInterface.dropTable('DepartmentModules', { cascade: true });
    await queryInterface.dropTable('UserDepartments', { cascade: true });
    await queryInterface.dropTable('Notifications', { cascade: true });
    await queryInterface.dropTable('Departments', { cascade: true });

    console.log('✅ Department and Notification System rollback completed\n');
  }
};