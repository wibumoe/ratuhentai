const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://ratuhentai.anitokiryuu.workers.dev/';


// Fungsi untuk Scraping Search (pencarian berdasarkan keyword)
const scrapeSearch = async (query) => {
    const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=anime`;  // Menggunakan query search URL
    const $ = await fetchHTML(url);
    if (!$) return null;

    const animeList = [];
    $('.bsz').each((index, element) => {
        const title = $(element).find('.tt h2').text().trim();
        const link = $(element).find('a').attr('href').replace(BASE_URL, '/');  // Menggunakan link relatif
        const image = $(element).find('img').attr('src');
        const status = $(element).find('.tt span').text().trim();

        animeList.push({
            title,
            link,  // Link relatif
            image,
            status
        });
    });

    return animeList;
};

// Fungsi untuk Scraping Genre
const scrapeGenre = async (genre) => {
    const url = `${BASE_URL}/genre/${genre}/`;  // Buat URL berdasarkan genre
    const $ = await fetchHTML(url);
    if (!$) return null;

    const animeList = [];
    $('.bsz').each((index, element) => {
        const title = $(element).find('.tt h2').text().trim();
        const link = $(element).find('a').attr('href').replace(BASE_URL, '/');  // Menggunakan link relatif
        const image = $(element).find('img').attr('src');
        const status = $(element).find('.tt span').text().trim();

        animeList.push({
            title,
            link,  // Link relatif
            image,
            status
        });
    });

    return animeList;
};

// Ekspor Fungsi Scraper
module.exports = { scrapeGenre };

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

// Fungsi untuk mengambil Anime Terbaru dengan Pagination
const scrapeHome = async (page = 1) => {
    const url = `${BASE_URL}/page/${page}`; // Menggunakan URL dengan nomor halaman
    const $ = await fetchHTML(url);
    if (!$) return null;

    const animeList = [];
    $('.bsz').each((index, element) => {
        const title = $(element).find('.tt h2').text().trim();
        const link = $(element).find('a').attr('href').replace(BASE_URL, '/');  // Menggunakan link relatif
        const image = $(element).find('img').attr('src');
        const status = $(element).find('.tt span').text().trim();

        animeList.push({
            title,
            link,  // Link relatif
            image,
            status
        });
    });

    return animeList;
};

// Fungsi untuk Scraping Episode
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

// Fungsi untuk Scraping Detail Anime
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

// Fungsi untuk Scraping Pagination (mengambil data halaman)
const scrapePagination = async (url) => {
    const $ = await fetchHTML(url);
    if (!$) return null;

    const currentPage = $('.page-numbers.current').text().trim(); // Halaman saat ini
    const nextPage = $('.next.page-numbers').attr('href'); // Link halaman berikutnya

    return {
        currentPage,
        nextPage
    };
};

// Ekspor Fungsi Scraper
module.exports = { scrapeSearch, scrapeGenre, scrapeHome, scrapeEpisode, scrapeAnime, scrapePagination };
