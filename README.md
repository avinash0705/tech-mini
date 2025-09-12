# Tech Minis Standalone

A standalone Next.js application that includes the tech minis functionality extracted from the main Naukri application.

## Features

- **Tech Minis Feed**: Display latest tech news and career insights
- **Filtering**: Filter content by categories and tags
- **Responsive Design**: Mobile-first responsive design
- **Redux State Management**: Centralized state management
- **API Integration**: Integration with Naukri's minis API

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   └── MinisUnified/          # Main minis components
│       ├── index.js           # Main MinisUnified component
│       ├── MinisCard.js       # Individual minis card
│       ├── MinisFilters.js    # Filter component
│       ├── LoadingSpinner.js  # Loading component
│       └── ErrorMessage.js    # Error component
├── config/
│   └── browserConfig.js       # API endpoints configuration
├── pages/
│   ├── _app.js               # App wrapper with Redux
│   ├── index.js              # Home page (redirects to minis)
│   └── minis.js              # Main minis page
├── store/
│   ├── store.js              # Redux store configuration
│   ├── actions/              # Redux actions
│   └── reducers/             # Redux reducers
├── styles/
│   └── globals.scss          # Global styles
└── utils/
    ├── ajax.js               # API wrapper
    ├── browser/
    │   └── cookies.js        # Cookie utilities
    └── index.js              # General utilities
```

## API Integration

The application integrates with the following APIs:

- **MINIS_DATA_API**: Fetches minis content
- **MINIS_ACTION_API**: Handles user interactions
- **UNIFIED_FEED_API**: Fetches unified feed content

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

### API Endpoints

API endpoints are configured in `src/config/browserConfig.js`. You can modify these to point to different environments.

### Styling

The application uses SCSS modules for styling. Global styles are in `src/styles/globals.scss`.

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the Naukri application ecosystem.
