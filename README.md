# AstroMath

A Phaser-based educational game built with React and Firebase.

## Setup

Copy .env.example to .env and replace the placeholder values with your Firebase credentials before running the project.

## Available Scripts

1. Install [Node.js](https://nodejs.org/) (version 18 or higher is recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase by editing `src/firebase/firebaseConfig.ts` with your project credentials. The file contains the keys used by the demo instance.

## Environment Variables

Create a `.env` file in the project root if you need to override the Firebase credentials or other settings. Common variables are:

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

The application does not read these variables by default, so update `firebaseConfig.ts` if you want to load them from `process.env`.

## Development Commands

- `npm start` – start the development server.
- `npm test` – run the test suite.
- `npm run build` – create a production build.

## Starting the Game

Run `npm start` and open [http://localhost:3000/game](http://localhost:3000/game) in your browser. The game uses Phaser inside a React component.

## Firebase Configuration

Firebase is initialized in [`src/firebase/firebaseConfig.ts`](src/firebase/firebaseConfig.ts) with the following snippet:

```ts
const firebaseConfig = {
  apiKey: 'AIzaSyDIuLpoHX9SVhXAoM9hHwNdRA9YIFG7ctU',
  authDomain: 'astromath-51ed3.firebaseapp.com',
  projectId: 'astromath-51ed3',
  storageBucket: 'astromath-51ed3.firebasestorage.app',
  messagingSenderId: '240936440046',
  appId: '1:240936440046:web:3477de2cad9a4ade9923ff',
}
```

Authentication and Firestore services are exported as `auth` and `db` for use throughout the app.
