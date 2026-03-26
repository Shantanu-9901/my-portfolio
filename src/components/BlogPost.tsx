import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import blogs from "../data/blogs";
import "./styles/BlogPost.css";
import "./styles/MultiAgentArticle.css";

function renderContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();

    // Code block: ~~~ or ```
    if (trimmed.startsWith("~~~") || trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length) {
        const t = lines[i].trimStart();
        if (t.startsWith("~~~") || t.startsWith("```")) {
          i++;
          break;
        }
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={elements.length} className={lang ? `language-${lang}` : ""}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Image: ![caption](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, caption, url] = imgMatch;
      elements.push(
        <figure key={elements.length} className="blogpost-figure">
          <img src={url} alt={caption} loading="lazy" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={elements.length}>{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={elements.length}>{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("- ")) {
      elements.push(<li key={elements.length}>{formatInline(trimmed.slice(2))}</li>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(<li key={elements.length}>{formatInline(trimmed.replace(/^\d+\.\s/, ""))}</li>);
    } else if (trimmed.startsWith("| ")) {
      // Table row — collect all table rows
      const rows: string[] = [trimmed];
      let j = i + 1;
      while (j < lines.length && lines[j].trimStart().startsWith("|")) {
        rows.push(lines[j].trimStart());
        j++;
      }
      const tableRows = rows
        .filter((r) => !r.match(/^\|\s*[-|]+\s*\|$/))
        .map((r) =>
          r.split("|").filter((c) => c.trim() !== "").map((c) => c.trim())
        );
      if (tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="blogpost-table-wrap">
            <table>
              <thead>
                <tr>{tableRows[0].map((c, ci) => <th key={ci}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri}>{row.map((c, ci) => <td key={ci}>{formatInline(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      i = j;
      continue;
    } else if (trimmed === "") {
      // skip blank lines
    } else {
      elements.push(<p key={elements.length}>{formatInline(trimmed)}</p>);
    }
    i++;
  }
  return elements;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b) => b.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!blog) {
    return (
      <div className="blogpost-section">
        <div className="blogpost-container">
          <a href="/#blog" className="blogpost-back" data-cursor="disable">
            <MdArrowBack /> Back
          </a>
          <h1>Post not found</h1>
        </div>
      </div>
    );
  }

  if (blog.rawHtml) {
    return (
      <div className="blogpost-section">
        <div className="blogpost-container">
          <a href="/#blog" className="blogpost-back" data-cursor="disable">
            <MdArrowBack /> Back
          </a>
          <div
            className="mas-article"
            dangerouslySetInnerHTML={{ __html: blog.rawHtml }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="blogpost-section">
      <div className="blogpost-container">
        <a href="/#blog" className="blogpost-back" data-cursor="disable">
          <MdArrowBack /> Back
        </a>

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
          {renderContent(blog.content)}
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
