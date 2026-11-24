"use client";

import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";
import { compareText } from "@/lib/text-compare.mjs";
import { cleanCsv } from "@/lib/csv-cleaner.mjs";

type Kind = "text-compare" | "csv-cleaner";
const copyButton: React.CSSProperties = { border: "1px solid #d5e4da", background: "#f2f8f3", color: "#14634b", padding: "10px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer" };
const primaryButton: React.CSSProperties = { border: 0, background: "#14634b", color: "#fff", padding: "12px 18px", borderRadius: 8, fontWeight: 700, cursor: "pointer" };
const inputStyle: React.CSSProperties = { width: "100%", padding: 14, border: "1px solid #dce7df", borderRadius: 12, fontSize: 14, lineHeight: 1.6, color: "#17251e", background: "#fff" };

export default function UtilityTool({ kind }: { kind: Kind }) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof compareText> | null>(null);
  const [csvResult, setCsvResult] = useState<ReturnType<typeof cleanCsv> | null>(null);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [spreadsheetSafe, setSpreadsheetSafe] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isCompare = kind === "text-compare";
  const title = isCompare ? "Text Compare Tool" : "CSV Cleaner";
  const description = isCompare
    ? "Compare two text documents line by line. Find added, removed and unchanged lines instantly in your browser."
    : "Clean CSV files online by trimming extra spaces, removing blank rows and duplicate records, then download a clean CSV file.";
  const faq = isCompare
    ? [
        ["How does the text comparison work?", "The tool compares lines using a longest-common-subsequence diff. It labels unchanged, added and removed lines without sending your text to a server."],
        ["Does it support large text files?", "For responsive browser performance, the comparison is limited to a bounded number of line-pair comparisons. If a document is too large, split it into smaller sections."],
        ["Is my text uploaded?", "No. The comparison runs locally in your browser. Avoid using a shared device for confidential documents."]
      ]
    : [
        ["What does the CSV cleaner remove?", "It can trim whitespace around cells, skip empty rows and remove duplicate data rows while preserving the first occurrence and the original row order."],
        ["Does it support quoted commas and line breaks?", "Yes. The tool uses a CSV parser that handles quoted commas, escaped double quotes and line breaks inside quoted fields. Malformed CSV is reported instead of silently rewritten."],
        ["Why is spreadsheet-safe export enabled?", "CSV files can contain values interpreted as formulas by spreadsheet software. The safe option prefixes formula-like cells with an apostrophe. Turn it off only when you trust the data and need the original values."]
      ];

  function runCompare() {
    setError(""); setResult(null); setCopied(false);
    try {
      if (!left.trim() && !right.trim()) throw new Error("Enter text in both boxes, or at least one side, before comparing.");
      setResult(compareText(left, right));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not compare this text."); }
  }
  function runCsv() {
    setError(""); setCsvResult(null); setCopied(false);
    try {
      if (!csvInput.trim()) throw new Error("Paste CSV data or upload a CSV file first.");
      setCsvResult(cleanCsv(csvInput, { trimWhitespace, removeDuplicates, spreadsheetSafe }));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not clean this CSV file."); }
  }
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setCopied(true); setError(""); }
    catch { setError("Clipboard access failed. Select the result and copy it manually."); }
  }
  function downloadCsv() {
    if (!csvResult) return;
    const blob = new Blob([csvResult.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "pictospec-cleaned.csv"; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function loadCsv(file?: File) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Choose a CSV file smaller than 10 MB."); return; }
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv" && file.type !== "application/vnd.ms-excel") { setError("Please choose a .csv file."); return; }
    try { setCsvInput(await file.text()); setCsvResult(null); setError(""); }
    catch { setError("This CSV file could not be read by your browser."); }
  }

  return <main style={{ maxWidth: 1000, margin: "36px auto", padding: "20px", color: "#17251e" }}>
    <div className="tool-page-top"><a href="/" style={{ color: "#14634b", fontWeight: 700, textDecoration: "none" }}>← PicToSpec home</a><ToolSearch /></div>
    <p style={{ fontSize: 11, letterSpacing: 2, color: "#14634b", fontWeight: 800, marginTop: 35 }}>FREE TEXT & DATA TOOL</p>
    <h1 style={{ fontSize: "clamp(32px,6vw,46px)", letterSpacing: -1.5, margin: "10px 0" }}>{title}</h1>
    <p style={{ color: "#75847c", lineHeight: 1.7 }}>{description}</p>

    {isCompare ? <section style={{ marginTop: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 14 }}>
        <label style={{ display: "grid", gap: 8, fontWeight: 700 }}>Original text<textarea value={left} onChange={e => { setLeft(e.target.value); setResult(null); setError(""); }} placeholder="Paste the original text here…" rows={12} style={inputStyle} /></label>
        <label style={{ display: "grid", gap: 8, fontWeight: 700 }}>Changed text<textarea value={right} onChange={e => { setRight(e.target.value); setResult(null); setError(""); }} placeholder="Paste the updated text here…" rows={12} style={inputStyle} /></label>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 14 }}>
        <button type="button" onClick={runCompare} style={primaryButton}>Compare text</button>
        <button type="button" onClick={() => { setLeft(""); setRight(""); setResult(null); setError(""); }} style={copyButton}>Clear both</button>
      </div>
      {result && <section style={{ marginTop: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <span><b>{result.stats.added}</b> added</span><span><b>{result.stats.removed}</b> removed</span><span><b>{result.stats.unchanged}</b> unchanged</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 8 }}><b>Comparison result</b><button type="button" style={copyButton} onClick={() => copy(result.lines.map(line => (line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ") + line.text).join("\n"))}>Copy diff</button></div>
        <div aria-live="polite" style={{ overflowX: "auto", border: "1px solid #dce7df", borderRadius: 12, background: "#fff", padding: 8 }}>
          {result.lines.length ? result.lines.map((line, index) => <div key={index} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, padding: "5px 8px", borderRadius: 5, background: line.type === "added" ? "#e8f8ee" : line.type === "removed" ? "#fff0ef" : "transparent", color: line.type === "added" ? "#17623b" : line.type === "removed" ? "#a12e2e" : "#344054", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}><b>{line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}</b><span>{line.text || " "}</span></div>) : <p style={{ padding: 12 }}>Both texts are empty.</p>}
        </div>
      </section>}
    </section> : <section style={{ marginTop: 22 }}>
      <label style={{ display: "grid", gap: 8, fontWeight: 700 }}>Paste CSV data<textarea value={csvInput} onChange={e => { setCsvInput(e.target.value); setCsvResult(null); setError(""); }} placeholder={"name,city,notes\nAsha,Delhi,\"Office, North\"\nRavi,Mumbai,New client"} rows={10} style={inputStyle} /></label>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 12, color: "#40516a" }}><input type="checkbox" checked={trimWhitespace} onChange={e => setTrimWhitespace(e.target.checked)} /> Trim spaces around each cell</label><br/>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 8, color: "#40516a" }}><input type="checkbox" checked={removeDuplicates} onChange={e => setRemoveDuplicates(e.target.checked)} /> Remove duplicate data rows</label><br/>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 8, color: "#40516a" }}><input type="checkbox" checked={spreadsheetSafe} onChange={e => setSpreadsheetSafe(e.target.checked)} /> Protect formula-like cells for spreadsheet apps</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 14 }}>
        <button type="button" onClick={runCsv} style={primaryButton}>Clean CSV</button>
        <label style={{ ...copyButton, display: "inline-flex", alignItems: "center", gap: 8 }}>Upload CSV<input type="file" accept=".csv,text/csv" onChange={e => { void loadCsv(e.target.files?.[0]); e.currentTarget.value = ""; }} style={{ maxWidth: 190, fontWeight: 400 }} /></label>
        <button type="button" onClick={() => { setCsvInput(""); setCsvResult(null); setError(""); }} style={copyButton}>Clear</button>
      </div>
      {csvResult && <section style={{ marginTop: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 12, color: "#40516a" }}>
          <span><b>{csvResult.inputRows}</b> input rows</span><span><b>{csvResult.outputRows}</b> output rows</span><span><b>{csvResult.duplicatesRemoved}</b> duplicates removed</span><span><b>{csvResult.blankRowsRemoved}</b> empty rows removed</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center", marginBottom: 8 }}><b>Cleaned CSV</b><button type="button" style={copyButton} onClick={() => copy(csvResult.csv)}>Copy CSV</button><button type="button" style={primaryButton} onClick={downloadCsv}>Download CSV</button></div>
        <textarea readOnly value={csvResult.csv} rows={10} style={inputStyle} />
      </section>}
    </section>}

    {error && <p role="alert" style={{ color: "#b42318", marginTop: 12 }}>{error}</p>}
    {copied && <p role="status" style={{ color: "#17623b", marginTop: 8 }}>Copied to clipboard.</p>}
    <p style={{ fontSize: 12, color: "#75847c", lineHeight: 1.7, marginTop: 22 }}>Processing happens locally in your browser. Your text and CSV content are not uploaded to a PicToSpec processing server.</p>
    <section className="tool-content">
      <h2>{title}: free online tool</h2><p>{description} Use the controls above to process your content and review the result before copying or downloading it.</p>
      <h3>How to use this tool</h3>
      {isCompare ? <><ol><li>Paste the earlier version into Original text.</li><li>Paste the newer version into Changed text.</li><li>Select Compare text to see added, removed and unchanged lines.</li><li>Copy the diff when you need to share or review the changes.</li></ol><h3>Example</h3><p>If the original contains “Project status: pending” and the updated version contains “Project status: approved”, the comparison marks the old line as removed and the new line as added.</p><h3>How text comparison works</h3><p>The tool uses a line-based longest-common-subsequence comparison. It is useful for drafts, notes, configuration snippets and plain-text revisions. It does not compare visual document formatting or binary files.</p></> : <><ol><li>Paste CSV text or upload a .csv file smaller than 10 MB.</li><li>Choose whether to trim cell whitespace, remove duplicate rows and protect formula-like values.</li><li>Select Clean CSV and review the row counts and preview.</li><li>Copy the cleaned data or download it as a CSV file.</li></ol><h3>Example</h3><p>A file with repeated customer rows and spaces around names can be cleaned while keeping the first copy of each row. Quoted commas and line breaks inside CSV fields are preserved.</p><h3>How CSV cleaning works</h3><p>The cleaner parses CSV quoting rules before editing cells. It keeps the first header row, preserves the order of unique records and writes valid quoted CSV output. Formula protection is optional and enabled by default for safer spreadsheet imports.</p></>}
      <h3>Frequently asked questions</h3>{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </section>
  </main>;
}
