import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const maxRetries = 30;
const retryDelay = 2000;

async function waitForDatabase() {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.connect();
      console.log('✅ Database connected successfully');
      await client.end();
      return;
    } catch (error) {
      console.log(`⏳ Waiting for database... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  console.error('❌ Could not connect to database after maximum retries');
  process.exit(1);
}

waitForDatabase();