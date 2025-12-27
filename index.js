import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

/*
  GET /game-stats/:placeId
  Example:
  /game-stats/92646770282556
*/
app.get("/game-stats/:placeId", async (req, res) => {
	try {
		const placeId = req.params.placeId;

		const robloxRes = await fetch(
			`https://games.roblox.com/v1/games?placeIds=${placeId}`
		);

		if (!robloxRes.ok) {
			return res.status(500).json({ error: "Roblox API error" });
		}

		const json = await robloxRes.json();
		const game = json?.data?.[0];

		if (!game) {
			return res.status(404).json({ error: "Game not found" });
		}

		// Always fresh data
		res.json({
			placeId: placeId,
			likes: game.upVotes,
			dislikes: game.downVotes,
			favorites: game.favoritedCount,
			visits: game.visits,
			timestamp: Date.now()
		});
	} catch (err) {
		res.status(500).json({ error: "Server failure" });
	}
});

app.listen(PORT, () => {
	console.log("Roblox stats proxy running on port", PORT);
});
