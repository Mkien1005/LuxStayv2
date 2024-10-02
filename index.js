import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'
// Cấu hình các dịch vụ upstream
const IDENTITY_SERVICE = 'https://identity-service-qboe.onrender.com'
const REVIEW_SERVICE = 'https://review-services.onrender.com'
const BOOKING_SERVICE = 'https://booking-service-kkos.onrender.com'
const HOTEL_SERVICE = 'https://hotel-service-ac92.onrender.com'
const ROOM_SERVICE = 'https://room-service-e42h.onrender.com'

const app = express()
app.use(cors())

// Proxy cho dịch vụ Identity
app.use(
  '/identity',
  createProxyMiddleware({
    target: IDENTITY_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/identity',
    },
  })
)

// Proxy cho dịch vụ Reviews
app.use(
  '/api/reviews',
  createProxyMiddleware({
    target: REVIEW_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/reviews',
    },
  })
)

// Proxy cho dịch vụ Bookings
app.use('/api/bookings', (url) => {
  createProxyMiddleware({
    target: BOOKING_SERVICE + `${url}`,
    changeOrigin: true,
  })
})

// Proxy cho dịch vụ Hotels
app.use(
  '/api/hotels',
  createProxyMiddleware({
    target: HOTEL_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/hotels',
    },
  })
)

// Proxy cho dịch vụ Rooms
app.use(
  '/api/rooms',
  createProxyMiddleware({
    target: ROOM_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/rooms',
    },
  })
)

// Khởi chạy server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API Gateway đang chạy trên http://localhost:${PORT}`)
})
