🧩 DevConnect Frontend

A modern full-stack web application frontend built with React + TypeScript + Vite, serving as the developer interface for the DevConnect Backend - https://github.com/IsamaDes/DevConnect-Be/
This project enables developers, admins, and users to authenticate, create and comment on projects, and manage their profiles. It uses HTTP-only cookies for secure authentication and integrates with a Node.js/Express backend connected to MongoDB Atlas.

🚀 Features

🔐 Authentication using cookies (HTTP-only secure cookies)

👤 User roles: Admin and Developer

🧱 CRUD operations for projects (create, view, comment)

💬 Real-time project comment updates

⚙️ User settings & profile management

🎨 Clean responsive UI with Tailwind CSS

🌐 Integration with deployed backend via environment variables

Tech Stacks
| Category | Technologies |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend Framework** | React (TypeScript) |
| **Build Tool** | Vite |
| **Routing** | React Router |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios |
| **State Handling** | React Hooks |
| **Auth** | Cookies (HTTP-only, `SameSite`, `Secure`) |
| **Backend** | [DevConnect Backend (Node.js + Express + MongoDB)](https://github.com/IsamaDes/DevConnect-Be/) |

src/
├── components/
│ └── Settings.tsx
├── pages/
│ ├── AdminProfile.tsx
│ ├── CreateProject.tsx
│ ├── DeveloperProfile.tsx
│ ├── Home.tsx
│ ├── Login.tsx
│ ├── NotFound.tsx
│ ├── ProjectDetails.tsx
│ └── Register.tsx
├── services/
│ ├── adminService.ts
│ └── authService.ts
├── types/
│ └── index.tsx
├── utils/
│ ├── AxiosInstance.ts
│ └── LogAxiosError.ts
└── App.tsx

⚙️ Environment Setup

Before running the app, create a .env file in the project root directory (not inside src/).
You can also create .env.local and .env.production for different environments.

Example .env
VITE_API_BASE_URL=http://localhost:5000/api

For production
VITE_API_BASE_URL=https://devconnect-be-9plu.onrender.com/api

⚠️ Important:

The backend uses cookies, so withCredentials must be set to true in Axios.

The backend must allow cross-origin credentials (CORS).

💾 Installation

Clone the repository

git clone https://github.com/IsamaDes/DevConnect-Fe.git
cd DevConnect-Fe

Install dependencies

npm install

Set environment variables
Create a .env file as shown above.

Run the development server

npm run dev

The app should now be running on:

http://localhost:5173

Build for production

npm run build

Preview production build

npm run preview

🔌 API Integration

All API requests are made through AxiosInstance.ts, which is configured with:

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL,
withCredentials: true,
headers: { "Content-Type": "application/json" },
});

This ensures:

Authentication tokens are passed via cookies.

Secure communication between frontend and backend.

🔐 Authentication Flow

Upon login, backend issues accessToken and refreshToken via HTTP-only cookies.

These tokens are automatically included in subsequent API calls.

Axios interceptors can be used to handle token refresh logic.

🧪 Development Notes

Error Logging: handled in utils/LogAxiosError.ts.

Backend Connectivity: hosted on Render – DevConnect Backend
.

CORS: backend configured for https://devconnect-fe origin with credentials enabled.

🧭 Available Pages
Route Component Description
/ Home.tsx Landing page
/login Login.tsx User login
/register Register.tsx Create new account
/developer-profile DeveloperProfile.tsx Developer dashboard
/create-project CreateProject.tsx Create a new project
/view-projects ProjectDetails.tsx View and comment on projects
/admin-profile AdminProfile.tsx Admin dashboard
/settings Settings.tsx User settings

- NotFound.tsx 404 handler
  🧱 Future Improvements

Add JWT refresh token rotation.

Implement pagination for projects and comments.

Add image uploads for projects.

Improve admin analytics dashboard.

Integrate WebSocket for live comment updates.

🧑‍💻 Author

Isama Desmond
Full-stack Developer
🔗 GitHub

🛠 License

This project is open-source and available under the MIT License.
