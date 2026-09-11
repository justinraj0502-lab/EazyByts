import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Menu,
  X,
  Code2,
  Database,
  Server,
  Smartphone
} from "lucide-react";

import { FaGithub,FaLinkedin } from "react-icons/fa";

import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PortfolioHome() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`);
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs.filter((blog) => blog.published));
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
    }
  };

  fetchSettings();
  fetchProjects();
  fetchBlogs();
}, []);

  const skills = [
    {
      icon: <Code2 />,
      title: "Frontend",
      skills: "HTML, CSS, JavaScript, React, Bootstrap"
    },
    {
      icon: <Server />,
      title: "Backend",
      skills: "Node.js, Express.js, REST APIs"
    },
    {
      icon: <Database />,
      title: "Database",
      skills: "MongoDB, SQL"
    },
    {
      icon: <Smartphone />,
      title: "Other",
      skills: "Git, GitHub, Responsive Design"
    }
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const response = await fetch(
      `${API_URL}/api/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const text = await response.text();

    console.log("Response status:", response.status);
    console.log("Response body:", text);

    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      throw new Error(
        `Server returned invalid response: ${text || "Empty response"}`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to send message"
      );
    }

    alert("Thank you! Your message has been sent successfully.");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  } catch (error) {
    console.error("Contact form error:", error);

    alert(
      error.message ||
      "Something went wrong. Please try again."
    );
  }
}

const technologyCount = [
  ...new Set(
    projects.flatMap((project) => project.technologies || [])
  ),
].length;

  return (
    <div className="website">

      {/* NAVBAR */}

      <header className="navbar">

        <a href="#home" className="logo">
          <span></span>
          {settings?.name || "JUSTIN RAJ R"}
        </a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <a href="#skills" onClick={() => setMenuOpen(false)}>
            Skills
          </a>

          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work
          </a>

          <a href="#blog" onClick={() => setMenuOpen(false)}>
            Blog
          </a>

          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>

          <a href="/admin/login" className="cms-button">
            CMS Login
          </a>

        </nav>

      </header>


      {/* HERO */}

      <section id="home" className="hero">

        <div className="hero-content">

          <div className="availability">
            <span></span>
            Available for opportunities
          </div>

          <h1>
            Building digital products
            <br />
            that <span>feel effortless.</span>
          </h1>

          <p>
  {settings?.bio ||
    "I'm an Electronics and Communication Engineering student passionate about full-stack development, software engineering and building useful real-world applications."}
</p>

          <div className="hero-buttons">

  <a href="#work" className="primary-button">
    Explore my work
    <ArrowUpRight size={17} />
  </a>

  <a href="#contact" className="secondary-button">
    Let's talk
    <Mail size={17} />
  </a>

  {settings?.resumeUrl && (
    <a
      href={settings.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="secondary-button"
    >
      View Resume
      <ArrowUpRight size={17} />
    </a>
  )}

</div>

          <div className="hero-info">

            <span>
              <MapPin size={15} />
              {settings?.location || "India"}
            </span>

            <span>
              React · Node · MongoDB
            </span>

          </div>

        </div>


        <div className="hero-visual">

          <div className="gradient-circle"></div>

          <div className="profile-card">

            <div className="avatar">
  {settings?.profileImage ? (
    <img
      src={settings.profileImage}
      alt={settings?.name || "Profile"}
    />
  ) : (
    "J"
  )}
</div>

            <div>
              <strong>{settings?.name || "JUSTIN RAJ R"}</strong>
              <small>{settings?.title || "Full Stack Developer"}</small>
            </div>

            <b>01</b>

          </div>


          <div className="code-card">

            <div className="code-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <code>
              <span>const</span> developer = <span>"YOU"</span>;
              <br />
              developer.<b>build</b>("impact");
              <br />
              developer.<b>learn</b>("everyday");
            </code>

          </div>

        </div>

      </section>


      {/* ABOUT */}

      <section id="about" className="section">

        <div className="section-heading">

          <span>01 — ABOUT</span>

          <h2>
            A developer who cares
            about the details.
          </h2>

          <p>
  {settings?.bio ||
    "I enjoy turning ideas into clean, responsive and functional applications. My goal is to continuously improve my programming and problem-solving skills while building real-world projects."}
</p>

        </div>


        <div className="stats">

          <div className="stat">
            <strong>{projects.length.toString().padStart(2, "0")}+</strong>
            <span>Projects built</span>
          </div>

          <div className="stat">
            <strong>{technologyCount.toString().padStart(2, "0")}+</strong>
            <span>Technologies</span>
          </div>

          <div className="stat">
            <strong>100%</strong>
            <span>Learning mindset</span>
          </div>

        </div>

      </section>


      {/* SKILLS */}

      <section id="skills" className="section">

        <div className="section-heading">

          <span>02 — SKILLS</span>

          <h2>
            Tools I use to build
            digital experiences.
          </h2>

        </div>

        <div className="skills-grid">

          {skills.map((skill) => (

            <div className="skill-card" key={skill.title}>

              <div className="skill-icon">
                {skill.icon}
              </div>

              <h3>{skill.title}</h3>

              <p>{skill.skills}</p>

            </div>

          ))}

        </div>

      </section>


      {/* PROJECTS */}

      <section id="work" className="section">

        <div className="section-heading">

          <span>03 — SELECTED WORK</span>

          <h2>
            Projects that solve
            real problems.
          </h2>

        </div>


        <div className="projects">

          {projects.map((project, index) => (

  <article className="project-card" key={project._id}>

    <div className="project-top">

      <span>
        {String(index + 1).padStart(2, "0")}
      </span>

      <span>
        {project.featured ? "FEATURED" : "PROJECT"}
      </span>

    </div>

    <h3>{project.title}</h3>

    <p>{project.description}</p>

    <div className="technologies">

      {project.technologies?.map((tech) => (
        <span key={tech}>
          {tech}
        </span>
      ))}

    </div>

    <div className="project-links">

      {project.liveDemo && (
        <a
          href={project.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Live
          <ArrowUpRight size={15} />
        </a>
      )}

      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          Code
          <FaGithub size={15} />
        </a>
      )}

    </div>

  </article>

))}

        </div>

      </section>


{/* BLOG */}

<section id="blog" className="section">

  <div className="section-heading">

    <span>04 — JOURNAL</span>

    <h2>
      Thoughts, notes and
      lessons.
    </h2>

  </div>

  <div className="blog-grid">

    {blogs.map((blog) => (

      <article
        className="blog-card"
        key={blog._id}
      >

        <div className="blog-meta">

          <span>
            {blog.category}
          </span>

          <small>
            {new Date(
              blog.createdAt
            ).getFullYear()}
          </small>

        </div>

        <h3>
          {blog.title}
        </h3>

        <p>
          {blog.excerpt}
        </p>

        <a href="#contact">
          Read note
          <ArrowUpRight size={15} />
        </a>

      </article>

    ))}

  </div>

</section>


      {/* CONTACT */}

      <section id="contact" className="contact section">

        <div className="contact-intro">

          <span>05 — CONTACT</span>

          <h2>
            Have a project
            in mind?
          </h2>

          <p>
            I'm always interested in learning, building and
            working on meaningful projects.
          </p>

        </div>


        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <div className="form-row">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />

          </div>

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            rows="6"
            required
          />

          <button className="primary-button">
            Send enquiry
            <ArrowUpRight size={17} />
          </button>

        </form>

      </section>


      {/* FOOTER */}

      <footer>

        <div>

          <strong>{settings?.name || "JUSTIN RAJ R"}</strong>

          <p>
            Built with React · Node.js · MongoDB
          </p>

        </div>

        <div className="social-links">

          <a
  href={settings?.github || "#"}
  target="_blank"
  rel="noopener noreferrer"
>
  <FaGithub />
</a>

          <a
  href={settings?.linkedin || "https://www.linkedin.com/in/justin-raj-39217136b/"}
  target="_blank"
  rel="noopener noreferrer"
>
  <FaLinkedin />
</a>

          <a href={`mailto:${settings?.email || "justinraj0502@gmail.com"}`}>
  <Mail />
</a>

        </div>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;