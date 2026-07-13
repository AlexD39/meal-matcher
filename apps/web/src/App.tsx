import {
  Navigate,
  Route,
  Routes,
} from 'react-router'

import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { RecipesPage } from './pages/RecipesPage'
import { ScannerPage } from './pages/ScannerPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route
          path="escanear"
          element={<ScannerPage />}
        />

        <Route
          path="recetas"
          element={<RecipesPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  )
}

export default App