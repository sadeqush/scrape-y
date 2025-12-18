# Quick Start Guide

## What's Been Built

A complete Electron desktop application with:
- **NestJS backend** running inside Electron
- **React frontend** with Vite
- **SQLite database** for local storage
- **Web scrapers** for StarTech, Ryans Computers, and TechLand
- **Sync functionality** to send data to remote server

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts:
1. NestJS server (localhost:3000+)
2. Vite dev server (localhost:5173)
3. Electron desktop window

### First Run

When you start the app, you'll see:
- A dashboard with product statistics
- Buttons to scrape each ecommerce site
- Recent scraping jobs table
- Sync button

### Testing the Scrapers

**Note:** The CSS selectors in the scrapers are placeholder patterns. Before scraping works properly, you need to:

1. Visit each site (StarTech, Ryans, TechLand)
2. Inspect the HTML structure
3. Update the selectors in:
   - `src/scrapers/implementations/startech.scraper.ts`
   - `src/scrapers/implementations/ryans.scraper.ts`
   - `src/scrapers/implementations/techland.scraper.ts`

### Database Location

SQLite database is created at: `./scrape-y.db` in development mode

In production (Electron), it will be in:
- Windows: `%APPDATA%/scrape-y/scrape-y.db`
- macOS: `~/Library/Application Support/scrape-y/scrape-y.db`
- Linux: `~/.config/scrape-y/scrape-y.db`

## API Endpoints

The embedded NestJS server provides:

### Products
- `GET http://localhost:3000/products` - List products
- `GET http://localhost:3000/products/stats` - Get statistics
- `GET http://localhost:3000/products/:id` - Get single product

### Scrapers
- `POST http://localhost:3000/scrapers/scrape` - Trigger scraping
  ```json
  {
    "site": "startech",
    "category": "laptop",
    "maxPages": 2
  }
  ```
- `GET http://localhost:3000/scrapers/sites` - List available sites
- `GET http://localhost:3000/scrapers/jobs` - List scraping jobs

### Sync
- `POST http://localhost:3000/sync/trigger` - Trigger sync
- `GET http://localhost:3000/sync/status` - Get sync status

## Troubleshooting

### Electron won't start
- The app runs with `--no-sandbox` flag for development
- For production, you may need to set proper permissions

### Database errors
- Delete `scrape-y.db` and restart

### Scraping returns no products
- Update CSS selectors in scraper implementations to match actual site HTML

### Port already in use
- The app will try ports 3000-3005 for NestJS
- Make sure no other app is using ports 3000-5173

## Next Steps

1. **Update scrapers**: Inspect target sites and update CSS selectors
2. **Configure remote sync**: Set `REMOTE_SERVER_URL` in .env file
3. **Test scraping**: Click "Scrape StarTech" button and monitor jobs table
4. **Build executable**: Run `npm run package` to create distributable app

## Building for Production

```bash
# Build all components
npm run build

# Package for your platform
npm run package        # Current platform
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

Output in `dist-electron/` directory.
