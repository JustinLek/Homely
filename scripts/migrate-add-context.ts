import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'transactions.db');

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.log('❌ Database does not exist. Run "npm run import" first.');
  process.exit(1);
}

const db = new Database(dbPath);

console.log('🔄 Adding user_context column to transactions table...');

try {
  // Check if column already exists
  const tableInfo = db.prepare('PRAGMA table_info(transactions)').all() as any[];
  const hasContextColumn = tableInfo.some((col: any) => col.name === 'user_context');

  if (hasContextColumn) {
    console.log('✅ Column user_context already exists');
  } else {
    // Add the column
    db.exec(`
      ALTER TABLE transactions
      ADD COLUMN user_context TEXT;
    `);
    console.log('✅ Column user_context added successfully');
  }

  // Show table structure
  console.log('\n📋 Current table structure:');
  const columns = db.prepare('PRAGMA table_info(transactions)').all() as any[];
  columns.forEach((col: any) => {
    console.log(`  - ${col.name} (${col.type})`);
  });

  db.close();
  console.log('\n🎉 Migration complete!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  db.close();
  process.exit(1);
}
