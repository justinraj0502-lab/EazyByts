import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import ProjectsManager from "./ProjectsManager";
import BlogManager from "./BlogManager";
import MessagesManager from "./MessagesManager";
import SettingsManager from "./SettingsManager";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("overview");
  const [projectCount, setProjectCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetch(`${API_URL}/api/messages`, {
    headers: {
    Authorization: `Bearer ${token}`,
    },
    })
    .then((response) => response.json())
    .then((data) => {
    if (data.success) {
      setMessageCount(
        data.messages.length
      );
    }
    })
    .catch((error) => {
    console.error(
      "Failed to fetch message count:",
      error
    );
    });

    fetch(`${API_URL}/api/projects`)
    .then((response) => response.json())
    .then((data) => {
    if (data.success) {
       setProjectCount(data.projects.length);
    }
    })
    .catch((error) => {
       console.error("Failed to fetch project count:", error);
    });

    fetch(`${API_URL}/api/blog`)
    .then((response) => response.json())
    .then((data) => {
    if (data.success) {
      setBlogCount(data.blogs.length);
    }
    })
    .catch((error) => {
      console.error("Failed to fetch blog count:", error);
    });
    }, [navigate]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="dashboard-logo">
          <div className="logo-mark">P</div>
          <span>Portfolio CMS</span>
        </div>

        <nav>

        <a
          className={activePage === "overview" ? "active" : ""}
          onClick={() => setActivePage("overview")}
          >
          <LayoutDashboard size={19} />
          Overview
        </a>

        <a
          className={activePage === "projects" ? "active" : ""}
          onClick={() => setActivePage("projects")}
        >
          <FolderKanban size={19} />
           Projects
        </a>

          <a
            className={activePage === "blog" ? "active" : ""}
            onClick={() => setActivePage("blog")}
          >
            <FileText size={19} />
        Blog
          </a>

          <a
  className={
    activePage === "messages"
      ? "active"
      : ""
  }
  onClick={() =>
    setActivePage("messages")
  }
>
  <MessageSquare size={19} />
  Messages
</a>

          <a
  className={
    activePage === "settings"
      ? "active"
      : ""
  }
  onClick={() =>
    setActivePage("settings")
  }
>
  <Settings size={19} />
  Settings
</a>

        </nav>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <p className="dashboard-label">
              ADMIN PANEL
            </p>

            <h1>
              Dashboard
            </h1>
          </div>

          <div className="admin-profile">

            <div className="profile-avatar">
              {user?.name?.charAt(0) || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Admin"}
              </strong>

              <span>
                {user?.email || ""}
              </span>
            </div>

          </div>

        </header>

        {activePage === "overview" && (
        <>
            <section className="dashboard-grid">

                <div className="dashboard-card">
            <FolderKanban size={24} />
            <span>Projects</span>
            <strong>{projectCount}</strong>
                </div>

                <div className="dashboard-card">
            <FileText size={24} />
            <span>Blog Posts</span>
            <strong>{blogCount}</strong>
                </div>

                <div className="dashboard-card">
            <MessageSquare size={24} />
            <span>Messages</span>
            <strong>{messageCount}</strong>
                </div>

                <div className="dashboard-card">
            <LayoutDashboard size={24} />
            <span>Status</span>
            <strong>Online</strong>
                </div>

            </section>

            <section className="welcome-card">

          <div>
            <p>Portfolio CMS</p>

            <h2>
              Welcome to your dashboard 👋
            </h2>

            <span>
              Manage your projects, blog posts and portfolio
              content from one place.
            </span>
          </div>

            </section>

        </>
        )}

        {activePage === "projects" && (
            <ProjectsManager />
        )}

        {activePage === "blog" && (
            <BlogManager />
        )}

        {activePage === "messages" && (
            <MessagesManager />
        )}

        {activePage === "settings" && (
            <SettingsManager />
        )}

        
      </main>

    </div>
  );
}

export default AdminDashboard;