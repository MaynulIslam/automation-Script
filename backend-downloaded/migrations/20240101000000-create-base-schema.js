'use strict';

/**
 * Migration: Create Base Database Schema
 *
 * This migration creates the core database tables needed for a fresh installation.
 * It will only create tables that don't already exist, making it safe for upgrades.
 */

const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    console.log('🚀 Starting base schema creation...');

    try {
      // Check if Settings table exists
      const settingsExists = await queryInterface.tableExists('Settings');
      if (!settingsExists) {
        console.log('📋 Creating Settings table...');
        await queryInterface.createTable('Settings', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          organization_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          setting_key: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          setting_value: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          }
        });

        // Add index for better performance
        await queryInterface.addIndex('Settings', ['setting_key']);
        console.log('✅ Settings table created');
      } else {
        console.log('⏭️  Settings table already exists');
      }

      // Check if Users table exists
      const usersExists = await queryInterface.tableExists('Users');
      if (!usersExists) {
        console.log('📋 Creating Users table...');
        await queryInterface.createTable('Users', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
          },
          email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
          },
          password: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          first_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
          last_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
          is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          }
        });

        await queryInterface.addIndex('Users', ['email']);
        await queryInterface.addIndex('Users', ['username']);
        console.log('✅ Users table created');
      } else {
        console.log('⏭️  Users table already exists');
      }

      // Check if Organizations table exists
      const organizationsExists = await queryInterface.tableExists('Organizations');
      if (!organizationsExists) {
        console.log('📋 Creating Organizations table...');
        await queryInterface.createTable('Organizations', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          }
        });
        console.log('✅ Organizations table created');
      } else {
        console.log('⏭️  Organizations table already exists');
      }

      console.log('✅ Base schema creation completed successfully');

    } catch (error) {
      console.error('❌ Error creating base schema:', error.message);
      throw error;
    }
  },

  async down({ context: queryInterface }) {
    console.log('🔄 Rolling back base schema...');

    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('Users', { cascade: true });
    await queryInterface.dropTable('Organizations', { cascade: true });
    await queryInterface.dropTable('Settings', { cascade: true });

    console.log('✅ Base schema rollback completed');
  }
};