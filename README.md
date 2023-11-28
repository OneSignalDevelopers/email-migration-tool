# Welcome to Email Migration Tool!

This project simplifies downloading email lists from the following ESPs:
- [MailChimp](./docs/
- Mailgun
- SendGrid

## Development

From your terminal:

```sh
yarn dev
```

This starts the app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn  start
```

This tool is currently deployed on Vercel.

## Email Contact List Generator

Email Migration Tool requires existing email lists in your ESP platform. To create a dummy dataset, use the `emailgen` tool

From the root of the project from your terminal: 

```sh
cd tools/emailgen && yarn build
```

One CSV file will be created per platform.
