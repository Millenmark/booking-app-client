# KB Barbershop (Booking Application)

A modern monorepo booking app with separate admin and customer interfaces. The admin dashboard includes analytics, data grids, and charts for bookings, revenue, and services, while the customer side supports authentication, booking management. Built with Material-UI and Turbo for fast, scalable development.

# Live Demo

**Customer Landing Page:**
[https://kbbarbershop.vercel.app](https://kbbarbershop.vercel.app)

**Admin Dashboard:** [https://admin-kbbarbershop.vercel.app](https://admin-kbbarbershop.vercel.app)

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

Start the app

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file for both admin and customer folder directory.

`NEXT_PUBLIC_API_URL=http://localhost:8000`

`NEXT_PUBLIC_API_KEY=local`

## Customer And Admin Flow Screenshots

**Customer**

This is the first thing that the customer will see
![Customer Screenshot 1](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466473/personal/booking-app/documentation/customer_flow_01_unmhve.png)

The customer can't make booking if he is not logged in yet so they will be redirected to login
![Customer Screenshot 2](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466474/personal/booking-app/documentation/customer_flow_02_v4hzsr.png)

Assume that the customer will type the correct credentials
![Customer Screenshot 3](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466475/personal/booking-app/documentation/customer_flow_03_ykndt0.png)

He can now make a booking and also a calendar icon will show that contains all the created booking of the customer
![Customer Screenshot 4](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466477/personal/booking-app/documentation/customer_flow_04_uo7g8j.png)

Now that the successful booking is created, the customer can see his created booking in the calendar icon by clicking it
![Customer Screenshot 5](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466478/personal/booking-app/documentation/customer_flow_05_qh8myy.png)

Beside the info of the created booking in the list, there is a cancel icon (the x mark)
![Customer Screenshot 6](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466479/personal/booking-app/documentation/customer_flow_06_nyyrka.png)

And also an edit icon for the customer to edit his booking details. An error will occur if he attempt to set the schedule time same to his existing booking on the same day.
![Customer Screenshot 7](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466480/personal/booking-app/documentation/customer_flow_07_nfwte0.png)

A new customer can create an account if he doesnt have an account yet
![Customer Screenshot 8](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466482/personal/booking-app/documentation/customer_flow_08_qkaarz.png)

Also, an existing customer can reset his password by providing his email in the forgot password page
![Customer Screenshot 9](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466483/personal/booking-app/documentation/customer_flow_09_ts3ety.png)

And a link will be sent to his provided email address
![Customer Screenshot 10](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466485/personal/booking-app/documentation/customer_flow_10_znixqj.png)

here, he can now set a new password for his account
![Customer Screenshot 11](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466486/personal/booking-app/documentation/customer_flow_11_fspvob.png)

**Admin**
This is the sign in page for the admin/staff
![Admin Screenshot 1](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466472/personal/booking-app/documentation/admin_flow_01_qwwuqi.png)

Once logged in, the staff will see the 4 overview cards that has filters,
charts that shows the specific data for the current month and a booking status log table
![Admin Screenshot 2](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466472/personal/booking-app/documentation/admin_flow_02_lcnxrq.png)

When the staff scrolled down, he can see the booking table. He can edit its status and it will be automatically recorded in the booking status log table.
![Admin Screenshot 2](https://res.cloudinary.com/dcrkja9f8/image/upload/v1758466473/personal/booking-app/documentation/admin_flow_03_mpjk1h.png)

## Tech Stack

- NextJS
- React
- TypeScript
- MUI
- Tanstack Query
