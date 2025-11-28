# SyncForge Frontend

Modern React + Vite + TypeScript frontend for distributed task management.

## 📋 Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Root component
├── App.css               # Global styles
├── index.css             # Base styles
├── pages/
│   ├── ProjectsPage.tsx  # Projects list & creation
│   └── TasksPage.tsx     # Tasks management board
├── services/
│   └── api.ts            # API client and endpoints
├── types/
│   └── index.ts          # TypeScript interfaces
└── styles/
    ├── ProjectsPage.css  # Projects styling
    └── TasksPage.css     # Tasks styling
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

```bash
# Clone repository
git clone https://github.com/martins0023/syncforge-frontend.git
cd syncforge-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## 📊 Available Scripts

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run format     # Format code with Prettier
npm run type-check # Check TypeScript types
```

## 🏗️ Architecture

### Pages

#### ProjectsPage
- Display all projects in a responsive grid
- Create new projects with name, description, and team size
- Filter projects by status
- Delete projects
- Select project to view its tasks

#### TasksPage
- Kanban board view with 4 columns (To Do, In Progress, Review, Done)
- Create tasks with title, description, priority, and assignee
- Drag tasks between statuses (via dropdown)
- Filter tasks by status
- Delete tasks
- Real-time status updates

### Services

#### api.ts
- Centralized API client using axios
- Task endpoints (CRUD operations)
- Project endpoints (CRUD operations)
- Error handling and response typing

### Styling

- CSS Grid for responsive layouts
- Flexbox for component arrangements
- CSS animations for smooth transitions
- Mobile-first responsive design
- Color-coded status and priority indicators

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Environment Variables
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Design System

### Colors
- Primary: #667eea (Purple)
- Success: #28a745 (Green)
- Warning: #ffc107 (Yellow)
- Error: #ff6b6b (Red)
- Neutral: #f5f5f5 (Light Gray)

### Components
- **Buttons**: Primary, Secondary, Danger variants
- **Cards**: Project cards with status badges
- **Forms**: Fully validated input forms
- **States**: Loading spinners, empty states, error alerts

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly button sizes
- Scrollable task columns on mobile

## 🔄 Collaboration Workflow

### Branching Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - Features
- `bugfix/*` - Bug fixes

### Pull Request Checklist
- [ ] Code follows ESLint rules
- [ ] Component is responsive
- [ ] No console errors
- [ ] Accessibility considered
- [ ] Screenshots provided

## 🧪 Component Development

When creating components:
1. Use functional components with hooks
2. Define TypeScript interfaces for props
3. Keep components focused and reusable
4. Style with scoped CSS or CSS modules
5. Handle loading and error states
6. Add proper accessibility attributes

## 🐛 Common Issues

### API Connection Failed
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS is enabled on backend

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages
Configure in `vite.config.ts` and use GitHub Actions.

## 📚 Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CSS3** - Styling

## 🤝 Contributing

See contributing guidelines in the repository

## 📄 License

MIT License