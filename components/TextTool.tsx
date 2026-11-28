"use client";

import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
import {
  convertTextCase,
  type TextCaseFormat,
} from "@/lib/text-case-converter.mjs";

type Kind = "word-counter" | "case-converter" | "json-formatter" | "base64-encoder-decoder";

const config: Record<Kind, { title: string; desc: string; placeholder: string }> = {
  "word-counter": {
    title: "Word and Character Counter",
    desc: "Count words, characters, sentences, paragraphs and lines instantly. Emoji and combined characters are counted as visible characters where your browser supports it.",
    placeholder: "Type or paste your text here...",
  },
  "case-converter": {
    title: "Free Online Caps Lock Converter & Text Case Converter",
    desc: "Fix text typed with Caps Lock on. Convert to uppercase, lowercase, Title Case, Sentence Case and developer formats. Free and processed in your browser.",
    placeholder: "Paste text typed with Caps Lock on, or enter any text...",
  },
  "json-formatter": {
    title: "JSON Formatter and Validator",
    desc: "Format, beautify, minify and validate JSON data in your browser with clear error messages.",
    placeholder: 'Paste JSON here, e.g. {"name":"PicToSpec"}',
  },
  "base64-encoder-decoder": {
    title: "Base64 Encoder and Decoder",
    desc: "Encode plain text to Base64 or decode Base64 strings locally in your browser.",
    placeholder: "Enter text or Base64 data...",
  },
};

const caseModes: { format: TextCaseFormat; label: string; detail: string }[] = [
  { format: "upper", label: "UPPERCASE", detail: "ALL CAPITAL LETTERS" },
  { format: "lower", label: "lowercase", detail: "all small letters" },
  { format: "title", label: "Title Case", detail: "Headline style, with common short words lowercased" },
  { format: "capitalize", label: "Capitalize Each Word", detail: "Every word starts with a capital" },
  { format: "sentence", label: "Sentence case", detail: "Capitalize sentence beginnings" },
  { format: "toggle", label: "tOGGLE cASE", detail: "Reverse each letter's case" },
  { format: "alternating", label: "aLtErNaTiNg", detail: "Alternate upper and lower letters" },
  { format: "camel", label: "camelCase", detail: "developer variable names" },
  { format: "pascal", label: "PascalCase", detail: "class and component names" },
  { format: "snake", label: "snake_case", detail: "Python and data keys" },
  { format: "kebab", label: "kebab-case", detail: "URL slugs and CSS classes" },
  { format: "constant", label: "CONSTANT_CASE", detail: "UPPERCASE_WITH_UNDERSCORES" },
  { format: "spaces", label: "Collapse extra spaces", detail: "Clean repeated spaces and keep line breaks" },
];

const faqs: Record<Kind, { q: string; a: string }[]> = {
  "word-counter": [
    { q: "How are words counted?", a: "Words are counted as groups of non-whitespace characters. The count updates as you type or paste text." },
    { q: "Are emojis counted as one character?", a: "The counter uses grapheme counting where supported by your browser, so combined emoji and accented characters are counted as visible characters." },
  ],
  "case-converter": [
    { q: "Does a Caps Lock converter turn off my keyboard's Caps Lock key?", a: "No. It changes the case of text pasted or typed into this page. It cannot control the physical Caps Lock key on your phone, laptop or keyboard." },
    { q: "How do I fix text typed with Caps Lock on?", a: "Paste the text into the editor and choose lowercase to make every letter small, or Sentence case to capitalize sentence beginnings." },
    { q: "Can I convert lowercase text to uppercase?", a: "Yes. Paste the text and choose UPPERCASE. The converted result appears below and can be copied or downloaded." },
    { q: "What is the difference between Title Case and Sentence case?", a: "Title Case capitalizes most words in a heading and keeps common short words lowercase in the middle. Sentence case capitalizes the beginning of each sentence and lowercases the remaining text." },
    { q: "Can I convert text into camelCase or snake_case?", a: "Yes. Choose camelCase, PascalCase, snake_case, kebab-case or CONSTANT_CASE to turn ordinary words into common developer naming formats." },
    { q: "Is my text uploaded to PicToSpec?", a: "No. Case conversion runs in your browser. The text you enter is not sent to a PicToSpec text-processing server." },
  ],
  "json-formatter": [
    { q: "Does formatting JSON change its data?", a: "Formatting changes whitespace and indentation. Minifying removes unnecessary whitespace; the JSON values and structure are retained." },
    { q: "Does this tool execute JSON or code?", a: "No. It parses JSON syntax in your browser and formats the data. It does not execute scripts or code contained in the input." },
  ],
  "base64-encoder-decoder": [
    { q: "Is Base64 encryption?", a: "No. Base64 is an encoding format, not encryption. Anyone can decode Base64 text, so never use it to protect passwords or secrets." },
    { q: "Can I encode non-English text?", a: "Yes. This tool encodes UTF-8 text, including common non-English characters and emoji." },
  ],
};

const guides: Record<Kind, { example: string; steps: string[]; tips: string[]; notes: string }> = {
  "word-counter": {
    example: "A short sentence such as “PicToSpec makes useful tools” contains four words. Punctuation stays attached to its word, while spaces and line breaks separate word groups.",
    steps: [
      "Paste or type text into the editor.",
      "Read the live word, character, sentence, paragraph and line counts.",
      "Use the character count that matches the limit in your form or publishing platform.",
      "Check the destination platform's own counting rules when the limit is strict.",
    ],
    tips: [
      "Drafting a social post? Check the platform's current character limit before publishing.",
      "For a form, confirm whether spaces count toward the allowed character total.",
      "The sentence and paragraph counts are estimates based on punctuation and blank lines, not a full language parser.",
    ],
    notes: "Words are counted as non-whitespace groups. This is a practical general-purpose count, but some publishers treat hyphenated terms, contractions, URLs and languages without spaces differently. Grapheme-aware character counting is used when the browser supports Intl.Segmenter.",
  },
  "case-converter": {
    example: "For example, “hELLO wORLD” can be changed to “HELLO WORLD” with UPPERCASE, “hello world” with lowercase, or “Hello World” with Capitalize Each Word.",
    steps: [
      "Paste or type the text you want to convert. Use Try example to see a sample.",
      "Choose one of the case formats, such as UPPERCASE, lowercase, Sentence case or camelCase.",
      "Review the converted output. Your original text remains in the input box.",
      "Copy the result, use it as the next input, or download a TXT file.",
    ],
    tips: [
      "Use lowercase to fix a paragraph accidentally typed with Caps Lock on.",
      "Use Sentence case for ordinary body text and a title style for short headings.",
      "Use camelCase, snake_case or kebab-case when a programming language, API or CSS convention expects that format.",
      "Review acronyms, product names and proper nouns after conversion. Automatic casing cannot always know the intended spelling.",
    ],
    notes: "The tool performs browser-based Unicode case conversion. Title Case uses a simple English list of common short words; Sentence case capitalizes sentence beginnings. Developer naming modes extract words and remove punctuation when creating the new identifier. These are formatting helpers, not full language or code parsers.",
  },
  "json-formatter": {
    example: 'Input {"name":"PicToSpec","tools":25} can be formatted as indented JSON for easier reading or minified into a compact single-line representation.',
    steps: [
      "Copy valid JSON text from your file, API response or editor.",
      "Choose the indentation size for readable output, or select minify for compact output.",
      "Run formatting to parse and validate the JSON.",
      "Copy the result and test it in the application that will consume it.",
    ],
    tips: [
      "JSON property names and string values must use double quotes.",
      "Remove trailing commas; standard JSON does not allow them.",
      "Keep a backup of the original before editing configuration or API data.",
      "Formatting checks JSON syntax; it does not validate an application's custom schema.",
    ],
    notes: "The tool uses the browser's JSON parser. It does not execute scripts or contact an API. A document can be valid JSON and still fail an application's schema or business rules.",
  },
  "base64-encoder-decoder": {
    example: "The text “Hello” encodes to “SGVsbG8=”. Decoding that Base64 value returns the original text. UTF-8 encoding supports non-English characters and emoji.",
    steps: [
      "Select encode to convert plain text into Base64, or decode to convert Base64 back into text.",
      "Paste the input into the editor.",
      "Run the conversion and inspect the output.",
      "Copy the result only into a system that expects Base64 text.",
    ],
    tips: [
      "Base64 is commonly used to represent binary data as text in APIs, data URLs and transport formats.",
      "Do not use Base64 to hide or protect sensitive information; it is reversible encoding.",
      "For files or binary payloads, use a file-aware tool rather than assuming plain-text Base64 is interchangeable with every binary format.",
    ],
    notes: "This tool encodes and decodes UTF-8 text. Base64 is not encryption, hashing or compression. Anyone with the encoded value can decode it, so do not paste passwords, access tokens or confidential information.",
  },
};

function encodeBase64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    const chunk = bytes.subarray(i, i + 0x8000);
    for (let j = 0; j < chunk.length; j++) binary += String.fromCharCode(chunk[j]);
  }
  return btoa(binary);
}

function decodeBase64Utf8(value: string) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function countCharacters(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)).length;
  }
  return Array.from(text).length;
}

export default function TextTool({ kind }: { kind: Kind }) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState("encode");
  const [indent, setIndent] = useState("2");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => ({
    words: (value.trim().match(/\S+/g) || []).length,
    chars: countCharacters(value),
    noSpaces: countCharacters(value.replace(/\s/g, "")),
    sentences: (value.match(/[.!?]+(?=\s|$)/g) || []).length,
    paragraphs: value.trim() ? value.trim().split(/\n\s*\n/).length : 0,
    lines: value ? value.split(/\r?\n/).length : 0,
  }), [value]);

  function run(action: string) {
    setError("");
    setOutput("");
    setCopied(false);
    try {
      if (kind === "case-converter") {
        if (!value.trim()) throw new Error("Enter or paste text first, then choose a conversion.");
        setOutput(convertTextCase(value, action as TextCaseFormat));
      } else if (kind === "json-formatter") {
        const parsed = JSON.parse(value);
        setOutput(action === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, Number(indent)));
      } else if (kind === "base64-encoder-decoder") {
        setOutput(mode === "encode" ? encodeBase64Utf8(value) : decodeBase64Utf8(value));
      }
    } catch (exception) {
      setError(
        kind === "json-formatter"
          ? exception instanceof Error ? exception.message : "Invalid JSON"
          : exception instanceof Error ? exception.message : "Could not process this input.",
      );
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setError("Copy failed. Please select and copy the result manually.");
    }
  }

  function clearCaseText() {
    setValue("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  function tryCaseExample() {
    setValue("hELLO wORLD! tHIS TEXT WAS tYPED wITH cAPS lOCK.");
    setOutput("");
    setError("");
    setCopied(false);
  }

  function useResultAsInput() {
    setValue(output);
    setOutput("");
    setError("");
    setCopied(false);
  }

  function downloadCaseResult() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pictospec-converted-text.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main style={{ maxWidth: 850, margin: "40px auto", padding: "20px", color: "#17251e" }}>
      <div className="tool-page-top">
        <a href="/" style={{ color: "#14634b", fontWeight: 700, textDecoration: "none" }}>← PicToSpec home</a>
        <ToolSearch />
      </div>

      <p style={{ fontSize: 11, letterSpacing: 2, color: "#14634b", fontWeight: 800, marginTop: 35 }}>
        {kind === "case-converter" ? "FREE ONLINE TEXT FORMATTING TOOL" : "FREE TEXT & DEVELOPER TOOL"}
      </p>
      <h1 style={{ fontSize: "clamp(32px,6vw,46px)", letterSpacing: -1.5, margin: "10px 0" }}>
        {config[kind].title}
      </h1>
      <p style={{ color: "#75847c", lineHeight: 1.7 }}>{config[kind].desc}</p>

      {kind === "case-converter" ? (
        <section className="case-workspace">
          <div className="case-editor-head">
            <div>
              <span className="case-eyebrow">YOUR TEXT</span>
              <b>Paste or type text to convert</b>
            </div>
            <div className="case-editor-actions">
              <button type="button" onClick={tryCaseExample}>Try example</button>
              <button type="button" onClick={clearCaseText}>Clear</button>
            </div>
          </div>
          <textarea
            value={value}
            onChange={event => {
              setValue(event.target.value);
              setOutput("");
              setError("");
              setCopied(false);
            }}
            placeholder={config[kind].placeholder}
            rows={9}
            aria-label="Text to convert"
          />
          <div className="case-live-stats">
            <span><b>{stats.words}</b> words</span>
            <span><b>{stats.chars}</b> characters</span>
            <span><b>{stats.noSpaces}</b> without spaces</span>
            <span><b>{stats.lines}</b> lines</span>
          </div>
          <div className="case-mode-heading">
            <b>Choose a text format</b>
            <span>One click converts the entire text above</span>
          </div>
          <div className="case-mode-grid">
            {caseModes.map(item => (
              <button
                type="button"
                key={item.format}
                onClick={() => run(item.format)}
                className={item.format === "upper" || item.format === "lower" ? "case-mode-primary" : ""}
              >
                <b>{item.label}</b>
                <small>{item.detail}</small>
              </button>
            ))}
          </div>
          <p className="case-privacy-note">
            Your text is converted in this browser. This tool changes pasted text only; it cannot
            switch your phone or computer's physical Caps Lock key.
          </p>
        </section>
      ) : (
        <textarea
          value={value}
          onChange={event => {
            setValue(event.target.value);
            setOutput("");
            setError("");
          }}
          placeholder={config[kind].placeholder}
          rows={10}
          style={{
            width: "100%",
            marginTop: 24,
            padding: 16,
            border: "1px solid #dce7df",
            borderRadius: 12,
            fontSize: 15,
            lineHeight: 1.6,
            resize: "vertical",
          }}
        />
      )}

      {kind === "word-counter" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginTop: 15 }}>
          {Object.entries({
            Words: stats.words,
            Characters: stats.chars,
            "Characters without spaces": stats.noSpaces,
            Sentences: stats.sentences,
            Paragraphs: stats.paragraphs,
            Lines: stats.lines,
          }).map(([label, count]) => (
            <div key={label} style={{ background: "#f2f8f3", padding: 14, borderRadius: 10 }}>
              <b style={{ display: "block", fontSize: 24, color: "#14634b" }}>{count}</b>
              <small style={{ color: "#75847c" }}>{label}</small>
            </div>
          ))}
        </div>
      ) : kind === "json-formatter" ? (
        <section style={{ marginTop: 16, display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
          <select value={indent} onChange={event => setIndent(event.target.value)} style={selectStyle}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="0">No indentation</option>
          </select>
          <button onClick={() => run("format")} style={btn}>Format & validate JSON</button>
          <button onClick={() => run("minify")} style={btn}>Minify JSON</button>
        </section>
      ) : kind === "base64-encoder-decoder" ? (
        <section style={{ marginTop: 16, display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
          <select value={mode} onChange={event => setMode(event.target.value)} style={selectStyle}>
            <option value="encode">Encode to Base64</option>
            <option value="decode">Decode from Base64</option>
          </select>
          <button onClick={() => run(mode)} style={btn}>Convert</button>
        </section>
      ) : null}

      {error && <p role="alert" className="case-error">{error}</p>}

      {output !== "" ? (
        kind === "case-converter" ? (
          <section className="case-result">
            <div className="case-result-head">
              <div>
                <b>Converted text</b>
                <small>{(output.trim().match(/\S+/g) || []).length} words · {countCharacters(output)} characters</small>
              </div>
              <div className="case-result-actions">
                <button type="button" onClick={copy}>{copied ? "Copied!" : "Copy result"}</button>
                <button type="button" onClick={useResultAsInput}>Use as input</button>
                <button type="button" onClick={downloadCaseResult}>Download .txt ↓</button>
              </div>
            </div>
            <textarea readOnly value={output} rows={8} aria-label="Converted text result" />
          </section>
        ) : (
          <section style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Result</b>
              <button onClick={copy} style={btn}>{copied ? "Copied!" : "Copy result"}</button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              style={{ width: "100%", marginTop: 10, padding: 14, border: "1px solid #dce7df", borderRadius: 10, fontSize: 14 }}
            />
          </section>
        )
      ) : null}

      <p style={{ fontSize: 12, color: "#75847c", lineHeight: 1.7, marginTop: 22 }}>
        Your text is processed in this browser. Do not paste passwords, API keys or other secrets into shared or public devices.
      </p>

      {kind === "case-converter" ? null : (
        <section className="tool-content">
          <h2>How to use {config[kind].title.toLowerCase()}</h2>
          <p>{config[kind].desc} The tool runs locally in your browser, so the text you enter is not sent to a PicToSpec processing server.</p>
          <h3>Example</h3>
          <p>{guides[kind].example}</p>
          <h3>Step-by-step instructions</h3>
          <ol>{guides[kind].steps.map(step => <li key={step}>{step}</li>)}</ol>
          <h3>Practical tips</h3>
          <ul>{guides[kind].tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
          <h3>How counting or conversion works</h3>
          <p>{guides[kind].notes}</p>
          <h3>Frequently asked questions</h3>
          {faqs[kind].map(item => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      )}

      {kind === "case-converter" ? null : (
        <section className="tool-content">
          <h3>Related text tools</h3>
          <ul>
            {(kind === "json-formatter"
              ? [
                  { label: "JSON Validator", href: "/json-validator" },
                  { label: "JSON Diff Tool", href: "/json-diff" },
                  { label: "JSON to CSV Converter", href: "/json-to-csv-converter" },
                ]
              : kind === "word-counter"
                ? [
                    { label: "Text Case Converter", href: "/case-converter" },
                    { label: "Typing Speed Test", href: "/typing-speed-test" },
                  ]
                : [
                    { label: "URL Encoder and Decoder", href: "/url-encoder-decoder" },
                    { label: "CSV to JSON Converter", href: "/csv-json-converter" },
                    { label: "JSON Formatter", href: "/json-formatter" },
                  ]
            ).map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
          </ul>
        </section>
      )}
    </main>
  );
}

const btn: React.CSSProperties = {
  border: "1px solid #d5e4da",
  background: "#f2f8f3",
  color: "#14634b",
  padding: "11px 14px",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
};

const selectStyle: React.CSSProperties = {
  padding: 11,
  border: "1px solid #d5e4da",
  borderRadius: 8,
  background: "white",
};
