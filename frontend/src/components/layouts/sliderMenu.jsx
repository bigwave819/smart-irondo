import { useNavigate } from "react-router";

const SidebarMenu = ({ activeMenu }) => {
  const navigate = useNavigate();

  const navigations = [
    { id: 1, label: "Dashboard", path: "/dashboard" },
    { id: 2, label: "Reports", path: "/reports" },
    { id: 3, label: "Evidence", path: "/evidences" },
  ];

  return (
    <aside className="w-72 min-h-screen sticky top-0 border-r border-gray-200 bg-white px-6 py-8">
      
      {/* NAVIGATION */}
      <nav className="space-y-2">
        {navigations.map((item) => {
          const isActive = activeMenu === item.label;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >              
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
