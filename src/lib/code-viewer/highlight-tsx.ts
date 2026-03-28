export type HighlightTokenType = "keyword" | "tag" | "attribute" | "string";

export type HighlightToken = {
  value: string;
  type?: HighlightTokenType;
};

const KEYWORDS = new Set([
  "const",
  "export",
  "function",
  "if",
  "import",
  "let",
  "return",
  "type",
]);

function isWordCharacter(character: string) {
  return /[A-Za-z0-9_-]/.test(character);
}

function findNextNonWhitespaceCharacter(line: string, startIndex: number) {
  for (let index = startIndex; index < line.length; index += 1) {
    if (!/\s/.test(line[index]!)) {
      return line[index];
    }
  }

  return null;
}

function pushToken(
  tokens: HighlightToken[],
  value: string,
  type?: HighlightTokenType,
) {
  if (!value) {
    return;
  }

  const previousToken = tokens[tokens.length - 1];
  if (previousToken && !previousToken.type && !type) {
    previousToken.value += value;
    return;
  }

  tokens.push({ value, type });
}

function tokenizeLine(line: string) {
  const tokens: HighlightToken[] = [];
  let index = 0;

  while (index < line.length) {
    const character = line[index]!;

    if (character === '"' || character === "'") {
      const quote = character;
      let endIndex = index + 1;

      while (endIndex < line.length) {
        const nextCharacter = line[endIndex]!;
        if (nextCharacter === quote && line[endIndex - 1] !== "\\") {
          endIndex += 1;
          break;
        }

        endIndex += 1;
      }

      pushToken(tokens, line.slice(index, endIndex), "string");
      index = endIndex;
      continue;
    }

    if (character === "<") {
      if (line[index + 1] === "/") {
        pushToken(tokens, "</");
        index += 2;
      } else {
        pushToken(tokens, "<");
        index += 1;
      }

      const tagStart = index;
      while (index < line.length && isWordCharacter(line[index]!)) {
        index += 1;
      }

      const tagName = line.slice(tagStart, index);
      if (tagName) {
        pushToken(tokens, tagName, "tag");
      }

      continue;
    }

    if (/[A-Za-z_]/.test(character)) {
      const wordStart = index;
      while (index < line.length && isWordCharacter(line[index]!)) {
        index += 1;
      }

      const word = line.slice(wordStart, index);
      const nextCharacter = findNextNonWhitespaceCharacter(line, index);

      if (nextCharacter === "=") {
        pushToken(tokens, word, "attribute");
      } else if (KEYWORDS.has(word)) {
        pushToken(tokens, word, "keyword");
      } else {
        pushToken(tokens, word);
      }

      continue;
    }

    pushToken(tokens, character);
    index += 1;
  }

  return tokens;
}

export function highlightTsx(code: string) {
  return code.split("\n").map((line) => tokenizeLine(line));
}
