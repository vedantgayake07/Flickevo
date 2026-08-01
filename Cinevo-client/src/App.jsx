import { createBrowserRouter , RouterProvider } from "react-router-dom"

import AppLayout from "./layout/appLayout"
import Home from "./pages/home"
import MoviesDetails from "./pages/movieDetails"



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
      }
    ]
  }
])

const App = ()=>
{
  
  return <RouterProvider router={Router}></RouterProvider>
}

export default App;