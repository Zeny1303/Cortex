import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Book Interview", path: "/select-type" },
    { name: "Reports", path: "/reports" },
    { name: "Leaderboard", path: "/leaderboard" }
  ];

  return (
    <div className="w-64 h-screen bg-[#0B0F19] border-r border-white/10 p-5">

      <h1 className="text-xl font-bold text-white mb-8">AI Interview</h1>

      <div className="space-y-2">
        {links.map((link) => (
          <NavLink key={link.name} to={link.path}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`px-4 py-2 rounded-xl cursor-pointer transition
                  ${isActive
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                    : "text-gray-400 hover:bg-white/5"}
                `}
              >
                {link.name}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;