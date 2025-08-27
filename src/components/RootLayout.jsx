import { Outlet } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import { TodosProvider } from './TodoContext.jsx';

export default function RootLayout() {
  return (
    
    <AuthProvider>
      <TodosProvider>
        
        <Outlet />
      </TodosProvider>
    </AuthProvider>
  );
}

