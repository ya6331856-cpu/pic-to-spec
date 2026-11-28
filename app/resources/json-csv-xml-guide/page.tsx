import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON vs CSV vs XML: Data Format Comparison | PicToSpec",
  description:
    "Understand the differences between JSON, CSV and XML. Compare structure, nested data, spreadsheet compatibility and common use cases before converting files.",
  alternates: { canonical: "/resources/json-csv-xml-guide" },
  openGraph: {
    title: "JSON vs CSV vs XML: Data Format Comparison | PicToSpec",
    description:
      "A practical guide to choosing JSON, CSV or XML for data exchange, spreadsheets and structured documents.",
    type: "article",
    url: "https://pictospec.com/resources/json-csv-xml-guide",
  },
  twitter: {
    card: "summary",
    title: "JSON vs CSV vs XML Guide | PicToSpec",
    description: "Compare three common data formats and choose the right one for your task.",
  },
};

const examples = [
  {
    name: "JSON",
    sample: '{\n  "name": "Asha",\n  "skills": ["HTML", "CSS"]\n}',
    structure: "Objects, arrays, strings, numbers, booleans and null",
    suitable: "APIs, application data, configuration and nested records",
    caution: "A JSON document must follow strict syntax; comments and trailing commas are not valid in standard JSON.",
  },
  {
    name: "CSV",
    sample: 'name,city\nAsha,Mumbai\nRavi,Delhi',
    structure: "Rows and columns of text values",
    suitable: "Tabular records, spreadsheets, imports and exports",
    caution: "CSV has no universal way to represent nested objects or data types; delimiter, quoting and encoding conventions matter.",
  },
  {
    name: "XML",
    sample: '<person>\n  <name>Asha</name>\n  <city>Mumbai</city>\n</person>',
    structure: "Nested elements, attributes and text nodes",
    suitable: "Document-style data, configuration and systems that require XML schemas",
    caution: "Namespaces, attributes and repeated elements need careful mapping when converting to a flat table.",
  },
];

export default function DataFormatsGuidePage() {
  return (
    <main className="legal">
      <a href="/resources" className="back">← All PicToSpec resources</a>
      <p className="kicker">DATA REFERENCE</p>
      <h1>JSON vs CSV vs XML: what is the difference?</h1>
      <p>
        JSON, CSV and XML are common ways to store or exchange data, but they solve different
        problems. JSON handles nested application data, CSV is convenient for tables, and XML
        represents structured documents with elements and attributes. The right choice depends
        on the shape of your data and the software that needs to read it.
      </p>

      <h2>At a glance</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Format</th><th>Data structure</th><th>Common uses</th><th>Important limitation</th></tr></thead>
          <tbody>
            {examples.map((item) => (
              <tr key={item.name}>
                <th scope="row">{item.name}</th>
                <td>{item.structure}</td>
                <td>{item.suitable}</td>
                <td>{item.caution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>JSON example</h2>
      <p>JSON (JavaScript Object Notation) represents data using objects and arrays. It is common in web APIs because it can express nested records and has a straightforward mapping to common programming-language data structures.</p>
      <pre><code>{examples[0].sample}</code></pre>

      <h2>CSV example</h2>
      <p>CSV (Comma-Separated Values) stores tabular data as records and fields. It is useful when each row represents a similar kind of record and users need to open the data in spreadsheet software. Values containing commas, quotes or line breaks must be escaped according to the CSV dialect being used.</p>
      <pre><code>{examples[1].sample}</code></pre>

      <h2>XML example</h2>
      <p>XML (Extensible Markup Language) represents information with nested elements and optional attributes. It is still used in document formats, integrations and systems that depend on XML schemas or namespaces.</p>
      <pre><code>{examples[2].sample}</code></pre>

      <h2>Which format should you use?</h2>
      <ul>
        <li><strong>Choose JSON</strong> when data contains nested objects or arrays, or when exchanging data with a modern web API.</li>
        <li><strong>Choose CSV</strong> when the information is naturally a flat table and needs to be reviewed or edited in a spreadsheet.</li>
        <li><strong>Choose XML</strong> when a receiving system requires XML, or when document structure, attributes, namespaces or schema validation are important.</li>
      </ul>

      <h2>What changes when you convert between formats?</h2>
      <p>
        Conversion is not always a one-to-one translation. A nested JSON object may need to be
        flattened into columns for CSV. XML attributes and repeated elements need explicit
        mapping. CSV values are usually text, so converting them to JSON does not automatically
        tell the converter whether a value such as 00123 is an identifier or a number. Review
        column names, empty values, repeated records and data types after conversion.
      </p>

      <h2>Try the related PicToSpec tools</h2>
      <ul>
        <li><a href="/json-formatter">JSON Formatter &amp; Validator</a> — format JSON and check its syntax.</li>
        <li><a href="/json-diff">JSON Diff</a> — compare two JSON documents.</li>
        <li><a href="/csv-json-converter">CSV to JSON Converter</a> — turn tabular CSV records into JSON.</li>
        <li><a href="/json-to-csv-converter">JSON to CSV Converter</a> — export suitable JSON records as CSV.</li>
        <li><a href="/xml-to-csv-converter">XML to CSV Converter</a> — map XML records into spreadsheet-ready rows.</li>
        <li><a href="/xml-to-json-converter">XML to JSON Converter</a> — convert XML data into JSON.</li>
      </ul>

      <h2>Frequently asked questions</h2>
      <h3>Is JSON better than CSV?</h3>
      <p>Neither is universally better. JSON is more suitable for nested structured data, while CSV is simpler for flat tables and spreadsheet workflows.</p>
      <h3>Can CSV store nested data?</h3>
      <p>CSV has rows and columns but no standard nested-object model. Nested data must be flattened or encoded into individual cells using an agreed convention.</p>
      <h3>Does converting XML to CSV preserve everything?</h3>
      <p>Not necessarily. Attributes, namespaces, repeated elements and nested structures may need mapping decisions before they fit into rows and columns.</p>
      <h3>Which format is easiest to read?</h3>
      <p>For a simple table, CSV is easy to scan. For nested application data, JSON is often easier to work with. XML can be clear for document-like structures but may be more verbose.</p>

      <p><a href="/resources">Browse all reference guides</a> · <a href="/about">About PicToSpec</a> · <a href="/">Browse free tools</a></p>
    </main>
  );
}
