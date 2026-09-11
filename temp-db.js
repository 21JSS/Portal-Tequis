import { query } from './lib/db';

async function checkDb() {
  try {
    const results = await query('DESCRIBE ropredial');
    console.log(results);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkDb();
