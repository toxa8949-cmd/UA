// Легкий безпечний рендерер Markdown → HTML без зовнішніх залежностей.
// Підтримує: ## h2, ### h3, абзаци, списки (- / 1.), **bold**, [text](url).
// Екранує HTML, щоб уникнути XSS з контенту БД.

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let out = esc(s);
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // links [text](https://...)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
  );
  // internal links [text](/path)
  out = out.replace(/\[([^\]]+)\]\((\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (/^- /.test(line)) {
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inline(line.replace(/^\d+\.\s/, ""))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  return html.join("\n");
}
