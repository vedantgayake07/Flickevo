import Header from "./header"
import Footer from "./footer"
import {Outlet} from 'react-router-dom';

const AppLayout = ()=>
{
    return (<>
    <Header/>
    <Outlet/>
    <Footer/>
    </>)
}

export default AppLayout;