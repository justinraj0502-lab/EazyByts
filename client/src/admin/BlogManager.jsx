import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
  FileText,
} from "lucide-react";

function BlogManager() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Technology",
    featured: false,
    published: true,
  });

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "Technology",
      featured: false,
      published: true,
    });

    setShowForm(true);
  };

  const openEditForm = (blog) => {
    setEditingId(blog._id);

    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category || "Technology",
      featured: blog.featured || false,
      published: blog.published !== false,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    try {
      const url = editingId
        ? `${API_URL}/api/blog/${editingId}`
        : `${API_URL}/api/blog`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editingId
          ? "Blog post updated successfully!"
          : "Blog post added successfully!"
      );

      setShowForm(false);
      setEditingId(null);

      fetchBlogs();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${API_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog post");
      }

      fetchBlogs();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="projects-manager">

      <div className="manager-header">
        <div>
          <p className="dashboard-label">CONTENT MANAGEMENT</p>

          <h2>Blog Posts</h2>

          <p className="manager-description">
            Create and manage the articles displayed on your portfolio.
          </p>
        </div>

        <button
          className="add-project-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Blog Post
        </button>
      </div>

      {showForm && (
        <div className="project-form-card">

          <div className="form-card-header">

            <div>
              <h3>
                {editingId ? "Edit Blog Post" : "Add New Blog Post"}
              </h3>

              <p>
                Enter the blog information below.
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

            <div className="admin-field">
              <label>Title</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Getting Started with React"
                required
              />
            </div>

            <div className="admin-field">
              <label>Excerpt</label>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="A short description of the blog post..."
                rows="3"
                required
              />
            </div>

            <div className="admin-field">
              <label>Content</label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows="8"
                required
              />
            </div>

            <div className="admin-field">
              <label>Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Technology"
              />
            </div>

            <label className="featured-check">

              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <Star size={17} />

              Featured post

            </label>

            <label className="featured-check">

              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
              />

              <FileText size={17} />

              Published

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
                {editingId
                  ? "Update Post"
                  : "Save Post"}
              </button>

            </div>

          </form>

        </div>
      )}

      {loading ? (
        <div className="empty-projects">
          Loading blog posts...
        </div>
      ) : blogs.length === 0 ? (

        <div className="empty-projects">

          <div className="empty-project-icon">
            <FileText size={25} />
          </div>

          <h3>No blog posts yet</h3>

          <p>
            Add your first article to start your blog.
          </p>

          <button
            className="add-project-button"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Your First Post
          </button>

        </div>

      ) : (

        <div className="admin-project-list">

          {blogs.map((blog) => (

            <article
              className="admin-project-card"
              key={blog._id}
            >

              <div className="admin-project-content">

                <div className="admin-project-top">

                  <div>

                    {blog.featured && (
                      <span className="featured-badge">
                        <Star size={12} />
                        Featured
                      </span>
                    )}

                    <h3>{blog.title}</h3>

                  </div>

                  <span className="project-date">
                    {new Date(
                      blog.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                <p>{blog.excerpt}</p>

                <div className="admin-tech-list">

                  <span>{blog.category}</span>

                  <span>
                    {blog.published
                      ? "Published"
                      : "Draft"}
                  </span>

                </div>

              </div>

              <div className="admin-project-actions">

                <button
                  onClick={() =>
                    openEditForm(blog)
                  }
                  title="Edit blog post"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(blog._id)
                  }
                  title="Delete blog post"
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

export default BlogManager;