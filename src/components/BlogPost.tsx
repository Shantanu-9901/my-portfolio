import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import blogs from "../data/blogs";
import "./styles/BlogPost.css";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="blogpost-section">
        <div className="blogpost-container">
          <button className="blogpost-back" onClick={() => navigate("/")} data-cursor="disable">
            <MdArrowBack /> Back
          </button>
          <h1>Post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="blogpost-section">
      <div className="blogpost-container">
        <button className="blogpost-back" onClick={() => navigate("/#blog")} data-cursor="disable">
          <MdArrowBack /> Back
        </button>

        <div className="blogpost-meta">
          <span className="blogpost-date">{blog.date}</span>
          <span className="blogpost-dot">·</span>
          <span className="blogpost-readtime">{blog.readTime}</span>
        </div>

        <h1 className="blogpost-title">{blog.title}</h1>

        <div className="blogpost-tags">
          {blog.tags.map((tag, i) => (
            <span key={i} className="blogpost-tag">{tag}</span>
          ))}
        </div>

        <div className="blogpost-content">
          {blog.content.split("\n").map((line, i) => {
            const trimmed = line.trimStart();
            if (trimmed.startsWith("## ")) {
              return <h2 key={i}>{trimmed.slice(3)}</h2>;
            }
            if (trimmed.startsWith("### ")) {
              return <h3 key={i}>{trimmed.slice(4)}</h3>;
            }
            if (trimmed.startsWith("```")) {
              return null; // code fences handled below
            }
            if (trimmed.startsWith("- ")) {
              return <li key={i}>{formatInline(trimmed.slice(2))}</li>;
            }
            if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ")) {
              return <li key={i}>{formatInline(trimmed.slice(3))}</li>;
            }
            if (trimmed === "") return null;
            return <p key={i}>{formatInline(trimmed)}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^`]+\`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default BlogPost;
