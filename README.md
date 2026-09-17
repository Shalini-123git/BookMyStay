# BookMyStay

BookMyStay is a full-stack property booking web app inspired by Airbnb. Users can browse stays, create listings, upload listing images, view listing locations on Mapbox, leave reviews, book available dates, and complete booking payments through Razorpay.

Live Demo: https://full-stack-property-booking-platform.onrender.com

## Features

- Property listings with create, read, update, and delete support
- Cloudinary image uploads for listing photos
- User signup, login, logout, and protected routes with Passport.js
- Owner-only listing edit and delete actions
- Reviews and star ratings for listings
- Mapbox location maps using saved listing coordinates
- Booking flow with check-in, check-out, guests, special requests, and amount calculation
- Booking conflict checks to prevent overlapping active bookings
- User booking dashboard with booking/payment status and cancel action
- Razorpay checkout flow with order creation and payment verification
- Light/dark theme toggle with saved user preference
- Flash messages, server-side validation, and centralized error handling

## Tech Stack

Frontend:
- EJS and ejs-mate layouts
- Bootstrap 5
- CSS
- JavaScript
- Font Awesome
- Mapbox GL JS

Backend:
- Node.js
- Express.js
- MongoDB and Mongoose
- Passport.js with passport-local-mongoose
- Joi validation
- Multer and Cloudinary storage
- Razorpay Orders API

## Project Structure

```text
MAJORPROJECT/
|-- app.js
|-- cloudConfig.js
|-- middleware.js
|-- schema.js
|-- controller/
|   |-- listings.js
|   |-- reviews.js
|   |-- users.js
|-- models/
|   |-- booking.js
|   |-- listing.js
|   |-- payment.js
|   |-- review.js
|   |-- user.js
|-- routes/
|   |-- booking.js
|   |-- listing.js
|   |-- payment.js
|   |-- reviews.js
|   |-- users.js
|-- views/
|   |-- bookings/
|   |-- includes/
|   |-- layouts/
|   |-- listings/
|   |-- payments/
|   |-- users/
|-- public/
|   |-- css/
|   |-- js/
|-- init/
|   |-- data.js
|   |-- index.js
```

## Environment Variables

Create a `.env` file in the project root.

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_access_token
MONGO_URL=your_mongodb_connection_string
PORT=8080

RAZORPAY_API_KEY=your_razorpay_key_id
RAZORPAY_API_SECRET=your_razorpay_key_secret
```

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd MAJORPROJECT
npm install
npm start
```

Then open:

```text
http://localhost:8080
```

## Main Routes

- `GET /listings` - View all listings
- `GET /listings/new` - Create listing form
- `GET /listings/:id` - Listing details with map, reviews, and booking action
- `GET /bookListing/:id` - Booking form for a listing
- `GET /bookListing/dashboard` - Current user's booking dashboard
- `GET /payments/:bookingId/checkout` - Razorpay checkout page
- `GET /signup` - Signup page
- `GET /login` - Login page

## Booking And Payment Flow

1. A logged-in user opens a listing and clicks `Book Your Stay`.
2. The user selects check-in/check-out dates, guest count, and optional notes.
3. The server checks for overlapping active bookings.
4. A booking is saved with pending booking/payment status.
5. The user is redirected to checkout.
6. Razorpay creates an order and verifies the payment signature.
7. On successful payment, booking and payment status are updated to confirmed.

## Map Behavior

New listings are geocoded with Mapbox and store GeoJSON point coordinates in MongoDB. Listing detail pages pass those coordinates to `public/js/map.js`, which centers the map and marker on the listing location. Older listings without saved coordinates are geocoded when the listing page is viewed.

## Notes

- Booking, payment, listing creation, review creation, and dashboard routes require login where appropriate.
- Cloudinary credentials are required for image uploads.
- Mapbox token is required for listing maps.
- Razorpay credentials are required for live checkout order creation and payment verification.
