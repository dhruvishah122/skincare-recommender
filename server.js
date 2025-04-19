import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/recommend", async (req, res) => {
    const userQuery = req.body.query;
    console.log("Received query:", userQuery);
    try {
        const response = await axios.post("http://localhost:8090/recommend", {
            query: userQuery,
        });
console.log("Response from Flask server:", response.data);
        res.json(response.data);
    } catch (err) {
        console.error("Error calling Flask server:", err.message);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Node server running at http://localhost:${PORT}`);
});
