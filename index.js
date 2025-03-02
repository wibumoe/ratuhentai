const express = require("express");
const cors = require("cors");
const { scrapeHome, scrapeEpisode, scrapeAnime } = require("./scraper");

const app = express();
app.use(cors()); // Mengizinkan akses dari semua domain

// ✅ Endpoint untuk Home (Anime Terbaru) dengan Pagination
app.get("/home", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await scrapeHome(page);

    if (!data) {
      return res.status(500).json({ error: "Gagal mengambil data." });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ✅ Endpoint untuk Episode (Menggunakan Slug)
app.get("/episode/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const episodeUrl = `https://ratuhentai.anitokiryuu.workers.dev/${slug}/`;

    const data = await scrapeEpisode(episodeUrl);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ✅ Endpoint untuk Detail Anime (Menggunakan Slug)
app.get("/anime/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const animeUrl = `https://ratuhentai.anitokiryuu.workers.dev/anime/${slug}/`;

    const data = await scrapeAnime(animeUrl);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ✅ Export Express App untuk Vercel
module.exports = app;
