import { createBrowserRouter , RouterProvider } from "react-router-dom"

import AppLayout from "./layout/appLayout"
import Home from "./pages/home"
import MoviesDetails from "./pages/movieDetails"
import ShowDetails from "./pages/showDetails"



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
        path : '/movies/:id',
        element : <MoviesDetails/>
      },

      {
        path : '/shows',
        element : <ShowDetails/>
      },
      
      {
        path : '/shows/:id',
        element : <ShowDetails/>
      }
    ]
  }
])

const App = ()=>
{
  
  return <RouterProvider router={Router}></RouterProvider>
}

export default App;