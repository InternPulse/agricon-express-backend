import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('AGRICON – Internpulse Project, Cohort 8 (2025)');
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})