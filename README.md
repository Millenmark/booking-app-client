# KB Barbershop (Booking Application)

A modern monorepo booking app with separate admin and customer interfaces. The admin dashboard includes analytics, data grids, and charts for bookings, revenue, and services, while the customer side supports authentication, booking management. Built with Material-UI and Turbo for fast, scalable development.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Millenmark/booking-app-client.git
```

Go to the project directory

```bash
  cd booking-app-client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file for both admin and customer folder directory.

`NEXT_PUBLIC_API_URL=http://localhost:8000`

`NEXT_PUBLIC_API_KEY=local`

## Customer And Admin Flow Screenshots

![App Screenshot](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758360443/personal/booking-app/documentation/erd_q1qhd9.png)

## Tech Stack

- NextJS
- React
- TypeScript
- MUI
- Tanstack Query
