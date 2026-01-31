import Navbar from "./Navbar";
import SidebarMenu from "./sliderMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      
      {/* FIXED NAVBAR */}
      <Navbar activeMenu={activeMenu} />

      {/* OFFSET CONTENT BELOW NAVBAR */}
      <div className="pt-[72px] h-full">
        <div className="flex h-[calc(100vh-72px)]">
          
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block w-72 bg-white border-r shrink-0">
            <SidebarMenu activeMenu={activeMenu} />
          </aside>

          {/* MAIN CONTENT (SCROLLS) */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
