'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    console.log('🚀 Starting SMTP settings migration...');

    // Check if Settings table exists first
    const settingsExists = await queryInterface.tableExists('Settings');
    if (!settingsExists) {
      console.log('❌ Settings table does not exist. This migration requires the base schema to be created first.');
      throw new Error('Settings table not found. Please ensure base schema migration has run.');
    }

    console.log('✅ Settings table exists, proceeding with SMTP column additions...');

    // Add SMTP settings columns to the Settings table
    await queryInterface.addColumn('Settings', 'smtp_enabled', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Enable/disable SMTP email functionality'
    });

    await queryInterface.addColumn('Settings', 'smtp_host', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'SMTP server hostname (e.g., smtp.gmail.com)'
    });

    await queryInterface.addColumn('Settings', 'smtp_port', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 587,
      comment: 'SMTP server port (587 for TLS, 465 for SSL, 25 for none)'
    });

    await queryInterface.addColumn('Settings', 'smtp_secure', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Use SSL/TLS encryption (true for SSL port 465, false for TLS port 587)'
    });

    await queryInterface.addColumn('Settings', 'smtp_auth_user', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'SMTP authentication username'
    });

    await queryInterface.addColumn('Settings', 'smtp_auth_pass', {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SMTP authentication password (encrypted)'
    });

    await queryInterface.addColumn('Settings', 'smtp_from_email', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Default sender email address'
    });

    await queryInterface.addColumn('Settings', 'smtp_from_name', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Default sender display name'
    });

    await queryInterface.addColumn('Settings', 'smtp_encryption', {
      type: DataTypes.ENUM('tls', 'ssl', 'none'),
      allowNull: false,
      defaultValue: 'tls',
      comment: 'Encryption type: tls, ssl, or none'
    });

    await queryInterface.addColumn('Settings', 'smtp_connection_timeout', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5000,
      comment: 'Connection timeout in milliseconds'
    });

    await queryInterface.addColumn('Settings', 'smtp_debug', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Enable SMTP debug logging'
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Settings', ['smtp_enabled'], {
      name: 'idx_settings_smtp_enabled'
    });

    await queryInterface.addIndex('Settings', ['smtp_host'], {
      name: 'idx_settings_smtp_host'
    });

    console.log('✅ SMTP settings migration completed successfully');
  },

  async down({ context: queryInterface }) {
    // Remove indexes first
    await queryInterface.removeIndex('Settings', 'idx_settings_smtp_enabled');
    await queryInterface.removeIndex('Settings', 'idx_settings_smtp_host');

    // Remove SMTP columns
    await queryInterface.removeColumn('Settings', 'smtp_enabled');
    await queryInterface.removeColumn('Settings', 'smtp_host');
    await queryInterface.removeColumn('Settings', 'smtp_port');
    await queryInterface.removeColumn('Settings', 'smtp_secure');
    await queryInterface.removeColumn('Settings', 'smtp_auth_user');
    await queryInterface.removeColumn('Settings', 'smtp_auth_pass');
    await queryInterface.removeColumn('Settings', 'smtp_from_email');
    await queryInterface.removeColumn('Settings', 'smtp_from_name');
    await queryInterface.removeColumn('Settings', 'smtp_encryption');
    await queryInterface.removeColumn('Settings', 'smtp_connection_timeout');
    await queryInterface.removeColumn('Settings', 'smtp_debug');
  }
};
