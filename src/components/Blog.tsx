import { useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import blogs from "../data/blogs";
import "./styles/Blog.css";

const Blog = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="blog-section section-container" id="blog">
      <div className="blog-container">
        <h2>
          My <span>Blog</span>
        </h2>
        <div className="blog-list">
          {blogs.map((blog, index) => (
            <Link
              key={index}
              to={`/blog/${blog.slug}`}
              className={`blog-card ${hoveredIndex === index ? "blog-card-active" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-cursor="disable"
            >
              <div className="blog-card-header">
                <span className="blog-date">{blog.date}</span>
                <MdArrowOutward className="blog-arrow" />
              </div>
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-description">{blog.description}</p>
              <div className="blog-tags">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
