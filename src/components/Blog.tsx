import { useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import blogs from "../data/blogs";
import "./styles/Blog.css";

const BLOGS_PER_PAGE = 6;

const Blog = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const visibleBlogs = blogs.slice(
    page * BLOGS_PER_PAGE,
    (page + 1) * BLOGS_PER_PAGE
  );

  return (
    <div className="blog-section section-container" id="blog">
      <div className="blog-container">
        <h2>
          My <span>Blog</span>
        </h2>
        <div className="blog-list">
          {visibleBlogs.map((blog, index) => (
            <Link
              key={blog.slug}
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
        {totalPages > 1 && (
          <div className="blog-pagination">
            <button
              className="blog-page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              ← Prev
            </button>
            <div className="blog-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`blog-page-num ${page === i ? "active" : ""}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="blog-page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
