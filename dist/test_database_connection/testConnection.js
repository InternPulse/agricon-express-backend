import { closeDB, query } from "./database";
export const testConnection = async () => {
    try {
        console.log("🔌 Testing database connection...");
        console.log("✅ Database connected successfully!");
        // Test creating a simple table
        await query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        console.log("✅ Test table created");
        await query("INSERT INTO test_table (message) VALUES ($1)", [
            "Connection test successful!",
        ]);
        console.log("✅ Test data inserted");
        const testData = await query("SELECT * FROM test_table ORDER BY created_at DESC LIMIT 1");
        console.log("✅ Test data retrieved:", testData.rows[0]);
        console.log("🎉 All database operations working!");
    }
    catch (error) {
        console.error("❌ Database test failed:", error);
    }
    finally {
        await closeDB();
        process.exit(0);
    }
};
testConnection();
