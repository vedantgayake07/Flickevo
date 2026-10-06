import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import ScrollToTop from "../components/scrollToTop";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;