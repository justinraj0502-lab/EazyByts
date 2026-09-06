import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Star,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    github: "",
    liveDemo: "",
    featured: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Open Add form
  const openAddForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      image: "",
      technologies: "",
      github: "",
      liveDemo: "",
      featured: false,
    });

    setShowForm(true);
  };

  // Open Edit form
  const openEditForm = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title,
      description: project.description,
      image: project.image || "",
      technologies: project.technologies.join(", "),
      github: project.github || "",
      liveDemo: project.liveDemo || "",
      featured: project.featured || false,
    });

    setShowForm(true);
  };

  // Save project
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    const projectData = {
      title: form.title,
      description: form.description,
      image: form.image,
      technologies: form.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      github: form.github,
      liveDemo: form.liveDemo,
      featured: form.featured,
    };

    try {
      const url = editingId
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editingId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      setShowForm(false);
      setEditingId(null);

      fetchProjects();
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      fetchProjects();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="projects-manager">

      {/* HEADER */}

      <div className="manager-header">

        <div>
          <p className="dashboard-label">
            CONTENT MANAGEMENT
          </p>

          <h2>Projects</h2>

          <p className="manager-description">
            Create and manage the projects displayed on your portfolio.
          </p>
        </div>

        <button
          className="add-project-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Project
        </button>

      </div>

      {/* FORM */}

      {showForm && (
        <div className="project-form-card">

          <div className="form-card-header">

            <div>
              <h3>
                {editingId ? "Edit Project" : "Add New Project"}
              </h3>

              <p>
                Enter the project information below.
              </p>
            </div>

            <button
              className="close-form"
              onClick={() => setShowForm(false)}
            >
              <X size={19} />
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="admin-form-grid">

              <div className="admin-field">
                <label>Project Title</label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter the Project Name"
                  required
                />
              </div>

              <div className="admin-field">
                <label>Image URL</label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

            </div>

            <div className="admin-field">

              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what this project does..."
                rows="5"
                required
              />

            </div>

            <div className="admin-field">

              <label>Technologies</label>

              <input
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />

              <small>
                Separate technologies with commas.
              </small>

            </div>

            <div className="admin-form-grid">

              <div className="admin-field">

                <label>GitHub URL</label>

                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />

              </div>

              <div className="admin-field">

                <label>Live Demo URL</label>

                <input
                  name="liveDemo"
                  value={form.liveDemo}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>

            </div>

            <label className="featured-check">

              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <Star size={17} />

              Featured project

            </label>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-project-button"
              >
                {editingId ? "Update Project" : "Save Project"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* PROJECT LIST */}

      {loading ? (
        <div className="empty-projects">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-projects">

          <FolderKanbanPlaceholder />

          <h3>No projects yet</h3>

          <p>
            Add your first project to start building your portfolio.
          </p>

          <button
            className="add-project-button"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Your First Project
          </button>

        </div>
      ) : (
        <div className="admin-project-list">

          {projects.map((project) => (

            <article
              className="admin-project-card"
              key={project._id}
            >

              <div className="admin-project-content">

                <div className="admin-project-top">

                  <div>

                    {project.featured && (
                      <span className="featured-badge">
                        <Star size={12} />
                        Featured
                      </span>
                    )}

                    <h3>{project.title}</h3>

                  </div>

                  <span className="project-date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>

                </div>

                <p>
                  {project.description}
                </p>

                <div className="admin-tech-list">

                  {project.technologies.map((tech) => (
                    <span key={tech}>
                      {tech}
                    </span>
                  ))}

                </div>

                <div className="admin-project-links">

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub size={15} />
                      Code
                    </a>
                  )}

                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={15} />
                      Live Demo
                    </a>
                  )}

                </div>

              </div>

              <div className="admin-project-actions">

                <button
                  onClick={() => openEditForm(project)}
                  title="Edit project"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() => handleDelete(project._id)}
                  title="Delete project"
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </article>

          ))}

        </div>
      )}

    </section>
  );
}

function FolderKanbanPlaceholder() {
  return (
    <div className="empty-project-icon">
      <Plus size={25} />
    </div>
  );
}

export default ProjectsManager;