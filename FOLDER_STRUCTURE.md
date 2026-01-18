# Folder Structure

The project is organized into two main parts: `backend` (Node.js/Express) and `frontend` (React).

```text
FINAL PROJECT/
├── backend/                # Express Server & API
│   ├── config/             # Database & other configurations
│   ├── controllers/        # Route handlers / Business logic
│   ├── middleware/         # Custom Express middleware (auth, error handled)
│   ├── models/             # Mongoose schemas (MongoDB)
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper functions & utilities
│   ├── .env                # Backend environment variables
│   ├── db.js               # Database connection logic
│   └── server.js           # Main entry point for the backend
├── frontend/               # React Application
│   ├── public/             # Static assets (index.html, icons)
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Individual page views
│   │   ├── services/       # API calling logic (axios instances)
│   │   ├── App.js          # Core app component
│   │   ├── index.js        # Frontend entry point
│   │   └── tailwind.css    # Global styling
│   ├── .env                # Frontend environment variables
│   ├── package.json        # Frontend dependencies & scripts
│   └── tailwind.config.js  # Tailwind CSS configuration
├── .gitignore              # Files to ignore in Git
├── package.json            # Root dependencies & workspace scripts
└── README.md               # Project documentation
```

### Key Directories

- **backend/models**: Defines the structure of the data in MongoDB.
- **backend/routes**: Maps URL paths to specific controller functions.
- **frontend/src/components**: Contains small, reusable elements like Buttons, Inputs, and Navigation.
- **frontend/src/pages**: Large components that represent a full page in the application.
- **frontend/src/services**: Encapsulates the communication with the backend API.
