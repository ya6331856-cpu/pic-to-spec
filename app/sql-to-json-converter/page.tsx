import type { Metadata } from "next";
import DataCompareTool from "@/components/DataCompareTool";
import ToolSeoContent from "@/components/ToolSeoContent";

export const metadata: Metadata = {
  title: "SQL to JSON Converter – Convert INSERT Statements Online",
  description:
    "Convert supported SQL INSERT statements into JSON records online. Handles multiple VALUES rows, quoted strings, numbers, NULL and boolean literals in your browser.",
  alternates: { canonical: "/sql-to-json-converter" },
};

export default function Page() {
  return (
    <>
      <DataCompareTool mode="sql-json" />
      <ToolSeoContent
        path="/sql-to-json-converter"
        title="SQL to JSON Converter"
        intro="Convert basic SQL INSERT statements into JSON without running a database query. Paste an INSERT statement with an explicit table name, column list and VALUES rows. PicToSpec reads the supported literals and groups the resulting records by table name in a JSON object."
        steps={[
          "Paste one or more INSERT INTO statements into the SQL input area.",
          "Include a table name, an explicit list of columns and one or more VALUES tuples.",
          "Run the conversion and review the JSON output. Check that every VALUES tuple contains the same number of values as the column list.",
          "Copy the JSON or download it as a .json file, then validate it in the application that will use it.",
        ]}
        example={
          <>
            <p>Supported example input:</p>
            <pre><code>{`INSERT INTO users (id, name, active) VALUES
(1, 'Aisha', TRUE),
(2, 'Rahul', FALSE);`}</code></pre>
            <p>The result is grouped under the table name:</p>
            <pre><code>{`{
  "users": [
    { "id": 1, "name": "Aisha", "active": true },
    { "id": 2, "name": "Rahul", "active": false }
  ]
}`}</code></pre>
          </>
        }
        limitations="This is a focused INSERT-values converter, not a SQL database engine. It supports INSERT INTO statements with explicit columns and VALUES tuples, including quoted strings, numeric values, NULL, TRUE and FALSE. It does not execute SQL or evaluate SELECT queries, functions, expressions, subqueries, DEFAULT clauses or dialect-specific syntax. Check the generated JSON before importing it into another system."
        faqs={[
          {
            question: "Can I convert multiple SQL INSERT rows at once?",
            answer:
              "Yes. A VALUES clause can contain multiple comma-separated tuples, and the input can contain multiple INSERT statements. Each tuple must match the number of listed columns.",
          },
          {
            question: "Does this tool connect to or run my database?",
            answer:
              "No. It only parses the supported INSERT text in your browser. It does not connect to a database, execute SQL or change any records.",
          },
          {
            question: "Which SQL values are supported?",
            answer:
              "The converter handles quoted strings, numeric literals, hexadecimal numeric literals, NULL, TRUE and FALSE. SQL functions, expressions and subqueries are not evaluated.",
          },
          {
            question: "What if my SQL statement uses DEFAULT or SELECT?",
            answer:
              "Those forms are outside this converter's supported subset. Use INSERT statements with explicit column names and literal VALUES, or convert the data with a database tool that understands your SQL dialect.",
          },
        ]}
        related={[
          { label: "JSON Formatter and Validator", href: "/json-formatter" },
          { label: "JSON Diff Tool", href: "/json-diff" },
          { label: "CSV to JSON Converter", href: "/csv-json-converter" },
        ]}
      />
    </>
  );
}
