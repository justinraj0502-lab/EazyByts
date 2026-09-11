import { useEffect, useState } from "react";
import {
  Trash2,
  Mail,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";

function MessagesManager() {
  const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(
        "Failed to fetch messages:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/messages/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete message"
        );
      }

      fetchMessages();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="projects-manager">

      <div className="manager-header">

        <div>

          <p className="dashboard-label">
            INBOX
          </p>

          <h2>Messages</h2>

          <p className="manager-description">
            Messages received through your portfolio
            contact form.
          </p>

        </div>

      </div>

      {loading ? (

        <div className="empty-projects">
          Loading messages...
        </div>

      ) : messages.length === 0 ? (

        <div className="empty-projects">

          <div className="empty-project-icon">
            <MessageSquare size={25} />
          </div>

          <h3>No messages yet</h3>

          <p>
            Messages from your contact form will
            appear here.
          </p>

        </div>

      ) : (

        <div className="admin-project-list">

          {messages.map((item) => (

            <article
              className="admin-project-card"
              key={item._id}
            >

              <div className="admin-project-content">

                <div className="admin-project-top">

                  <div>

                    <h3>
                      {item.subject ||
                        "New enquiry"}
                    </h3>

                  </div>

                  <span className="project-date">
                    <Calendar size={13} />

                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                <p>
                  {item.message}
                </p>

                <div className="admin-tech-list">

                  <span>
                    <User size={13} />
                    {item.name}
                  </span>

                  <span>
                    <Mail size={13} />
                    {item.email}
                  </span>

                </div>

              </div>

              <div className="admin-project-actions">

                <button
                  onClick={() =>
                    handleDelete(item._id)
                  }
                  title="Delete message"
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

export default MessagesManager;