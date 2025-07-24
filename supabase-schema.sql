-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boards table
CREATE TABLE public.boards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lists table
CREATE TABLE public.lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMP WITH TIME ZONE,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'todo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_boards_user_id ON public.boards(user_id);
CREATE INDEX idx_lists_board_id ON public.lists(board_id);
CREATE INDEX idx_tasks_list_id ON public.tasks(list_id);
CREATE INDEX idx_lists_position ON public.lists(board_id, position);
CREATE INDEX idx_tasks_position ON public.tasks(list_id, position);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Boards policies
CREATE POLICY "Users can view own boards" ON public.boards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boards" ON public.boards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards" ON public.boards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards" ON public.boards
    FOR DELETE USING (auth.uid() = user_id);

-- Lists policies
CREATE POLICY "Users can view lists of own boards" ON public.lists
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create lists in own boards" ON public.lists
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update lists in own boards" ON public.lists
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete lists in own boards" ON public.lists
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.boards 
            WHERE boards.id = lists.board_id 
            AND boards.user_id = auth.uid()
        )
    );

-- Tasks policies
CREATE POLICY "Users can view tasks in own boards" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create tasks in own boards" ON public.tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks in own boards" ON public.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks in own boards" ON public.tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.lists 
            JOIN public.boards ON boards.id = lists.board_id
            WHERE lists.id = tasks.list_id 
            AND boards.user_id = auth.uid()
        )
    );

-- Functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_boards
    BEFORE UPDATE ON public.boards
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_lists
    BEFORE UPDATE ON public.lists
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_tasks
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data for development
-- (This will be executed after user signs up)

-- Sample board creation function
CREATE OR REPLACE FUNCTION public.create_sample_board(user_id UUID)
RETURNS UUID AS $$
DECLARE
    board_id UUID;
    todo_list_id UUID;
    in_progress_list_id UUID;
    done_list_id UUID;
BEGIN
    -- Create sample board
    INSERT INTO public.boards (title, description, user_id)
    VALUES ('Welcome Board', 'Your first task management board', user_id)
    RETURNING id INTO board_id;
    
    -- Create default lists
    INSERT INTO public.lists (title, board_id, position)
    VALUES ('To Do', board_id, 0)
    RETURNING id INTO todo_list_id;
    
    INSERT INTO public.lists (title, board_id, position)
    VALUES ('In Progress', board_id, 1)
    RETURNING id INTO in_progress_list_id;
    
    INSERT INTO public.lists (title, board_id, position)
    VALUES ('Done', board_id, 2)
    RETURNING id INTO done_list_id;
    
    -- Create sample tasks
    INSERT INTO public.tasks (title, description, list_id, position, priority)
    VALUES 
        ('Welcome to TaskBoard!', 'This is your first task. Click to edit or drag to move.', todo_list_id, 0, 'high'),
        ('Create your first project', 'Start organizing your work with boards and lists.', todo_list_id, 1, 'medium'),
        ('Explore features', 'Try drag & drop, adding due dates, and setting priorities.', in_progress_list_id, 0, 'low'),
        ('Getting started', 'You''ve successfully set up TaskBoard!', done_list_id, 0, 'medium');
    
    RETURN board_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 