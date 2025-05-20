# Simple POS API

This project is a part of my CSE341 coursework (Weeks 3–4) at BYU–Idaho. It implements a basic Point of Sale (POS) API using Node.js, Express, and MongoDB.

## 📦 Features

- RESTful API for managing **products** and **sales** collections in MongoDB.
- Built with the **MVC (Model-View-Controller)** architecture to enhance readability, maintainability, and scalability.
- Uses **Mongoose** for schema modeling and MongoDB interaction.
- Includes **ESLint** and **Prettier** for consistent code formatting and linting.
- Designed to be easily extendable for future features like authentication and reporting.

## 📌 Technologies Used

- **Node.js**
- **Express**
- **MongoDB** with **Mongoose**
- **ESLint** + **Prettier**
- **Swagger (jsdoc and ui-express)** for API documentation

## 🧪 Endpoints Overview

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

- `GET /sales`
- `GET /sales/:id`
- `POST /sales`

## ✅ Installation

```bash
git clone https://github.com/jamesphillipdeguzman/simple-pos-api.git
cd simple-pos-api
npm install
npm run server
