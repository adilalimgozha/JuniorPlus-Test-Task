import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "notes_db",
  password: "12345",
  port: 5438,
});

export default pool;
