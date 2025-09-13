import { Pool } from "pg";


const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db", 
  database: process.env.DB_NAME || "notes_db", 
  password: process.env.DB_PASSWORD || "12345",
  port: parseInt(process.env.DB_PORT || "5432"), // 5432 внутри Docker, 5438 снаружи
});


export default pool;