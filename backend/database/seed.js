const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function seedDatabase() {
  console.log('');
  console.log('🌱 Seeding database with sample data...');
  console.log('');
  
  try {
    // Read the seed file
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    console.log('📄 Found seed.sql');
    console.log('⏳ Inserting sample data...');
    
    // Execute the seed file
    await pool.query(seedSQL);
    
    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📊 Sample data created:');
    console.log('');
    console.log('   🏪 Shops:');
    console.log('      - Tienda de María (slug: maria)');
    console.log('      - Tienda de Juan (slug: juan)');
    console.log('');
    console.log('   👥 Users (password for all: "password123"):');
    console.log('      - maria@tienda.com (owner)');
    console.log('      - ana@tienda.com (employee)');
    console.log('      - juan@tienda.com (owner)');
    console.log('');
    console.log('   📦 Products: 10 total');
    console.log('      - 5 products in María\'s shop');
    console.log('      - 5 products in Juan\'s shop');
    console.log('');
    console.log('   📊 Inventory: ~50 variants (size/color combinations)');
    console.log('');
    console.log('   💰 Sales: 5 sample sales from the last 3 days');
    console.log('');
    
    // Query to verify data
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM shops) as shops,
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM inventory) as inventory_items,
        (SELECT COUNT(*) FROM sales) as sales
    `);
    
    console.log('📈 Database totals:');
    console.log(`   - ${result.rows[0].shops} shops`);
    console.log(`   - ${result.rows[0].users} users`);
    console.log(`   - ${result.rows[0].products} products`);
    console.log(`   - ${result.rows[0].inventory_items} inventory items`);
    console.log(`   - ${result.rows[0].sales} sales`);
    console.log('');
    
    // Close the pool
    await pool.end();
    
    console.log('🎉 Seeding complete!');
    console.log('');
    console.log('Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Test login with: maria@tienda.com / password123');
    console.log('   3. Check health: http://localhost:4000/health');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Seeding failed!');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('💡 Tip: Run migrations first with:');
      console.log('   npm run db:migrate');
      console.log('');
    }
    
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();
