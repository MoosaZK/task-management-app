# TaskBoard - Task Management App

A modern Kanban-style task management application built with Next.js, TypeScript, and Supabase.

## 🚀 Features

- **Project Organization**: Create boards for different projects
- **Task Management**: Create, edit, and track tasks with priorities and due dates
- **Drag & Drop**: Intuitive Kanban-style workflow
- **Real-time Updates**: Live collaboration with team members
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📦 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   │   ├── boards/      # Board management endpoints ✅
│   │   ├── lists/       # List management endpoints ✅
│   │   └── tasks/       # Task management endpoints ✅
│   ├── auth/            # Authentication pages ✅
│   │   ├── login/       # Login page ✅
│   │   └── signup/      # Signup page ✅
│   └── dashboard/       # Main application pages ✅
├── components/          # Reusable UI components ✅
│   └── ui/             # Base UI components (Button, Input) ✅
├── contexts/           # React contexts (AuthContext) ✅
├── lib/                # External service configurations ✅
├── types/              # TypeScript type definitions ✅
└── utils/              # Helper functions and constants ✅
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd task-management-app
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up the database**:
   - Follow the detailed guide in `SETUP.md`
   - Copy and run the SQL schema from `supabase-schema.sql`

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🗄️ Database Schema

The app uses the following main entities:

- **Users**: User authentication and profiles
- **Boards**: Project containers
- **Lists**: Task categories within boards (To Do, In Progress, Done)
- **Tasks**: Individual work items with priorities and due dates

## 🚧 Development Progress

### ✅ Completed Features
- [x] **Project Setup**: Next.js + TypeScript + Tailwind CSS
- [x] **Database Schema**: Complete PostgreSQL schema with RLS
- [x] **Authentication System**: Login, signup, protected routes
- [x] **API Routes**: Full CRUD operations for boards, lists, tasks
- [x] **UI Components**: Reusable Button and Input components
- [x] **Dashboard**: User dashboard with board overview
- [x] **Authentication Pages**: Login and signup forms
- [x] **Context Management**: Auth state management

### 🚀 Next Steps
- [ ] **Core Components**: Board, List, and Task card components
- [ ] **Board Management**: Create, edit, delete boards
- [ ] **Task Management**: Full task lifecycle management
- [ ] **Drag & Drop**: Implement @dnd-kit for task movement
- [ ] **Responsive Design**: Mobile optimization
- [ ] **Real-time Updates**: Live collaboration features

## 🔧 Available API Endpoints

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/[id]` - Get board with lists and tasks
- `PUT /api/boards/[id]` - Update board
- `DELETE /api/boards/[id]` - Delete board

### Lists
- `GET /api/lists?boardId=xxx` - Get lists for board
- `POST /api/lists` - Create new list

### Tasks
- `GET /api/tasks?listId=xxx` - Get tasks for list
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update/move task
- `DELETE /api/tasks/[id]` - Delete task

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all endpoints
- **CORS Protection**: Proper API security headers

## 📱 Current Status

**Phase 1-3 Complete!** ✅
- ✅ Project setup and architecture
- ✅ Database design and implementation
- ✅ Authentication system
- ✅ API layer complete
- ✅ Basic UI components

**Ready for Phase 4**: Building the main UI components and features!

## 🤝 Contributing

This is a learning project showcasing modern full-stack development with AI assistance.

---

Built with ❤️ using Next.js and Supabase
