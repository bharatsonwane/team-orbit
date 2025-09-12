import { Routes, Route } from "react-router-dom"
import RouteGuardRenderer from "./utils/route/RouteGuardRenderer"
import { mainRouteList } from "./utils/route/routes"

function App() {
  return (
    <Routes>
      {mainRouteList.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RouteGuardRenderer
              key={route.path}
              authRoles={route.authRoles}
            >
              {route.element}
            </RouteGuardRenderer>
          }
        />
      ))}
    </Routes>
  )
}

export default App
