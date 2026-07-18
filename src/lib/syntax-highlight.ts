// ── 轻量语法高亮引擎 ──
// 不依赖任何第三方库，纯手写实现
// 支持：JavaScript/TypeScript、Python、CSS、HTML、JSON、Bash、SQL

type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "function"
  | "builtin"
  | "punctuation"
  | "plain";

// Token type structure (preserved for future tokenization extension)
// interface Token { type: TokenType; value: string; }

// Tailwind class 映射
const TOKEN_CLASS: Record<TokenType, string> = {
  comment: "hl-comment",
  string: "hl-string",
  keyword: "hl-keyword",
  number: "hl-number",
  function: "hl-function",
  builtin: "hl-builtin",
  punctuation: "hl-punctuation",
  plain: "hl-plain",
};

/** HTML 转义，防止 XSS */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 生成一个唯一的占位符 */
let placeholderId = 0;
function makePlaceholder(): string {
  return `\u0000HL${placeholderId++}\u0000`;
}

// 各语言关键字
const KEYWORDS_COMMON = [
  "if", "else", "for", "while", "do", "switch", "case", "break",
  "continue", "return", "try", "catch", "finally", "throw", "new",
  "typeof", "instanceof", "void", "delete", "in", "of", "async", "await",
  "class", "extends", "super", "import", "export", "default", "from",
  "const", "let", "var", "function", "yield", "static", "get", "set",
  "public", "private", "protected", "implements", "interface", "type",
  "enum", "namespace", "module", "declare", "abstract", "as", "is",
  "readonly", "keyof", "infer", "never", "unknown", "any",
  "true", "false", "null", "undefined",
];

const KEYWORDS_PYTHON = [
  "def", "class", "import", "from", "return", "if", "elif", "else",
  "for", "while", "try", "except", "finally", "with", "as", "pass",
  "break", "continue", "yield", "lambda", "and", "or", "not", "in", "is",
  "global", "nonlocal", "assert", "raise", "del",
  "None", "True", "False", "self", "cls",
];

const BUILTINS_PYTHON = [
  "print", "range", "len", "type", "int", "str", "float", "bool",
  "list", "dict", "set", "tuple", "open", "input", "enumerate",
  "zip", "map", "filter", "sorted", "reversed", "any", "all",
  "max", "min", "sum", "abs", "round", "isinstance", "issubclass",
  "hasattr", "getattr", "setattr", "super", "Exception", "ValueError",
  "TypeError", "KeyError", "IndexError", "ImportError", "RuntimeError",
];

const KEYWORDS_SQL = [
  "SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE",
  "ALTER", "DROP", "TABLE", "INDEX", "INTO", "VALUES", "SET",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY",
  "ORDER", "ASC", "DESC", "HAVING", "LIMIT", "OFFSET", "UNION",
  "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN", "IS", "NULL",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "AS",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CASCADE",
];

/** 根据语言选择关键字 */
function getKeywords(lang: string): { keywords: string[]; builtins: string[] } {
  const l = lang.toLowerCase();
  if (l === "python" || l === "py") {
    return { keywords: KEYWORDS_PYTHON, builtins: BUILTINS_PYTHON };
  }
  if (l === "sql") {
    return { keywords: KEYWORDS_SQL, builtins: [] };
  }
  return { keywords: KEYWORDS_COMMON, builtins: [] };
}

/**
 * 核心高亮函数
 * 流程：
 * 1. HTML 转义（防 XSS）
 * 2. 用占位符替换注释、字符串（防止后续规则误匹配）
 * 3. 对剩余文本应用关键字、数字、函数名规则
 * 4. 还原占位符 → 得到完整高亮 HTML
 */
export function highlightCode(code: string, language = ""): string {
  placeholderId = 0;
  const placeholders: string[] = [];
  const lang = language.toLowerCase();

  let html = escapeHtml(code);

  // ── 步骤 1：保护注释 ──
  // Python/Shell 风格： # comment
  if (lang === "python" || lang === "py" || lang === "sh" || lang === "bash" || lang === "shell" || lang === "yaml" || lang === "yml" || lang === "rb" || lang === "ruby") {
    html = html.replace(/(^|\s)(#[^\n]*)/gm, (_full, space, comment) => {
      const ph = makePlaceholder();
      placeholders.push(
        `<span class="${TOKEN_CLASS.comment}">${space}${comment}</span>`
      );
      return ph;
    });
  }
  // JS/TS/C/Java 风格：// 和 /* */
  html = html.replace(/(\/\/[^\n]*)/g, (m) => {
    const ph = makePlaceholder();
    placeholders.push(`<span class="${TOKEN_CLASS.comment}">${m}</span>`);
    return ph;
  });
  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (m) => {
    const ph = makePlaceholder();
    placeholders.push(`<span class="${TOKEN_CLASS.comment}">${m}</span>`);
    return ph;
  });
  // HTML 注释
  html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (m) => {
    const ph = makePlaceholder();
    placeholders.push(`<span class="${TOKEN_CLASS.comment}">${m}</span>`);
    return ph;
  });

  // ── 步骤 2：保护字符串 ──
  // 三引号（Python）
  html = html.replace(
    /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
    (m) => {
      const ph = makePlaceholder();
      placeholders.push(`<span class="${TOKEN_CLASS.string}">${m}</span>`);
      return ph;
    }
  );
  // 模板字符串（反引号）
  html = html.replace(
    /(`(?:[^`\\]|\\.)*`)/g,
    (m) => {
      const ph = makePlaceholder();
      placeholders.push(`<span class="${TOKEN_CLASS.string}">${m}</span>`);
      return ph;
    }
  );
  // 双引号字符串
  html = html.replace(
    /("(?:[^"\\]|\\.)*")/g,
    (m) => {
      const ph = makePlaceholder();
      placeholders.push(`<span class="${TOKEN_CLASS.string}">${m}</span>`);
      return ph;
    }
  );
  // 单引号字符串（注意避开已处理的）
  html = html.replace(
    /('(?:[^'\\]|\\.)*')/g,
    (m) => {
      const ph = makePlaceholder();
      placeholders.push(`<span class="${TOKEN_CLASS.string}">${m}</span>`);
      return ph;
    }
  );

  // ── 步骤 3：关键字高亮（按长度降序，避免短关键字先匹配） ──
  const { keywords, builtins } = getKeywords(lang);
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

  for (const kw of sortedKeywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b(${escaped})\\b`, "g");
    html = html.replace(regex, (_full, match) => {
      const ph = makePlaceholder();
      placeholders.push(
        `<span class="${TOKEN_CLASS.keyword}">${match}</span>`
      );
      return ph;
    });
  }

  // 内置函数
  if (builtins.length > 0) {
    const sortedBuiltins = [...builtins].sort((a, b) => b.length - a.length);
    for (const bi of sortedBuiltins) {
      const escaped = bi.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b(${escaped})\\b`, "g");
      html = html.replace(regex, (_full, match) => {
        const ph = makePlaceholder();
        placeholders.push(
          `<span class="${TOKEN_CLASS.builtin}">${match}</span>`
        );
        return ph;
      });
    }
  }

  // ── 步骤 4：数字 ──
  html = html.replace(/\b(\d+\.?\d*)\b/g, (_full, num) => {
    const ph = makePlaceholder();
    placeholders.push(`<span class="${TOKEN_CLASS.number}">${num}</span>`);
    return ph;
  });

  // ── 步骤 5：函数调用（identifier 后紧跟 ( ） ──
  html = html.replace(/\b([a-zA-Z_]\w*)\s*\(/g, (_full, name) => {
    const ph = makePlaceholder();
    placeholders.push(
      `<span class="${TOKEN_CLASS.function}">${name}</span>(`
    );
    return ph;
  });

  // ── 步骤 6：还原所有占位符 ──
  for (let i = 0; i < placeholders.length; i++) {
    html = html.replace(`\u0000HL${i}\u0000`, placeholders[i]);
  }

  return html;
}

/**
 * 从 Markdown 代码围栏中提取语言标识
 * 输入 "```python" → 输出 "python"
 */
export function extractLanguage(codeFenceHeader: string): string {
  const match = codeFenceHeader.match(/^```(\S*)/);
  return match ? match[1].toLowerCase() : "";
}

/**
 * 解析消息内容，将文本和代码块分开
 * 返回片段数组：{ type: "text" | "code", content: string, language?: string }
 */
export interface ContentSegment {
  type: "text" | "code";
  content: string;
  language?: string;
}

export function parseContent(raw: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const codeBlockRegex = /```(\S*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(raw)) !== null) {
    // 代码块之前的文本
    const before = raw.slice(lastIndex, match.index).trim();
    if (before) {
      segments.push({ type: "text", content: before });
    }
    // 代码块
    segments.push({
      type: "code",
      language: match[1] || undefined,
      content: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

  // 最后剩余的文本
  const after = raw.slice(lastIndex).trim();
  if (after) {
    segments.push({ type: "text", content: after });
  }

  // 如果没有任何代码块，整段就是文本
  if (segments.length === 0) {
    return [{ type: "text", content: raw }];
  }

  return segments;
}
