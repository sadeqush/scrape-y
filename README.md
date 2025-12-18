# Scrape-Y

A desktop application for scraping Bangladeshi computer parts and accessories ecommerce websites.

## Features

- 🖥️ **Desktop Application**: Built with Electron for cross-platform support (Windows, macOS, Linux)
- 🚀 **NestJS Backend**: Embedded HTTP server running inside Electron
- ⚛️ **React Frontend**: Modern UI built with React and Vite
- 🗄️ **SQLite Database**: Local data storage with TypeORM
- 🔄 **Auto Sync**: Periodic synchronization with remote server
- 🕷️ **Smart Scraping**: Cheerio for fast static scraping, Playwright fallback for dynamic sites

## Supported Sites

- StarTech (https://www.startech.com.bd)
- Ryans Computers (https://www.ryanscomputers.com)
- TechLand (https://www.techlandbd.com)

## Architecture

```
┌─────────────────────────────────────┐
│         Electron Main Process        │
│  ┌────────────────────────────────┐  │
│  │   NestJS Server (localhost)    │  │
│  │   - Scraper Services           │  │
│  │   - Products API               │  │
│  │   - Sync Service               │  │
│  │   - SQLite Database            │  │
│  └────────────────────────────────┘  │
└─────────────────────────────────────┘
           ↕ IPC + HTTP
┌─────────────────────────────────────┐
│       Electron Renderer Process      │
│  ┌────────────────────────────────┐  │
│  │      React Frontend (Vite)     │  │
│  │   - Dashboard                  │  │
│  │   - Scraper Controls           │  │
│  │   - Product List               │  │
│  │   - Sync Status                │  │
│  └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Development

### Prerequisites

- Node.js 18+ and npm
- Python (for node-gyp, required by better-sqlite3)
- Build tools (Visual Studio Build Tools on Windows, Xcode on macOS, build-essential on Linux)

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

Start all processes concurrently:

```bash
npm run dev
```

This will:
1. Start NestJS backend with hot reload (port 3000)
2. Start Vite dev server for React frontend (port 5173)
3. Start Electron window

Or run individually:

```bash
# Terminal 1: NestJS
npm run dev:nest

# Terminal 2: React
npm run dev:renderer

# Terminal 3: Electron
npm run dev:electron
```

### Build for Production

Build all components:

```bash
npm run build
```

Individual builds:

```bash
npm run build:nest      # Build NestJS backend
npm run build:renderer  # Build React frontend
npm run build:electron  # Build Electron main process
```

### Package as Executable

Package for current platform:

```bash
npm run package
```

Platform-specific packaging:

```bash
npm run package:win    # Windows installer
npm run package:mac    # macOS DMG
npm run package:linux  # Linux AppImage and deb
```

Output will be in `dist-electron/` directory.

## Project Structure

```
scrape-y/
├── src/                        # NestJS backend
│   ├── database/              # TypeORM entities and modules
│   ├── scrapers/              # Scraper implementations
│   ├── products/              # Products CRUD
│   ├── sync/                  # Remote sync service
│   └── main.ts                # NestJS bootstrap
├── electron/                   # Electron main process
│   ├── main/
│   │   ├── index.ts          # Electron entry point
│   │   ├── nest-server.ts    # NestJS lifecycle manager
│   │   ├── window-manager.ts # Window management
│   │   └── ipc-handlers.ts   # IPC communication
│   ├── preload/
│   │   └── index.ts          # Preload script (secure bridge)
│   └── types/                 # TypeScript types
├── renderer/                   # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API client
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # React entry point
│   ├── index.html
│   └── vite.config.ts
├── resources/                  # App resources
│   └── icons/                 # App icons
├── electron-builder.yml        # Electron Builder config
├── tsconfig.json              # NestJS TypeScript config
├── tsconfig.electron.json     # Electron TypeScript config
└── package.json

```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Development
NODE_ENV=development
PORT=3000

# Remote sync server (optional)
REMOTE_SERVER_URL=https://your-server.com

# Database (auto-configured by Electron, but can override)
DB_PATH=/path/to/database.db
```

### Database Location

The SQLite database is stored in the user's application data directory:

- **Windows**: `%APPDATA%/scrape-y/scrape-y.db`
- **macOS**: `~/Library/Application Support/scrape-y/scrape-y.db`
- **Linux**: `~/.config/scrape-y/scrape-y.db`

## API Endpoints

The embedded NestJS server exposes these REST endpoints:

### Products

- `GET /products` - List products with filtering
- `GET /products/:id` - Get product details
- `GET /products/stats` - Get statistics
- `DELETE /products/:id` - Delete product

### Scrapers

- `POST /scrapers/scrape` - Trigger scraping
- `GET /scrapers/sites` - List available sites
- `GET /scrapers/jobs` - List scraping jobs
- `GET /scrapers/jobs/:id` - Get job status

### Sync

- `POST /sync/trigger` - Trigger sync to remote server
- `GET /sync/status` - Get sync status
- `GET /sync/history` - Get sync history

## Scraper Implementation

Each scraper extends the `BaseScraper` class:

```typescript
export class StarTechScraper extends BaseScraper {
  protected siteConfig: ScraperConfig = {
    baseUrl: 'https://www.startech.com.bd',
    selectors: {
      productList: '.p-item',
      productName: '.p-item-name a',
      price: '.p-item-price span',
      // ...
    },
    rateLimit: 1500,
  };

  async scrapeProductList(category: string, page: number): Promise<ProductData[]> {
    // Implementation
  }
}
```

## Technologies Used

- **Electron** - Desktop app framework
- **NestJS** - Backend framework
- **React** - Frontend framework
- **Vite** - Frontend build tool
- **TypeORM** - ORM for SQLite
- **better-sqlite3** - Synchronous SQLite driver
- **Cheerio** - HTML parsing
- **Playwright** - Browser automation
- **Axios** - HTTP client

## License

UNLICENSED

## Contributing

This is a private project. Contributions are not accepted at this time.
