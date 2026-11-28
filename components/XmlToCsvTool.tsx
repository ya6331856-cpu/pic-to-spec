"use client";

import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type FlatRow = Record<string, string>;

const SAMPLE_XML = `<?xml version="1.0"?>
<products>
  <product id="101"><name>Notebook</name><price>4.50</price><category>Stationery</category></product>
  <product id="102"><name>Pen, blue</name><price>1.25</price><category>Stationery</category></product>
</products>`;

function flatten(element: Element, prefix = ""): FlatRow {
  const result: FlatRow = {};
  for (const attribute of Array.from(element.attributes)) {
    result[prefix + "@" + attribute.name] = attribute.value;
  }

  const children = Array.from(element.children);
  const directText = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent || "")
    .join("")
    .trim();

  if (!children.length && directText) {
    result[prefix ? prefix + "#text" : "text"] = directText;
  }

  const groups = new Map<string, Element[]>();
  for (const child of children) {
    groups.set(child.tagName, [...(groups.get(child.tagName) || []), child]);
  }

  groups.forEach((nodes: Element[], name: string) => {
    const key = prefix ? prefix + "." + name : name;
    if (nodes.length > 1) {
      result[key] = JSON.stringify(nodes.map((node: Element) => flatten(node)));
    } else {
      const nested = flatten(nodes[0], key);
      if (Object.keys(nested).length) Object.assign(result, nested);
      else result[key] = nodes[0].textContent?.trim() || "";
    }
  });

  if (directText && children.length) {
    result[prefix ? prefix + "#text" : "text"] = directText;
  }
  return result;
}

function csvCell(value: string) {
  return /[",\\r\\n]/.test(value) ? '"' + value.replace(/"/g, '""') + '"' : value;
}

function convertXmlToCsv(source: string) {
  if (/<\\s*!DOCTYPE|<\\s*!ENTITY/i.test(source)) {
    throw new Error("DOCTYPE and custom entity declarations are not supported. Remove them before converting.");
  }

  const document = new DOMParser().parseFromString(source, "application/xml");
  if (document.querySelector("parsererror")) {
    throw new Error("This XML is not well-formed. Check that every tag is closed and nested correctly.");
  }

  const root = document.documentElement;
  if (!root) throw new Error("No XML root element was found.");

  const children = Array.from(root.children);
  const repeatedRecords =
    children.length > 0 &&
    children.every((node) => node.tagName === children[0].tagName) &&
    (children.length > 1 || children[0].children.length > 0 || children[0].attributes.length > 0);
  const records = repeatedRecords ? children : [root];
  const rows = records.map((record) => flatten(record));
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  if (!headers.length) throw new Error("No element text or attributes were found to export.");
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header] ?? "")).join(",")),
  ];
  return { csv: lines.join("\\r\\n"), rowCount: rows.length, columnCount: headers.length };
}

const button: React.CSSProperties = {
  border: 0, background: "#14634b", color: "#fff", padding: "12px 18px",
  borderRadius: 9, fontWeight: 700, cursor: "pointer",
};
const secondary: React.CSSProperties = {
  border: "1px solid #d5e4da", background: "#fff", color: "#234b39",
  padding: "11px 15px", borderRadius: 9, fontWeight: 700, cursor: "pointer",
};

export default function XmlToCsvTool() {
  const [input, setInput] = useState(SAMPLE_XML);
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ rowCount: 0, columnCount: 0 });
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  function convert() {
    try {
      setError("");
      const result = convertXmlToCsv(input);
      setOutput(result.csv);
      setStats({ rowCount: result.rowCount, columnCount: result.columnCount });
    } catch (caught) {
      setOutput("");
      setStats({ rowCount: 0, columnCount: 0 });
      setError(caught instanceof Error ? caught.message : "Could not convert this XML.");
    }
  }

  async function loadFile(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Choose an XML file smaller than 2 MB.");
      return;
    }
    try {
      setInput(await file.text());
      setFileName(file.name);
      setOutput("");
      setError("");
    } catch {
      setError("The selected file could not be read. Try another XML file.");
    }
  }

  async function copyCsv() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Clipboard access failed. Select the CSV result and copy it manually.");
    }
  }

  function downloadCsv() {
    const blob = new Blob(["\\uFEFF", output], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = (fileName.replace(/\\.xml$/i, "") || "pictospec-xml-export") + ".csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ maxWidth: 940, margin: "40px auto", padding: 20, color: "#17251e" }}>
      <div className="tool-page-top">
        <a href="/" style={{ color: "#14634b", fontWeight: 700, textDecoration: "none" }}>← PicToSpec home</a>
        <ToolSearch />
      </div>

      <p style={{ fontSize: 11, letterSpacing: 2, color: "#14634b", fontWeight: 800, marginTop: 35 }}>FREE XML DATA CONVERTER</p>
      <h1 style={{ fontSize: "clamp(32px,6vw,46px)", letterSpacing: -1.5, margin: "10px 0" }}>
        XML to CSV Converter Online
      </h1>
      <p style={{ color: "#66776d", lineHeight: 1.7 }}>
        Convert an XML file or pasted XML data into CSV rows and columns. Export repeated XML records,
        element values, attributes and nested paths to a spreadsheet-ready CSV file. Your data stays in your browser.
      </p>

      <section style={{ marginTop: 22, padding: 16, border: "1px solid #dce7df", borderRadius: 12, background: "#f7faf7" }}>
        <b>Upload an XML file</b>
        <p style={{ color: "#66776d", fontSize: 13, margin: "6px 0 12px" }}>Choose a .xml file (up to 2 MB), or paste XML in the editor below.</p>
        <input aria-label="Choose XML file" type="file" accept=".xml,text/xml,application/xml" onChange={(event) => void loadFile(event.target.files?.[0])} />
        {fileName && <p style={{ color: "#14634b", fontSize: 12, marginBottom: 0 }}>Loaded: {fileName}</p>}
      </section>

      <label htmlFor="xml-source" style={{ display: "block", fontWeight: 700, marginTop: 22 }}>Paste XML data</label>
      <textarea id="xml-source" aria-label="XML input" value={input}
        onChange={(event) => { setInput(event.target.value); setOutput(""); setError(""); }}
        rows={13} spellCheck={false}
        style={{ width: "100%", marginTop: 9, padding: 15, border: "1px solid #dce7df", borderRadius: 12, fontSize: 14, lineHeight: 1.6, fontFamily: "monospace" }}
      />

      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={convert} style={button}>Convert XML to CSV</button>
        <button onClick={() => { setInput(SAMPLE_XML); setFileName(""); setOutput(""); setError(""); }} style={secondary}>Load XML example</button>
        <button onClick={() => { setInput(""); setFileName(""); setOutput(""); setError(""); }} style={secondary}>Clear</button>
      </div>

      {error && <p role="alert" style={{ color: "#b42318", lineHeight: 1.6 }}>{error}</p>}

      {output && (
        <section style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div><b>CSV conversion result</b><p style={{ margin: "5px 0", color: "#66776d", fontSize: 12 }}>{stats.rowCount} data rows · {stats.columnCount} columns</p></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => void copyCsv()} style={secondary}>Copy CSV</button>
              <button onClick={downloadCsv} style={button}>Download CSV ↓</button>
            </div>
          </div>
          <textarea aria-label="CSV output" readOnly value={output}
            rows={Math.min(18, Math.max(5, output.split("\\n").length))}
            style={{ width: "100%", marginTop: 10, padding: 14, border: "1px solid #dce7df", borderRadius: 10, fontSize: 14, lineHeight: 1.6, fontFamily: "monospace" }}
          />
        </section>
      )}

      <p style={{ fontSize: 12, color: "#718078", lineHeight: 1.7, marginTop: 22 }}>
        Privacy: XML parsing and CSV conversion run locally in this browser. The selected file is not uploaded.
        For safety, DOCTYPE and custom entity declarations are rejected.
      </p>

      <section className="tool-content" style={{ lineHeight: 1.8 }}>
        <h2>Convert XML data into CSV rows and columns</h2>
        <p>
          XML stores information in nested elements and attributes, while CSV stores tabular data in rows and columns.
          This free XML to CSV converter turns repeated records in an XML document into spreadsheet rows. Element names
          become column headings, XML attributes are included with an @ prefix, and nested element paths use dot notation.
        </p>

        <h2>How to convert an XML file to CSV</h2>
        <ol>
          <li>Upload an XML file under 2 MB, or paste XML content into the input box.</li>
          <li>Make sure the document has one root element and well-formed opening and closing tags.</li>
          <li>Select <strong>Convert XML to CSV</strong> to create a table from the XML records.</li>
          <li>Review the row and column count and inspect the CSV output.</li>
          <li>Copy the CSV or download it, then open it in Excel, Google Sheets or another spreadsheet application.</li>
        </ol>

        <h2>XML to CSV example</h2>
        <p>For example, repeated product elements become separate CSV rows. The product id attribute becomes an @id column.</p>
        <pre style={{ overflowX: "auto", padding: 14, background: "#f6f9f6", borderRadius: 10 }}><code>{SAMPLE_XML}</code></pre>
        <p><strong>Example CSV columns:</strong> @id, name, price and category. A value containing a comma is quoted and embedded quotation marks are escaped according to CSV rules.</p>

        <h2>What happens to XML attributes and nested elements?</h2>
        <ul>
          <li><strong>XML attributes:</strong> exported as columns with an @ prefix, such as @id.</li>
          <li><strong>Nested elements:</strong> represented by dotted paths, such as customer.name.</li>
          <li><strong>Repeated records:</strong> repeated sibling elements with the same tag name become individual CSV rows.</li>
          <li><strong>Repeated nested elements:</strong> kept as JSON text inside one CSV cell so values are not silently discarded.</li>
          <li><strong>Empty elements:</strong> represented as empty CSV cells.</li>
        </ul>

        <h2>Open the converted CSV in Excel or Google Sheets</h2>
        <p>
          Download the .csv file and open it with Microsoft Excel, Google Sheets, LibreOffice Calc or another spreadsheet
          program. CSV is a plain-text table format; it does not preserve XML hierarchy, cell formatting, formulas or
          multiple worksheets. Check dates, long numbers and leading zeros after importing because spreadsheet software
          may automatically interpret cell values.
        </p>

        <h2>XML to CSV vs XML to Excel (XLSX)</h2>
        <p>
          CSV is useful when you need a simple portable table that can be opened by many spreadsheet applications or
          imported into databases. XLSX is an Excel workbook format that can store formatting, formulas and multiple
          sheets. This tool creates CSV text, not an XLSX workbook. If you need an Excel workbook, open the downloaded
          CSV in Excel and save it as .xlsx.
        </p>

        <h2>Privacy and XML conversion limitations</h2>
        <p>
          Conversion happens in the browser using the built-in XML parser. The tool does not upload your XML to a
          PicToSpec processing server, execute XML content or fetch external entities. DOCTYPE and custom entity
          declarations are rejected. XML namespaces remain part of element names, and complex mixed content may need
          manual review. Repeated nested values are stored as JSON text in a CSV cell rather than expanded into extra rows.
        </p>

        <h2>Frequently asked questions about XML to CSV</h2>
        <details><summary>How do I convert an XML file to CSV online?</summary><p>Upload a .xml file or paste XML data, select Convert XML to CSV, review the generated rows and columns, then copy or download the CSV file. Conversion runs in your browser.</p></details>
        <details><summary>Can I convert XML to CSV for Excel?</summary><p>Yes. Download the CSV file and open it in Microsoft Excel or Google Sheets. CSV contains tabular values, not Excel formatting or multiple worksheets.</p></details>
        <details><summary>Does this XML to CSV converter include attributes?</summary><p>Yes. XML attributes are included as columns with an @ prefix. For example, an id attribute becomes @id.</p></details>
        <details><summary>How are repeated XML elements converted into rows?</summary><p>When the XML root contains sibling records with the same element name, each repeated element is treated as one CSV row. Child elements and attributes supply the columns.</p></details>
        <details><summary>How does the converter handle nested XML elements?</summary><p>Nested element names are represented as dotted column paths such as order.customer.name. Repeated nested elements are represented as JSON text inside one cell.</p></details>
        <details><summary>Can I convert a large XML file?</summary><p>This page accepts XML files up to 2 MB to keep browser processing responsive. For larger XML documents, split the source into smaller well-formed files before converting.</p></details>
        <details><summary>Is my XML data uploaded or stored?</summary><p>No. The selected file and pasted XML are processed locally in your browser and are not sent to a PicToSpec conversion server.</p></details>
        <details><summary>Why does my XML file show an invalid XML error?</summary><p>XML must be well-formed: tags need matching closing tags, elements must be nested correctly, and the document must have one root element. Remove unsupported DOCTYPE or custom entity declarations and try again.</p></details>
        <details><summary>Does XML to CSV preserve the original XML structure?</summary><p>No. CSV is a flat table and cannot preserve every XML feature. Nested repeated values are placed in JSON text within a cell; namespaces and mixed content may require manual review.</p></details>

        <h2>Related data conversion tools</h2>
        <ul>
          <li><a href="/xml-to-json-converter">XML to JSON Converter</a> — convert XML elements into JSON data.</li>
          <li><a href="/json-to-csv-converter">JSON to CSV Converter</a> — export JSON records as CSV rows.</li>
          <li><a href="/csv-json-converter">CSV to JSON Converter</a> — convert spreadsheet-style CSV into JSON.</li>
          <li><a href="/json-formatter">JSON Formatter</a> — format and inspect JSON data.</li>
        </ul>
      </section>
    </main>
  );
}
