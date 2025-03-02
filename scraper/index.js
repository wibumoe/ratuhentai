const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://ratuhentai.anitokiryuu.workers.dev/';

// Fungsi untuk mengambil HTML dari halaman
const fetchHTML = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
            }
        });
        return cheerio.load(data);
    } catch (error) {
        console.error(`❌ Gagal mengambil halaman ${url}:`, error.message);
        return null;
    }
};

// ✅ Scrape Beranda (Daftar Anime Terbaru) dengan Pagination
const scrapeHome = async (page = 1) => {
    const url = page > 1 ? `${BASE_URL}page/${page}/` : BASE_URL;
    const $ = await fetchHTML(url);
    if (!$) return null;

    let latestAnime = [];
    $('.listupd > article').each((_, el) => {
        const element = $(el);
        const title = element.find('.tt').text().trim();
        const animeUrl = element.find('a').attr('href') || null;
        const image = element.find('img').attr('src') || null;

        latestAnime.push({ 
            title, 
            url: animeUrl ? animeUrl.replace(BASE_URL, '/episode/') : null, 
            image 
        });
    });

    // 🔹 Ambil URL halaman sebelumnya & berikutnya
    const prevPage = $('.pagination .prev').attr('href') || null;
    const nextPage = $('.pagination .next').attr('href') || null;

    return {
        latestAnime,
        prevPage: prevPage ? prevPage.replace(BASE_URL, '/home?page=') : null,
        nextPage: nextPage ? nextPage.replace(BASE_URL, '/home?page=') : null
    };
};

module.exports = { scrapeHome };


// 2️⃣ Scrape Halaman Episode (Streaming & Download)
const scrapeEpisode = async (episodeUrl) => {
    const $ = await fetchHTML(episodeUrl);
    if (!$) return null;

    const title = $('h1.entry-title').text().trim();
    const thumbnail = $('.entry-content img').attr('src');

    let videoLinks = [];
    let downloadLinks = [];

    // Ambil seluruh script dalam halaman untuk mencari URL video
    const scriptTags = $('script').map((_, el) => $(el).html()).get();

    // Cari URL video dalam JavaScript menggunakan regex yang lebih fleksibel
    const videoRegex = /var\s+videoUrl\s*=\s*["'](https?:\/\/[^"']+)["']/i;
    for (const script of scriptTags) {
        const match = videoRegex.exec(script);
        if (match) {
            videoLinks.push({ type: 'stream', url: match[1] });
        }
    }

    // Ambil link download
    $('.listlink li a').each((_, el) => {
        const quality = $(el).text().trim();
        const url = $(el).attr('href');
        downloadLinks.push({ quality, url });
    });

    // Ambil episode sebelumnya, berikutnya, dan daftar episode
    const prevEpisode = $('.nvs a[rel="prev"]').attr('href');
    const nextEpisode = $('.nvs a[rel="next"]').attr('href');
    const allEpisodes = $('.nvs a[rel="all"]').attr('href');

    return { 
        title, 
        thumbnail, 
        episodeUrl, 
        videoLinks, 
        downloadLinks,
        prevEpisode: prevEpisode ? prevEpisode.replace(BASE_URL, '/episode/') : null,
        nextEpisode: nextEpisode ? nextEpisode.replace(BASE_URL, '/episode/') : null,
        allEpisodes: allEpisodes ? allEpisodes.replace(BASE_URL, '/') : null
    };
};


// Endpoint Scraper
module.exports = { scrapeEpisode };

// 3️⃣ Scrape Halaman Detail Anime (Info + Episode List)
const scrapeAnime = async (animeUrl) => {
    const $ = await fetchHTML(animeUrl);
    if (!$) return null;

    const title = $('.entry-title').text().trim();
    const image = $('.entry-content img').attr('src');
    const synopsis = $('.entry-content p').eq(1).text().trim();

    let genres = [];
    $('.tags a').each((_, el) => {
        genres.push($(el).text().trim());
    });

    const type = $('th:contains("Tipe:")').next().text().trim();
    const episodes = $('th:contains("Episode:")').next().text().trim();
    const status = $('th:contains("Status:")').next().text().trim();
    const score = $('th:contains("Skor:")').next().text().trim();
    const producer = $('th:contains("Produser:")').next().text().trim();
    const year = $('th:contains("Tahun:")').next().text().trim();

    let episodeList = [];
    $('.daftar li a').each((_, el) => {
        const episodeUrl = $(el).attr('href').replace(BASE_URL, '/episode/');
        episodeList.push({
            title: $(el).text().trim(),
            url: episodeUrl
        });
    });

    return {
        title,
        image,
        synopsis,
        type,
        episodes,
        genres,
        status,
        score,
        producer,
        year,
        episodeList
    };
};

// 4️⃣ Endpoint Scraper
module.exports = { scrapeHome, scrapeEpisode, scrapeAnime };
