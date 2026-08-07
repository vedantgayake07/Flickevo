import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import ScrollToTop from "../components/scrollToTop";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;