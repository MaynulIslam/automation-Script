require('dotenv').config();
const { Client } = require('pg');

const checkMigrationStatus = async () => {
  const client = new Client({
    database: process.env.SENSOR_DB_NAME || process.env.META_DB_NAME,
    user: process.env.SENSOR_DB_USERNAME || process.env.META_DB_USERNAME,
    password: process.env.SENSOR_DB_PASSWORD || process.env.META_DB_PASSWORD,
    host: process.env.SENSOR_DB_HOST || process.env.META_DB_HOST || 'localhost',
    port: process.env.SENSOR_DB_PORT || process.env.META_DB_PORT || 5432
  });

  try {
    await client.connect();
    console.log('🔍 Checking database migration status...\n');

    // Check for SequelizeMeta table
    const metaResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'SequelizeMeta'
      );
    `);
    
    if (metaResult.rows[0].exists) {
      console.log('✅ SequelizeMeta table exists');
      const migrations = await client.query('SELECT * FROM "SequelizeMeta" ORDER BY name');
      console.log(`📋 Completed migrations: ${migrations.rows.length}`);
      migrations.rows.forEach(m => console.log(`   - ${m.name}`));
    } else {
      console.log('❌ SequelizeMeta table not found (no migrations run yet)');
    }

    console.log('\n📊 Checking for new tables...');
    
    // Tables to check
    const newTables = [
      'Departments',
      'UserDepartments', 
      'DepartmentModules',
      'Notifications',
      'UserNotifications'
    ];

    for (const table of newTables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      console.log(`   ${result.rows[0].exists ? '✅' : '❌'} ${table}`);
    }

    console.log('\n🔧 Checking for new columns...');
    
    // Columns to check
    const columnsToCheck = [
      { table: 'Users', columns: ['department_id', 'last_login_at', 'notification_preferences'] },
      { table: 'Devices', columns: ['department_id', 'maintenance_schedule'] },
      { table: 'AlarmLogs', columns: ['acknowledged_by', 'acknowledged_at', 'notes'] },
      { table: 'Organizations', columns: ['timezone', 'settings'] }
    ];

    for (const check of columnsToCheck) {
      // First check if table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [check.table]);

      if (tableExists.rows[0].exists) {
        console.log(`\n   Table: ${check.table}`);
        for (const column of check.columns) {
          const result = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = $1 
              AND column_name = $2
            );
          `, [check.table, column]);
          
          console.log(`     ${result.rows[0].exists ? '✅' : '❌'} ${column}`);
        }
      } else {
        console.log(`\n   ⚠️  Table ${check.table} doesn't exist`);
      }
    }

    console.log('\n✨ Migration status check complete!');

  } catch (error) {
    console.error('❌ Error checking migration status:', error.message);
  } finally {
    await client.end();
  }
};

checkMigrationStatus();