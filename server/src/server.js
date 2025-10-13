import express from "express";
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favoritesTable } from "./db/schema.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings} = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newFavorite = await db.insert(favoritesTable).values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings,
    }).returning();

    res.status(201).json(newFavorite[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date() });
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
});