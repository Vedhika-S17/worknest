
### 📄 `README.md`:

```markdown
# WorkNest

WorkNest is an internal freelance and project tracking platform built using:

- Flask (Python backend)
- React (Vite frontend)
- MySQL database
- JWT-based authentication
- Role-based access control (freelancer, admin)

---

## Project Structure

```

WorkNest/
├── backend/        # Flask backend: routes, models, schemas, migrations
├── frontend/       # React frontend: pages, components, API services
├── .gitignore
└── README.md

```

---

## Getting Started

### 1. Clone the repository

```

git clone [https://github.com/Vedhika-S17/worknest.git](https://github.com/Vedhika-S17/worknest.git)
cd worknest

```

### 2. Backend Setup (Flask)

```

cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Set up environment variables in .env

# Run migrations

flask db upgrade

# Start the server

flask run

```

### 3. Frontend Setup (React + Vite)

```

cd frontend
npm install
npm run dev

```

---

## Features

- User authentication using JWT (access and refresh tokens)
- Signup, login, logout flow
- Profile creation and viewing
- Role-based access control
- Protected API endpoints
- Clean Git history and folder structure

---

## Status

The basic auth and profile flow is functional. More modules like project assignment, task tracking, and admin dashboards are in development.

---

## Repository

GitHub: https://github.com/Vedhika-S17/worknest  
Default branch: `main`

---

## Author

Vedhika S.
```



