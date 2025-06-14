import dbtest from "./test_database_connection/app";
import app from './app';
const port = process.env.PORT || 3000;
// const app = express();
// testConnection();
dbtest.get("/", (req, res) => {
    try {
        res.send("AGRICON – Internpulse Project, Cohort 8 (2025)");
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed", error: error });
    }
});
// dbtest.listen(port, () => {
//   console.log(`Listening on port localhost:${port}`);
// });
app.listen(port, () => {
    console.log(`Booking Listening on port localhost:${port}`);
});
