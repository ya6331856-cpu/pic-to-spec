import type { Metadata } from "next";
import DataCompareTool from "@/components/DataCompareTool";
import ToolSeoContent from "@/components/ToolSeoContent";

const title = "SQL to JSON Converter – Convert SQL INSERT Statements Online";
const description =
  "Convert supported SQL INSERT statements to JSON online. Parse multiple VALUES rows, quoted text, numbers, NULL and boolean values into JSON records in your browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sql-to-json-converter" },
  openGraph: {
    title: "SQL to JSON Converter Online | PicToSpec",
    description:
      "Turn supported SQL INSERT statements into JSON records. Review multiple rows and download or copy the result.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SQL to JSON Converter Online | PicToSpec",
    description:
      "Convert supported SQL INSERT statements and VALUES rows into JSON in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <DataCompareTool mode="sql-json" />
      <ToolSeoContent
        path="/sql-to-json-converter"
        title="SQL to JSON Converter"
        intro="Convert supported SQL INSERT statements into JSON records without connecting to or changing a database. Paste INSERT INTO statements with an explicit table name, column list and literal VALUES tuples. The converter groups the parsed records by table name so you can inspect and reuse the JSON output."
        steps={[
          "Copy the SQL INSERT statements you want to convert. Use statements with an explicit table name and column list.",
          "Paste one or more statements into the SQL input area above. Each VALUES tuple must contain the same number of values as the listed columns.",
          "Run the SQL to JSON conversion and review the generated object, property names and data types.",
          "Copy the JSON output or download it, then validate it in the application or workflow where you plan to use it."
        ]}
        exampleTitle="SQL INSERT to JSON example"
        example={
          <>
            <p>Supported SQL input with two rows:</p>
            <pre><code>{`INSERT INTO users (id, name, active) VALUES
(1, 'Aisha', TRUE),
(2, 'Rahul', FALSE);`}</code></pre>
            <p>Illustrative JSON result:</p>
            <pre><code>{`{
  "users": [
    { "id": 1, "name": "Aisha", "active": true },
    { "id": 2, "name": "Rahul", "active": false }
  ]
}`}</code></pre>
            <p>Quoted SQL strings become JSON strings, numeric literals remain numbers, and TRUE or FALSE become JSON booleans.</p>
          </>
        }
        limitations="This is a focused SQL INSERT-values parser, not a full SQL engine or database connection. It supports INSERT INTO statements with explicit columns and literal VALUES tuples, including quoted strings, numeric values, NULL, TRUE and FALSE. It does not execute SQL or evaluate SELECT queries, SQL functions, expressions, subqueries, DEFAULT clauses or every database dialect. NULL is represented as JSON null. Review the output before importing it into another system."
        faqs={[
          {
            question: "How do I convert SQL INSERT statements to JSON?",
            answer: "Paste an INSERT INTO statement that includes a table name, explicit column names and VALUES tuples. Run the converter, inspect the JSON records and copy or download the result."
          },
          {
            question: "Can I convert multiple SQL INSERT rows at once?",
            answer: "Yes. A VALUES clause can contain multiple comma-separated tuples, and the input can contain multiple supported INSERT statements. Each tuple must match the number of columns."
          },
          {
            question: "Does the SQL to JSON converter connect to my database?",
            answer: "No. It parses the SQL text provided in the browser. It does not connect to a database, execute a query or modify database records."
          },
          {
            question: "How are SQL NULL and boolean values converted?",
            answer: "SQL NULL is represented as JSON null. TRUE and FALSE are represented as JSON boolean values. Quoted values are treated as strings."
          },
          {
            question: "Can I convert a SELECT query or JOIN to JSON?",
            answer: "No. This tool handles a defined subset of INSERT statements with literal VALUES. SELECT queries, JOINs, subqueries and database execution are not supported."
          },
          {
            question: "Are SQL functions and expressions supported?",
            answer: "No. The converter does not evaluate expressions such as NOW(), arithmetic, DEFAULT clauses or subqueries. Use literal values in the VALUES tuples."
          },
          {
            question: "Why does my SQL statement fail to convert?",
            answer: "Check that the statement uses INSERT INTO, an explicit column list and VALUES tuples. Confirm that every tuple has the same number of values as the column list and that strings are correctly quoted."
          },
          {
            question: "Is my SQL data uploaded to a server?",
            answer: "The conversion is performed by the browser-side tool and does not require a database connection. Avoid using shared devices for confidential SQL dumps and review the page's privacy information before processing sensitive data."
          }
        ]}
        related={[
          { label: "JSON Formatter and Validator", href: "/json-formatter" },
          { label: "JSON Diff Tool", href: "/json-diff" },
          { label: "CSV to JSON Converter", href: "/csv-json-converter" },
          { label: "JSON to CSV Converter", href: "/json-to-csv-converter" }
        ]}
      />
    </>
  );
}
