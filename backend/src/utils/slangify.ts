// slangify.ts
// Utility to translate a text into "modern slang" using multi-word phrase substitution
// and automatic sentence capitalization of the result's first letter of sentences.

type PhraseMap = { [key: string]: string };

// Primary mapping including multi-word phrases. Expand as needed.
const PHRASES: PhraseMap = {
  // single-words
  "hello": "yo",
  "hi": "hey",
  "good": "lit",
  "friend": "bro",
  "amazing": "dope",
  "cool": "chill",
  "money": "bread",
  "yes": "yass",
  "no": "nah",
  "crazy": "wild",
  "love": "luv",

  // multi-word phrases (longer ones first is important)
  "going to": "gonna",
  "want to": "wanna",
  "got to": "gotta",
  "out of": "outta",
  "kind of": "kinda",
  "sort of": "sorta",
  "do not": "don’t",
  "cannot": "can’t",
  "because": "cuz",
  "see you": "cya",
  "thank you": "ty",
  "before": "b4"
};

/**
 * Normalize spacing and punctuation while preserving punctuation tokens.
 * Returns tokens to process phrase-substitutions (keeps punctuation as separate tokens).
 */
function tokenizePreserve(text: string): string[] {
  // Split on whitespace but keep punctuation attached as tokens; we'll handle punctuation after
  // We'll insert spaces around punctuation then split
  const spaced = text.replace(/([.,!?;:()\[\]"])/g, " $1 ");
  const rawTokens = spaced.split(/\s+/).filter(Boolean);
  return rawTokens;
}

/**
 * Rebuild string from tokens and preserve original punctuation spacing>
 */
function detokenize(tokens: string[]): string {
  // join tokens but avoid space before punctuation like .,!?;:)
  const noSpaceBefore = new Set([",", ".", "!", "?", ";", ":", ")", "]", "\"", "'"]);
  const noSpaceAfter = new Set(["(", "[", "\"", "'"]);
  let out = "";
  tokens.forEach((t, i) => {
    if (i === 0) {
      out += t;
      return;
    }
    const prev = tokens[i - 1];
    if (noSpaceBefore.has(t)) {
      out += t;
    } else if (noSpaceAfter.has(prev)) {
      out += t;
    } else {
      out += " " + t;
    }
  });
  return out;
}

/**
 * Replace phrases in token stream greedily: try longest phrase matches first.
 * We operate in lowercase for matching but preserve punctuation tokens by skipping them.
 */
function replacePhrases(tokens: string[], phraseMap: PhraseMap): string[] {
  const lowerTokens = tokens.map(t => t.toLowerCase());
  // Build array of phrase words sorted by descending length (words count) to ensure multi-word match first
  const phraseEntries = Object.keys(phraseMap)
    .map(k => ({ key: k, words: k.split(/\s+/).length }))
    .sort((a, b) => b.words - a.words);

  const outTokens: string[] = [];
  for (let i = 0; i < tokens.length; ) {
    let matched = false;
    // If current token is pure punctuation, just copy it
    if (/^[.,!?;:()\[\]"']$/.test(tokens[i])) {
      outTokens.push(tokens[i]);
      i++;
      continue;
    }

    for (const p of phraseEntries) {
      const phraseWords = p.key.split(/\s+/);
      let ok = true;
      for (let j = 0; j < phraseWords.length; j++) {
        const ti = i + j;
        if (ti >= tokens.length) {
          ok = false;
          break;
        }
        // Skip if token is punctuation
        if (/^[.,!?;:()\[\]"']$/.test(tokens[ti])) {
          ok = false;
          break;
        }
        if (lowerTokens[ti] !== phraseWords[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        outTokens.push(phraseMap[p.key]);
        i += phraseWords.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      outTokens.push(tokens[i]);
      i++;
    }
  }
  return outTokens;
}

/**
 * Capitalize first letter of each sentence in the string.
 * Sentences are split by . ! ? followed by space or end-of-string.
 */
function capitalizeSentences(text: string): string {
  return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

/**
 * Main entrypoint: takes any string, returns slangified string.
 */
export function slangify(input: string): string {
  if (!input) return input;

  // 1) Tokenize but preserve punctuation tokens
  const tokens = tokenizePreserve(input);

  // 2) Normalize tokens for phrase replacement: convert to lower-case for matching
  //    (replacePhrases uses lowercase matching internally)
  const replaced = replacePhrases(tokens, PHRASES);

  // 3) Rebuild string
  const rebuilt = detokenize(replaced);

  // 4) Lower-case everything (except punctuation) then capitalize sentences (we want casual lowercase inside)
  // But preserve user-case for punctuation affected words — we will convert to lowercase then capitalize sentences
  const lower = rebuilt.toLowerCase();

  const result = capitalizeSentences(lower);

  return result;
}
