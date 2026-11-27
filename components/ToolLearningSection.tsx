"use client";

type ToolKey = "json-diff" | "sql-to-json" | "json-to-xml" | "xml-to-json" | "json-to-yaml" | "json-validator" | "html-to-markdown";
type RelatedItem = { href: string; title: string; description: string };
type Guide = {
  heading: string; intro: string; example: string; steps: string[];
  limitations: string[]; faqs: { q: string; a: string }[]; related: RelatedItem[];
};

export function RelatedToolLinks({ items, heading = "Related tools" }: { items: RelatedItem[]; heading?: string }) {
  if (!items.length) return null;
  return <section className="tool-content related-tools">
    <h2>{heading}</h2>
    <ul>{items.map(item => <li key={item.href}><a href={item.href}>{item.title}</a> — {item.description}</li>)}</ul>
  </section>;
}

const guides: Record<ToolKey, Guide> = {
  "json-diff": {
    heading: "How to compare two JSON documents",
    intro: "A JSON diff compares two valid JSON values as data structures. It reports added, removed and changed values with paths such as $.profile.city or $.items[1]. This is useful when reviewing API responses, configuration updates and data exports.",
    example: 'Original: {"name":"Asha","skills":["HTML","CSS"],"active":true}\nUpdated: {"name":"Asha","skills":["HTML","TypeScript"],"city":"Pune","active":true}\nThe comparison reports an added city property and a changed value at skills[1].',
    steps: ["Paste the earlier JSON document into Original JSON.", "Paste the newer document into Updated JSON.", "Review the difference count and inspect each added, removed or changed path.", "Copy the difference report for a code review or issue."],
    limitations: ["Both inputs must be valid JSON. Whitespace and object-key order do not count as changes.", "Array order matters. Moving an item can produce a difference even when the same values remain.", "JSON types are significant: the number 1 and the string \"1\" are different. This is a structural comparison, not a JSON Schema validator or a line-by-line text diff."],
    faqs: [{q:"Does it compare nested objects and arrays?",a:"Yes. Nested objects and arrays are compared recursively, and each difference is shown with its path."},{q:"Why is a value marked changed when it looks similar?",a:"JSON types matter. For example, true, \"true\", 1 and \"1\" are different values."}],
    related: [{href:"/json-validator",title:"JSON Validator",description:"Check syntax before comparing documents."},{href:"/json-formatter",title:"JSON Formatter",description:"Beautify or minify JSON for easier review."},{href:"/json-to-excel-converter",title:"JSON to Excel",description:"Export arrays of records to an XLSX workbook."}]
  },
  "sql-to-json": {
    heading: "Convert SQL INSERT statements into JSON records",
    intro: "This converter reads a limited subset of SQL: INSERT INTO table (columns) VALUES (...). It turns column names and row values into JSON records grouped by table name. It is intended for inspecting sample data and preparing simple fixtures, not for running database queries.",
    example: "INSERT INTO users (id, name, active) VALUES\n(1, 'Asha', TRUE),\n(2, 'Ravi', FALSE);\n\nThe output contains a users array with one object for each row.",
    steps: ["Paste one or more INSERT INTO statements.", "Include a column list so every value has a property name.", "Select Convert and review the parsed JSON records.", "Copy or download the JSON, then validate it before importing elsewhere."],
    limitations: ["Supported values include quoted strings, numbers, NULL, TRUE and FALSE. Multiple rows and INSERT statements are supported.", "This is not a SQL database engine. It does not execute queries or evaluate functions, arithmetic expressions, subqueries, DEFAULT values or dialect-specific syntax.", "Review strings containing quotes and backslashes, and compare the output with a trusted source export before production use."],
    faqs: [{q:"Can I convert SELECT or JOIN queries?",a:"No. The parser accepts INSERT INTO ... VALUES statements only; it does not execute SELECT, JOIN or other SQL queries."},{q:"Does this connect to a database?",a:"No. The statement is parsed locally in your browser. No database connection or SQL execution takes place."}],
    related: [{href:"/json-formatter",title:"JSON Formatter",description:"Format the generated JSON for inspection."},{href:"/json-validator",title:"JSON Validator",description:"Check the output's JSON syntax."},{href:"/json-to-csv-converter",title:"JSON to CSV",description:"Turn records into spreadsheet-ready CSV."}]
  },
  "json-to-xml": {
    heading: "How JSON to XML conversion works",
    intro: "JSON and XML represent structured data differently. This converter maps JSON object properties to XML elements and uses your selected root element as the document wrapper. Nested objects become nested elements, while array entries are written as repeated item elements.",
    example: 'JSON: {"person":{"name":"Asha","active":true,"skills":["HTML","CSS"]}}\nWith root element "root", the result contains root/person/name, root/person/active and repeated skills/item elements.',
    steps: ["Paste a valid JSON object or array.", "Choose a valid XML root element name, such as root or records.", "Select Convert to XML and inspect the result.", "Copy or download the XML, then test it with the application that will consume it."],
    limitations: ["Element names must start with a letter or underscore and may contain letters, numbers, underscores, dots and hyphens.", "Text values are escaped. Numbers and booleans are represented as text; null values produce empty elements.", "This converter does not generate an XSD schema, infer namespaces or guarantee compatibility with a third-party XML format."],
    faqs: [{q:"How are JSON arrays represented?",a:"Array values are emitted as repeated item elements under the relevant parent element."},{q:"Can I choose the XML root tag?",a:"Yes. Enter a valid root element name in the XML root element field before converting."}],
    related: [{href:"/xml-formatter",title:"XML Formatter",description:"Validate and indent XML markup."},{href:"/xml-to-json-converter",title:"XML to JSON",description:"Convert XML elements and attributes back into JSON."},{href:"/json-validator",title:"JSON Validator",description:"Check source JSON syntax before conversion."}]
  },
  "xml-to-json": {
    heading: "How XML to JSON conversion works",
    intro: "This converter parses an XML document and represents its root element as a JSON object. Child elements become properties, repeated sibling elements become arrays, and XML attributes are preserved in an @attributes object. Mixed text content is stored under #text.",
    example: 'For <item id="7"><name>Notebook</name><tag>school</tag><tag>paper</tag></item>, id is stored under @attributes and the repeated tag elements become an array.',
    steps: ["Paste a complete XML document with one root element.", "Select Load sample to see the expected structure.", "Review how attributes and repeated elements appear in the JSON output.", "Copy or download the JSON and validate it against your application's expected schema."],
    limitations: ["Attributes are grouped under @attributes. Repeated elements become arrays, and mixed text is stored under #text.", "XML namespaces remain part of element names. The tool does not infer a separate JSON Schema or application-specific data types.", "DOCTYPE and custom ENTITY declarations are rejected. The XML is parsed locally and external entities are not fetched."],
    faqs: [{q:"What happens when an XML element repeats?",a:"Repeated sibling elements with the same tag name become an array in the JSON output."},{q:"Where do XML attributes appear?",a:"Attributes are grouped in an @attributes object on the element they belong to."}],
    related: [{href:"/xml-formatter",title:"XML Formatter",description:"Check and format XML before converting."},{href:"/json-formatter",title:"JSON Formatter",description:"Make the resulting JSON easier to read."},{href:"/json-to-yaml-converter",title:"JSON to YAML",description:"Convert JSON data into readable YAML."}]
  },
  "json-to-yaml": {
    heading: "Convert standard JSON data into YAML",
    intro: "YAML is often used for readable configuration files, while JSON is common in APIs and data exchange. This tool converts JSON objects and arrays into YAML while preserving strings, numbers, booleans, null values and nested structures.",
    example: 'JSON: {"service":{"name":"web","replicas":2},"enabled":true}\nThe YAML output uses indentation for the nested service object and keeps enabled as a boolean.',
    steps: ["Paste valid JSON or load the sample data.", "Select Convert to YAML and check the output structure.", "Copy the YAML or download the .yaml file.", "Validate it with the parser used by your application before deploying configuration."],
    limitations: ["The input must be valid JSON. JSON has no comments, dates, custom tags or YAML-specific features, so these cannot be carried over.", "String keys and values are quoted to avoid ambiguity with values such as true, false, numbers and null.", "This is a format converter, not a YAML schema validator. Use the target platform's validation process too."],
    faqs: [{q:"Can it convert nested objects and arrays?",a:"Yes. Nested objects and arrays are converted into indented YAML structures."},{q:"Does it preserve comments from JSON?",a:"JSON does not support comments, so there are no source comments to preserve."}],
    related: [{href:"/json-validator",title:"JSON Validator",description:"Check JSON syntax before conversion."},{href:"/yaml-validator",title:"YAML Validator",description:"Check common YAML indentation and mapping issues."},{href:"/json-to-xml-converter",title:"JSON to XML",description:"Convert structured JSON to XML when needed."}]
  },
  "json-validator": {
    heading: "Validate JSON syntax and locate parsing errors",
    intro: "JSON Validator checks whether your input follows JSON syntax. If parsing succeeds, it displays a consistently indented version. If parsing fails, the browser's parser message is shown and a line and column are extracted when the error includes a character position.",
    example: 'Valid: {"name":"Asha","active":true}\nInvalid: {name:"Asha"}\nThe invalid example omits the required double quotes around the property name.',
    steps: ["Paste a JSON value into the input area.", "Select Validate JSON to parse the document.", "If valid, review and copy the formatted JSON.", "If an error appears, check the indicated line and column, then validate again."],
    limitations: ["Property names and string values use double quotes. JSON does not allow comments, trailing commas, single-quoted strings or undefined values.", "The validator checks syntax only. It does not check required fields, JSON Schema rules or whether an API accepts the data.", "Validation runs locally in your browser. Avoid pasting private credentials on shared devices."],
    faqs: [{q:"Does valid JSON mean my API data is correct?",a:"Not necessarily. Syntax validation confirms valid JSON, but an API may require specific fields, types or schema rules."},{q:"Why are single quotes rejected?",a:"JSON strings and property names must use double quotation marks."}],
    related: [{href:"/json-formatter",title:"JSON Formatter",description:"Beautify or minify JSON after validation."},{href:"/json-diff",title:"JSON Diff",description:"Compare a valid JSON value with another document."},{href:"/json-to-excel-converter",title:"JSON to Excel",description:"Export arrays of objects to an XLSX workbook."}]
  },
  "html-to-markdown": {
    heading: "Convert HTML structure into readable Markdown",
    intro: "Markdown is a lightweight text format often used in README files, documentation, notes and content systems. This converter reads the HTML markup you paste and maps common structural elements into Markdown syntax without running HTML or its scripts.",
    example: "HTML: <h2>Getting started</h2><p>Use <strong>Markdown</strong> for docs.</p><ul><li>Install</li><li>Configure</li></ul>\nMarkdown: ## Getting started\n\nUse **Markdown** for docs.\n\n- Install\n- Configure",
    steps: ["Paste the HTML markup into HTML input.", "Review headings, lists, links, code blocks and tables in the Markdown output.", "Select Copy Markdown or Download .md.", "Preview the downloaded Markdown in the documentation platform where you plan to publish it."],
    limitations: ["Common headings, paragraphs, bold and italic text, links, images, lists, blockquotes, horizontal rules, code blocks and basic tables are supported.", "Script, style, noscript, template, SVG, iframe and object elements are removed. Links and image sources are retained only for safe HTTP, HTTPS, mailto or same-site relative URLs.", "The converter does not render CSS or reproduce a webpage's visual layout. Complex layouts, embedded widgets and styling may need manual editing."],
    faqs: [{q:"Does it run JavaScript inside the HTML?",a:"No. It reads markup only; scripts and embedded active content are not executed."},{q:"Will Markdown look exactly like the original web page?",a:"No. Markdown represents document structure and basic formatting, not the full CSS layout or visual design."}],
    related: [{href:"/markdown-preview",title:"Markdown Previewer",description:"Preview headings, lists, links and code blocks."},{href:"/html-formatter",title:"HTML Formatter",description:"Format markup with readable indentation."},{href:"/html-minifier",title:"HTML Minifier",description:"Remove unnecessary markup whitespace and comments."}]
  }
};

export default function ToolLearningSection({ tool }: { tool: ToolKey }) {
  const guide = guides[tool];
  return <>
    <section className="tool-content">
      <h2>{guide.heading}</h2>
      <p>{guide.intro}</p>
      <h3>Example</h3>
      <pre><code>{guide.example}</code></pre>
      <h3>How to use this tool</h3>
      <ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <h3>Supported behavior and limitations</h3>
      <ul>{guide.limitations.map(item => <li key={item}>{item}</li>)}</ul>
      <h3>Frequently asked questions</h3>
      {guide.faqs.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
    </section>
    <RelatedToolLinks items={guide.related} />
  </>;
}
