import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Root route to test service
app.get("/", (req, res) => {
  res.send("Render server is running ✅");
});

// Game stats route
app.get("/game-stats/:placeId", async (req, res) => {
  try {
    const placeId = req.params.placeId;

    const robloxRes = await fetch(`https://games.roblox.com/v1/games?placeIds=${placeId}`);
    const json = await robloxRes.json();
    const game = json?.data?.[0];

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({
      placeId,
      likes: game.upVotes,
      dislikes: game.downVotes,
      favorites: game.favoritedCount,
      visits: game.visits
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
