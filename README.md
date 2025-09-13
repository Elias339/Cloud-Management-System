# Cloud Server Management

I selected Track C (Full-stack) to showcase my proficiency in managing both backend API development and frontend user interface implementation in a cohesive manner. Undertaking the full-stack development allowed me to demonstrate the ability to design, integrate, and deliver a complete, functional application from end to end.

---

## Features

- **User Authentication** - Secure login with token-based sessions  
- **Server Management** - Full CRUD operations for cloud servers  
- **Advanced Filtering** - Filter by provider, status, CPU, RAM, and search  
- **Bulk Operations** - Select and delete multiple servers  
- **Responsive Design** - Works on desktop and mobile devices  
- **Real-time Validation** - Form validation with user feedback  
- **Optimistic Concurrency Control** - Versioning to prevent update conflicts  

---

## 🛠️ Tech Stack

### Frontend
- React 18 with Hooks  
- React Router for navigation  
- React Hook Form for form handling  
- Bootstrap 5 for UI components  
- React Toastify for notifications  
- Axios for API communication  

### Backend
- Laravel 10 with Sanctum authentication  
- MySQL database  
- API Resource for consistent response formatting  
- Request validation with custom rules  
- Optimized database queries with indexing  

---

## 📋 Setup Instructions

### Prerequisites
- PHP 8.1 or higher  
- Composer  
- Node.js (v16 or higher)  
- MySQL 5.7 or higher  

### Backend Installation
```bash
cd backend
composer install
cp .env.example .env 
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend will be available at: http://localhost:5173

Default Login Credentials
Email: admin@gmail.com
Password: password


🔌 API Documentation
## Authentication Endpoints

# Login
URL: POST /api/login
Body:
{
  "email": "admin@gmail.com",
  "password": "password"
}

# Logout
URL: POST /api/logout
Headers: Authorization: Bearer {token}

## Server Endpoints

# List Servers
URL: GET /api/servers
Query Parameters: page, per_page, sort, order, q, provider, status, min_cpu, max_cpu

# Create Server
URL: POST /api/servers
Headers: Authorization: Bearer {token}
Body:
{
  "name": "Server Name",
  "ip_address": "192.168.1.1",
  "provider": "aws",
  "status": "active",
  "cpu_cores": 4,
  "ram_mb": 8192,
  "storage_gb": 100
}

# Get Server Details
URL: GET /api/servers/{id}
Headers: Authorization: Bearer {token}

# Update Server
URL: PUT /api/servers/{id}
Headers: Authorization: Bearer {token}
Body: Same as create plus optional version field for optimistic concurrency

# Delete Server
URL: DELETE /api/servers/{id}
Headers: Authorization: Bearer {token}

# Bulk Delete
URL: POST /api/servers/bulk-delete
Headers: Authorization: Bearer {token}
Body:
{
  "ids": [1, 2, 3]
}

## 📱 UI Overview
 Login Page: Clean authentication interface with form validation.
 Server List: 
         - Table view with pagination, sorting, and filtering
         - Bulk selection and deletion capabilities
         - Responsive design for mobile
         - Real-time search with debouncing
 Server Details: Comprehensive view of server specifications with visual hardware representation.
 Create/Edit Forms: Intuitive layout, validation, and optimistic concurrency control.

## 🤖 AI Collaboration Process

Initial Scaffolding: AI assisted with project structure and technology selection

Component Development: Built incrementally with AI guidance

API Design: RESTful principles with Laravel best practices

Code Review: AI suggested optimizations

Bug Resolution: AI helped diagnose and fix issues

Documentation: AI assisted in creating this comprehensive README

## 🐛 Debugging Journey

CORS Configuration: Fixed frontend API access by configuring Laravel CORS middleware

Authentication Token Management: Implemented sessionStorage with cross-tab synchronization

Optimistic Concurrency Control: Version mismatch errors fixed with backend checks

Bulk Delete Implementation: Used database transactions for atomic operations

Responsive Table Design: Horizontal scrolling and Bootstrap utilities to fix overflow

## ⚖️ Tech Decisions & Trade-offs

Laravel Sanctum - Lightweight token-based auth, trade-off: fewer features than Passport

React Hook Form - Less re-rendering, trade-off: additional dependency

Bootstrap UI - Rapid development, trade-off: less unique design

Client-side Filtering & Pagination - Faster UX, trade-off: limited to loaded data

Optimistic Concurrency Control - Prevents accidental overwrite, trade-off: adds complexity

## ⏱️ Time Spent
| Task                          | Hours  |
| ----------------------------- | ------ |
| Project Setup & Configuration | 4      |
| Backend Development (Laravel) | 12     |
| Frontend Development (React)  | 14     |
| Testing & Debugging           | 6      |
| Documentation                 | 4      |
| **Total**                     | **40** |
