import { Routes, Route } from 'react-router-dom';
import { RouteGuardRenderer, mainRouteList} from './utils/route/RouteGuardRenderer';
import { roleKeys } from './utils/constants';
import { PageNotFound } from './components/PageNotFound';

function App() {
  return (
    <Routes>
      {mainRouteList.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RouteGuardRenderer key={route.path} authRoles={route.authRoles}>
              {route.element}
            </RouteGuardRenderer>
          }
        />
      ))}
      
      {/* Catch-all route for undefined routes - Page Not Found */}
      <Route
        path="*"
        element={
          <RouteGuardRenderer authRoles={[roleKeys.ANY]}>
            <PageNotFound />
          </RouteGuardRenderer>
        }
      />
    </Routes>
  );
}

export default App;
