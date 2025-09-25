# MeekotGYM

A cross-platform workout session tracker built with Expo and backed by a lightweight Node.js API for Gemini powered exercise suggestions.

## Project Structure

```
.
├── App.tsx                # Expo entry point
├── components/            # Reusable UI components
├── hooks/                 # Shared hooks (AsyncStorage persistence)
├── services/              # Client side API helpers
├── server/                # Express API for Gemini requests
└── types.ts               # Shared TypeScript types
```

## Prerequisites

- Node.js 18 or newer
- An Expo compatible package manager (`npm` is used in these instructions)
- A Google Gemini API key for suggestion generation

## Getting Started

1. Install dependencies for the Expo app:

   ```bash
   npm install
   ```

2. Install dependencies for the API:

   ```bash
   npm --prefix server install
   ```

3. Configure environment variables:

   - Create a `server/.env` file based on `server/.env.example` and add your `GEMINI_API_KEY`.
   - (Optional) Create an `.env` file at the project root and add `EXPO_PUBLIC_API_URL` if you are not running the API on `http://localhost:3333`.

4. Start the API locally:

   ```bash
   npm run server:dev
   ```

5. In a new terminal start the Expo development server:

   ```bash
   npm start
   ```

   Choose a platform (web, iOS, Android) from the Expo CLI to launch the app.

## Deploying the API to Coolify

The `server` directory contains everything required to run the Gemini proxy on [Coolify](https://coolify.io/).

1. Create a new **Node.js** service in Coolify and point it to the `server` directory of this repository.
2. Use the provided `Dockerfile` (default for the service) which builds the TypeScript source and starts the compiled server on port `3333`.
3. Configure the following environment variables inside Coolify:
   - `PORT`: Defaults to `3333`, change only if you need a different port.
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `ALLOWED_ORIGINS`: (Optional) Comma-separated list of origins allowed to access the API (e.g. `https://your-app.coolify.app`).
4. Deploy the service. Once running, note the public URL exposed by Coolify.
5. Update your Expo app configuration to point to the deployed API by setting `EXPO_PUBLIC_API_URL` to the public URL (including the protocol and port if required).

## Building the API locally

To produce a production build of the API (useful before deploying), run:

```bash
npm run server:build
```

The compiled JavaScript will be emitted to `server/dist`.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Build & launch the native Android app. |
| `npm run ios` | Build & launch the native iOS app. |
| `npm run web` | Run the app in a web browser using Expo for Web. |
| `npm run server:dev` | Start the Node.js API with hot reloading (via `tsx watch`). |
| `npm run server:build` | Compile the Node.js API to JavaScript. |
| `npm run server:start` | Start the compiled API from `server/dist`. |

## Environment Variables

| Variable | Location | Purpose |
| -------- | -------- | ------- |
| `EXPO_PUBLIC_API_URL` | Expo app | Base URL for the suggestion API. Defaults to `http://localhost:3333`. |
| `GEMINI_API_KEY` | `server/.env` | Gemini API key used by the server to fetch suggestions. |
| `PORT` | `server/.env` | Port the server listens on (default `3333`). |
| `ALLOWED_ORIGINS` | `server/.env` | Optional CORS allowlist. |

## Testing the API

After starting the API you can verify it is running by visiting `http://localhost:3333/health`. A successful response will return `{"status":"ok"}`.

## Notes

- Exercise history is stored locally on device using AsyncStorage.
- If the Gemini API key is missing, suggestion requests will fail gracefully with helpful messaging.
- The Expo configuration (`app.config.ts`) reads `EXPO_PUBLIC_API_URL` so you can easily point to different backends for development, staging or production.
