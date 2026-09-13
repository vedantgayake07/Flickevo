import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AppLayout from "./layout/appLayout"
import Home from "./pages/Home"
import MoviesDetails from "./pages/MovieDetails"
import ShowDetails from "./pages/ShowDetails"
import WatchList from "./pages/WatchList";
import ContentPage from "./pages/ContentPage"
import SearchResults from "./pages/SearchResults"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { AuthProvider } from "./context/AuthContext"
import GenreResults from "./pages/GenreResults"
import { WatchlistProvider } from "./context/WatchlistContext"

const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/movies', element: <MoviesDetails /> },
      { path: '/content/:id/:type', element: <ContentPage /> },
      { path: '/shows', element: <ShowDetails /> },
      { path: '/genre/:type/:id', element: <GenreResults /> },
      {
        path: '/watchlist', element: <ProtectedRoute>
          <WatchList />
        </ProtectedRoute>
      },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/search', element: <SearchResults /> },
    ]
  }
])

const App = () => {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <RouterProvider router={Router}></RouterProvider>
      </WatchlistProvider>
    </AuthProvider>
  )
}

export default App;