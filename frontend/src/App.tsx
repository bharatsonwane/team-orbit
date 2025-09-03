
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

type Route = {
  path: string;
  element: React.ReactNode;
  authRequired: boolean;
  roles?: string[];
};

const publicRouteList: Route[] = [
  {
    path: "/login",
    element: <Login />,
    authRequired: false,
  },
  {
    path: "/register",
    element: <Register />,
    authRequired: false,
  },
];



const RenderRoutes = ({
  children,
  authRequired = false,
  roles = [],
}: {
  children: React.ReactNode;
  authRequired?: boolean;
  roles?: string[];
}) => {
  const { isAuthenticated, hasAnyRole } = useAuth();

  if (authRequired && !isAuthenticated) {
    return <Login />;
  }

  if (roles.length > 0 && !hasAnyRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};



const mainRouteList: Route[] = [
  {
    path: "/",
    element: <Navigate to="/app" replace />,
    authRequired: false,
  },
  {
    path: "/app/*",
    element: <Layout />,
    authRequired: true,
  },
  ...publicRouteList,
];

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {mainRouteList.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RenderRoutes 
                    key={route.path}
                    authRequired={route.authRequired}
                    roles={route.roles}
                  >
                    {route.element}
                  </RenderRoutes>
                }
              />
            ))}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
