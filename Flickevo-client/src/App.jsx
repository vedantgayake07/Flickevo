import { createBrowserRouter , RouterProvider } from "react-router-dom"
import AppLayout from "./layout/appLayout"
import Home from "./pages/Home"
import MoviesDetails from "./pages/MovieDetails"
import ShowDetails from "./pages/ShowDetails"
import WatchList from './pages/watchList'
import ContentPage from "./pages/ContentPage"



const Router = createBrowserRouter ([
  {
    path : '/',
    element : <AppLayout/>,
    children : [
      {
        path : '/' ,
        element : <Home/>,
      },
      {
        path : '/movies' ,
        element : <MoviesDetails/>,
      },

      {
        path : '/content/:id/:type',
        element : <ContentPage/>
      },

      {
        path : '/shows',
        element : <ShowDetails/>
      },

      {
        path : '/watchlist',
        element : <WatchList/>
      }
    ]
  }
])

const App = ()=>
{
  
  return <RouterProvider router={Router}></RouterProvider>
}

export default App;