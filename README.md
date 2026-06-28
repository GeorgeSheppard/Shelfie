# Frontend

## Running locally

Copy `.env.example` to create `.env.development`. Fill in the variables for your local environment.

Then navigate to the root of the frontend (wherever the `package.json` is) and run

`pnpm run dev`

Other scripts are available in the `package.json`.

## Manually building

Navigate to the root of the frontend
Make sure docker desktop is running

Make sure you have environment variables in `.env.production` that are correct.

`docker build -t jawil576/frontend:dev .`

`docker push jawil576/frontend:dev`
# Shelfie
