import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

app.get("/votes/:universeId", async (req, res) => {
  try {
    const universeId = req.params.universeId;
    const response = await fetch(
      `https://games.roblox.com/v1/games/votes?universeIds=${universeId}`
    );
    const json = await response.json();

    if (!json.data || json.data.length === 0) {
      return res.status(404).json({ error: "No vote data found" });
    }

    res.json({
      upVotes: json.data[0].upVotes,
      downVotes: json.data[0].downVotes,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

