const express = require('express');
const { scrapeSearch, scrapeHome, scrapeEpisode, scrapeAnime, scrapePagination } = require('./scraper');

const app = express();
const PORT = 3000;


// Route for API Usage Instructions
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the Ratuhentai API! Here are the available routes:",
        routes: {
            "/search": {
                description: "Search for anime by title",
                queryParam: "q (the anime title)",
                example: "/search?q=action"
            },
            "/home/page/:page": {
                description: "Get the latest anime list with pagination",
                params: "page (page number)",
                example: "/home/page/1"
            },
            "/anime/:slug": {
                description: "Get detailed information about a specific anime",
                params: "slug (the anime slug from URL)",
                example: "/anime/naruto"
            },
            "/episode/:slug": {
                description: "Get episode details for a specific anime episode",
                params: "slug (the episode slug)",
                example: "/episode/naruto-episode-1"
            },
            "/pagination": {
                description: "Get pagination info (current page and next page)",
                example: "/pagination"
            },
            "/genre/:genre": {
                description: "Get a list of anime for a specific genre",
                params: "genre (the genre of anime, e.g., action, romance)",
                example: "/genre/action"
            }
        }
    });
});

// Route for Search
app.get('/search', async (req, res) => {
    const query = req.query.q; // Get the query parameter `q` from the URL
    if (!query) {
        return res.status(400).json({ error: 'Query parameter `q` is required' });
    }

    try {
        const searchResults = await scrapeSearch(query); // Scrape search results
        res.json(searchResults); // Send search results as JSON response
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
