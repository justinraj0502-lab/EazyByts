import { useEffect, useState } from "react";
import {
  Save,
  User,
  Mail,
  MapPin,
  Image,
  FileText,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

function SettingsManager() {
  const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [settings, setSettings] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    location: "",
    github: "",
    linkedin: "",
    profileImage: "",
    resumeUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSettings({
          name: data.settings.name || "",
          title: data.settings.title || "",
          bio: data.settings.bio || "",
          email: data.settings.email || "",
          location: data.settings.location || "",
          github: data.settings.github || "",
          linkedin: data.settings.linkedin || "",
          profileImage: data.settings.profileImage || "",
          resumeUrl: data.settings.resumeUrl || "",
        });
      }
    } catch (error) {
      console.error(
        "Failed to fetch settings:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update settings"
        );
      }

      alert(
        "Settings updated successfully!"
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="projects-manager">
        <div className="empty-projects">
          Loading settings...
        </div>
      </section>
    );
  }

  return (
    <section className="projects-manager">

      <div className="manager-header">

        <div>

          <p className="dashboard-label">
            CONFIGURATION
          </p>

          <h2>Settings</h2>

          <p className="manager-description">
            Manage the information displayed
            across your portfolio.
          </p>

        </div>

      </div>

      <div className="project-form-card">

        <div className="form-card-header">

          <div>
            <h3>Portfolio Information</h3>

            <p>
              Update your profile and contact
              information.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="admin-form-grid">

            <div className="admin-field">

              <label>
                <User size={15} />
                Name
              </label>

              <input
                name="name"
                value={settings.name}
                onChange={handleChange}
                placeholder="Justin Raj R"
              />

            </div>

            <div className="admin-field">

              <label>
                <User size={15} />
                Professional Title
              </label>

              <input
                name="title"
                value={settings.title}
                onChange={handleChange}
                placeholder="Full Stack Developer"
              />

            </div>

          </div>

          <div className="admin-field">

            <label>Bio</label>

            <textarea
              name="bio"
              value={settings.bio}
              onChange={handleChange}
              placeholder="Write a short professional bio..."
              rows="5"
            />

          </div>

          <div className="admin-form-grid">

            <div className="admin-field">

              <label>
                <Mail size={15} />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

            </div>

            <div className="admin-field">

              <label>
                <MapPin size={15} />
                Location
              </label>

              <input
                name="location"
                value={settings.location}
                onChange={handleChange}
                placeholder="India"
              />

            </div>

          </div>

          <div className="admin-form-grid">

            <div className="admin-field">

              <label>
                <FaGithub size={15} />
                GitHub URL
              </label>

              <input
                name="github"
                value={settings.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />

            </div>

            <div className="admin-field">

              <label>
                <FaLinkedin size={15} />
                LinkedIn URL
              </label>

              <input
                name="linkedin"
                value={settings.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />

            </div>

          </div>

          <div className="admin-form-grid">

            <div className="admin-field">

              <label>
                <Image size={15} />
                Profile Image URL
              </label>

              <input
                name="profileImage"
                value={settings.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
              />

            </div>

            <div className="admin-field">

              <label>
                <FileText size={15} />
                Resume URL
              </label>

              <input
                name="resumeUrl"
                value={settings.resumeUrl}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
              />

            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="save-project-button"
              disabled={saving}
            >

              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Settings"}

            </button>

          </div>

        </form>

      </div>

    </section>
  );
}

export default SettingsManager;