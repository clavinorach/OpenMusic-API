# OpenMusic API v3

This repository contains the final submission for the *Fundamental Back-End Application* class from Dicoding Indonesia. The project involves creating a RESTful API with comprehensive features, including database integration, message brokering, caching, and security enhancements.

## Features

### 1. RESTful API Development
- **Created a RESTful API** using the Hapi framework, integrating PostgreSQL for efficient database management.

### 2. Message Brokering
- **Utilized RabbitMQ** as a message broker to facilitate efficient communication and task handling.

### 3. Caching
- **Implemented server-side caching** with Redis to reduce database load and improve performance.

### 4. Cloud Integration
- **Deployed the application** on AWS Cloud to ensure scalable and reliable infrastructure.

### 5. Feature Development
- Developed an **export feature** for playlist songs.
- Added **image upload functionality** for album covers.
- Enabled users to **like albums**.

### 6. Maintenance
- **Maintained and ensured compatibility** of features from OpenMusic API versions 1 and 2.

### 7. Security
- **Integrated authentication and authorization** features to secure the API.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/openmusic-api-v3.git
   cd openmusic-api-v3

2. **Install Dependencies:**

   ```sh
   npm install

3. **Configure environment variables:**

   ```sh
   DB_HOST=your_db_host DB_USER=your_db_user DB_PASSWORD=your_db_password DB_NAME=your_db_name JWT_SECRET=your_jwt_secret REDIS_HOST=your_redis_host

4. **Run the migrations**

   ```sh
   npm run migrate up

5. **Start the development server:**

   ```sh
   npm run start:dev
