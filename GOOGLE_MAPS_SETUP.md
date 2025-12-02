# Google Maps Setup

To use the real Google Maps in the location picker, you need to:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API"
   - Create credentials (API Key)

2. **Add the API Key to your environment:**
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Features
- Real Google Maps with Portugal centered
- Interactive markers for surf spots
- Click markers to select location
- Info windows with location details
- Custom styled map for better surf spot visibility

## Surf Spots Included
- **Costa da Caparica** - Popular surf spot near Lisbon
- **Tonel Beach** - Famous surf spot in South Portugal  
- **Carcavelos** - Classic beach break close to Lisbon 