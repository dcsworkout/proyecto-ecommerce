const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function runMigrations() {
  console.log('');
  console.log('🔧 Running database migrations...');
  console.log('');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Found schema.sql');
    console.log('⏳ Executing schema...');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('');
    console.log('✅ Database schema created successfully!');
    console.log('');
    console.log('📊 Tables created:');
    console.log('   - shops');
    console.log('   - users');
    console.log('   - products');
    console.log('   - inventory');
    console.log('   - sales');
    console.log('');
    console.log('📈 Views created:');
    console.log('   - v_inventory_detail');
    console.log('   - v_sales_detail');
    console.log('');
    console.log('🔍 Functions created:');
    console.log('   - get_dashboard_metrics()');
    console.log('');
    
    // Close the pool
    await pool.end();
    
    console.log('👍 Migration complete!');
    console.log('');
    console.log('Next step: Run seed data with:');
    console.log('   npm run db:seed');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed!');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('💡 Tip: Create the database first with:');
      console.log('   psql -U postgres -c "CREATE DATABASE ecommerce_db;"');
      console.log('');
      console.log('Or use the helper script:');
      console.log('   npm run db:create');
      console.log('');
    }
    
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
