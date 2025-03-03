# Ratuhentai API Documentation

Welcome to the Ratuhentai API! Below are the available routes and how to use them.
[ratuhentai.pro](https://ratuhentai.pro/)


**Ratuhentai Adalah Situs Nonton dan Download AV Anime Hentai Subtitle Indonesia 18+ Terbaru, Nekopoi MiniOppai RajaHentai Meowku Update Setiap Hari dengan Kualitas HD.**
## Available Routes

### 1. **Search for Anime**
- **Route**: `/search`
- **Description**: Search for anime by title.
- **Query Parameter**: `q` (the anime title)
- **Example**: 
  - `/search?q=overflow`

### 2. **Latest Anime List with Pagination**
- **Route**: `/home/page/:page`
- **Description**: Get the latest anime list with pagination.
- **URL Parameter**: `page` (page number)
- **Example**: 
  - `/home/page/1`

### 3. **Anime Details**
- **Route**: `/anime/:slug`
- **Description**: Get detailed information about a specific anime.
- **URL Parameter**: `slug` (the anime slug from URL)
- **Example**: 
  - `/anime/overflow/`

### 4. **Episode Details**
- **Route**: `/episode/:slug`
- **Description**: Get episode details for a specific anime episode.
- **URL Parameter**: `slug` (the episode slug)
- **Example**: 
  - `/episode/overflow-episode-1-subtitle-indonesia/`

### 5. **Pagination Info**
- **Route**: `/pagination`
- **Description**: Get pagination info (current page and next page).
- **Example**: 
  - `/pagination`

### 6. **Anime by Genre**
- **Route**: `/genre/:genre`
- **Description**: Get a list of anime for a specific genre.
- **URL Parameter**: `genre` (the genre of anime, e.g., action, romance)
- **Example**: 
  - `/genre/action`

## Example Request

Here’s how to use the `/search` route:

```bash
GET /search?q=action
