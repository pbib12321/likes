import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Root route for testing
app.get("/", (req, res) => {
	res.send("Render server is running ✅");
});

// Game stats route
app.get("/game-stats/:placeId", async (req, res) => {
	try {
		const placeId = req.params.placeId;

		const robloxRes = await fetch(
			`https://games.roblox.com/v1/games?placeIds=${placeId}`
		);

		if (!robloxRes.ok) {
			return res.status(500).json({ error: "Roblox API error" });
		}

		const data = await robloxRes.json();
		const game = data?.data?.[0];

		if (!game) {
			return res.status(404).json({ error: "Game not found" });
		}

		res.json({
			placeId: placeId,
			likes: game.upVotes,
			dislikes: game.downVotes,
			favorites: game.favoritedCount,
			visits: game.visits,
			timestamp: Date.now()
		});
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

// Start server
app.listen(PORT, () => {
	console.log("Render Roblox proxy running on port", PORT);
});
