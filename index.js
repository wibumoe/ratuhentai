const express = require('express');
const { scrapeSearch, scrapeHome, scrapeEpisode, scrapeAnime, scrapePagination, scrapeGenre } = require('../scraper');
const serverless = require('serverless-http');

const app = express();
const PORT = 3000;

// Route for Search
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter `q` is required' });
    }

    try {
        const searchResults = await scrapeSearch(query);
        res.json(searchResults);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data pencarian' });
    }
});

// Route for Anime Terbaru with Pagination
app.get('/home/page/:page', async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    try {
        const animeList = await scrapeHome(page);
        res.json(animeList);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data anime terbaru' });
    }
});

// Route for Anime Details
app.get('/anime/:slug', async (req, res) => {
    const { slug } = req.params;
    const animeUrl = `https://ratuhentai.anitokiryuu.workers.dev/anime/${slug}/`;
    
    try {
        const animeData = await scrapeAnime(animeUrl);
        res.json(animeData);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data detail anime' });
    }
});

// Route for Episode Details
app.get('/episode/:slug', async (req, res) => {
    const { slug } = req.params;
    const episodeUrl = `https://ratuhentai.anitokiryuu.workers.dev/${slug}/`;

    try {
        const episodeData = await scrapeEpisode(episodeUrl);
        res.json(episodeData);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data episode' });
    }
});

// Route for Pagination
app.get('/pagination', async (req, res) => {
    try {
        const paginationData = await scrapePagination('https://ratuhentai.anitokiryuu.workers.dev/');
        res.json(paginationData);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data pagination' });
    }
});

// Route for Genre
app.get('/genre/:genre', async (req, res) => {
    const { genre } = req.params;
    const data = await scrapeGenre(genre);
    
    if (!data) {
        return res.status(500).json({ error: "Gagal mengambil data." });
    }

    res.json(data);
});

// Create serverless function for Vercel
module.exports = serverless(app);
