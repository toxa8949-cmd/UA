// Легкий безпечний рендерер Markdown → HTML без зовнішніх залежностей.
// Підтримує: # h1 (прибирається — заголовок є окремо), ## h2, ### h3,
// абзаци, списки (- / 1.), **bold**, [text](url). Генерує id для h2/h3 (для змісту).

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^а-яіїєґa-z0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function inline(s: string): string {
  let out = esc(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
  );
  out = out.replace(/\[([^\]]+)\]\((\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function renderMarkdown(md: string): { html: string; toc: TocItem[] } {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  const toc: TocItem[] = [];
  let listType: "ul" | "ol" | null = null;
  let firstH1Skipped = false;

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
    // Прибираємо перший H1 — заголовок виводиться окремо системою
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      if (!firstH1Skipped) {
        firstH1Skipped = true;
        continue;
      }
      // наступні H1 трактуємо як H2
      const text = line.slice(2);
      const id = slugifyHeading(text);
      toc.push({ id, text, level: 2 });
      closeList();
      html.push(`<h2 id="${id}">${inline(text)}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      const id = slugifyHeading(text);
      toc.push({ id, text, level: 3 });
      closeList();
      html.push(`<h3 id="${id}">${inline(text)}</h3>`);
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      const id = slugifyHeading(text);
      toc.push({ id, text, level: 2 });
      closeList();
      html.push(`<h2 id="${id}">${inline(text)}</h2>`);
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
  return { html: html.join("\n"), toc };
}
