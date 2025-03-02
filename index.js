const express = require('express');
const { scrapeHome, scrapeEpisode, scrapeAnime } = require('./scraper');

const app = express();
const PORT = 3000;

// ✅ Endpoint untuk Home (Anime Terbaru) dengan Pagination
app.get('/home', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Ambil nilai `page` dari query, default = 1
    const data = await scrapeHome(page);
    
    if (!data) {
        return res.status(500).json({ error: "Gagal mengambil data." });
    }

    res.json(data);
});

// ✅ Endpoint untuk Episode (Menggunakan Slug)
app.get('/episode/:slug', async (req, res) => {
    const { slug } = req.params;
    const episodeUrl = `https://ratuhentai.anitokiryuu.workers.dev/${slug}/`;

    const data = await scrapeEpisode(episodeUrl);
    res.json(data);
});

// ✅ Endpoint untuk Detail Anime (Menggunakan Slug)
app.get('/anime/:slug', async (req, res) => {
    const { slug } = req.params;
    const animeUrl = `https://ratuhentai.anitokiryuu.workers.dev/anime/${slug}/`;

    const data = await scrapeAnime(animeUrl);
    res.json(data);
});

// ✅ Jalankan Server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
