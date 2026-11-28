export default function JsonDiffGuide() {
  return (
    <section className="tool-content json-diff-guide" aria-label="JSON comparison and diff guide">
      <div className="json-diff-guide-intro">
        <p className="kicker">JSON COMPARE & STRUCTURAL DIFF GUIDE</p>
        <h2>JSON Diff Tool – Compare Two JSON Documents and Find Every Change</h2>
        <p className="lead">
          Need to check what changed between two API responses, configuration files or exported
          records? A JSON diff compares the data structure rather than the lines of text. PicToSpec
          identifies added, removed, changed and type-changed values, then shows where each
          difference lives in the JSON document.
        </p>
        <p>
          Paste an original value and an updated value into the two editors above. The comparison
          runs in your browser and provides readable paths plus JSON Pointer paths that can be
          copied into bug reports, test notes and developer workflows.
        </p>
      </div>

      <nav className="json-diff-toc" aria-label="On this page">
        <h3>On this page</h3>
        <ol>
          <li><a href="#what-is-json-diff">What is a JSON diff?</a></li>
          <li><a href="#json-diff-vs-text-diff">JSON diff vs text diff</a></li>
          <li><a href="#difference-types">Added, removed, changed and type-changed values</a></li>
          <li><a href="#json-paths">Readable paths and JSON Pointer</a></li>
          <li><a href="#how-to-compare-json">How to compare JSON online</a></li>
          <li><a href="#comparison-rules">How the comparison works</a></li>
          <li><a href="#json-diff-use-cases">Common developer use cases</a></li>
          <li><a href="#json-diff-limitations">Important limitations</a></li>
          <li><a href="#json-diff-faqs">Frequently asked questions</a></li>
        </ol>
      </nav>

      <section id="what-is-json-diff">
        <h2>What is a JSON diff?</h2>
        <p>
          JSON (JavaScript Object Notation) is a text format used to exchange structured data.
          Objects contain named properties, arrays contain ordered items, and values can be
          strings, numbers, booleans, null, objects or arrays.
        </p>
        <p>
          A <strong>JSON diff</strong> is a comparison between two parsed JSON values. It helps you
          find which properties were added or removed, which values changed, and which values
          changed type. Instead of showing every line that moved, a structural diff reports the
          exact location of each data difference.
        </p>
        <p>
          This is useful when two JSON files have different indentation or property order but
          represent the same data. Formatting noise is ignored, while actual values and array
          positions are compared.
        </p>
      </section>

      <section id="json-diff-vs-text-diff">
        <h2>JSON diff vs text diff: what is the difference?</h2>
        <p>
          A text diff compares characters or lines in two text documents. A JSON diff first parses
          both inputs as JSON, then compares their structure and values. Because the two methods
          answer different questions, use the one that matches the data you need to inspect.
        </p>
        <div className="json-diff-table-wrap">
          <table>
            <thead><tr><th>Comparison</th><th>JSON structural diff</th><th>Text diff</th></tr></thead>
            <tbody>
              <tr><td>Indentation and whitespace</td><td>Ignored after parsing</td><td>Can appear as a line change</td></tr>
              <tr><td>Object property order</td><td>Ignored</td><td>Can appear as a line change</td></tr>
              <tr><td>Nested values</td><td>Compared recursively</td><td>Compared as text lines or characters</td></tr>
              <tr><td>Array order</td><td>Compared by index in this tool</td><td>Depends on the text diff</td></tr>
              <tr><td>Output</td><td>Added, removed, changed and type-changed paths</td><td>Added and removed text lines or characters</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          For example, changing a JSON document from two-space indentation to four-space
          indentation does not create a data difference here. Changing <code>"active": true</code>
          to <code>"active": false</code> does.
        </p>
      </section>

      <section id="difference-types">
        <h2>Types of JSON differences</h2>
        <p>
          PicToSpec labels each difference so you can understand what happened without reading the
          full document again.
        </p>
        <div className="json-diff-type-grid">
          <article className="is-added">
            <b>Added</b>
            <p>A property or array item exists in the updated JSON but not at the corresponding location in the original JSON.</p>
            <pre><code>{`Before: {}
After:  { "active": true }`}</code></pre>
          </article>
          <article className="is-removed">
            <b>Removed</b>
            <p>A property or array item exists in the original JSON but is missing from the updated JSON.</p>
            <pre><code>{`Before: { "role": "editor" }
After:  {}`}</code></pre>
          </article>
          <article className="is-changed">
            <b>Changed</b>
            <p>The value at the same path is different, while its JSON type remains the same.</p>
            <pre><code>{`Before: { "status": "draft" }
After:  { "status": "live" }`}</code></pre>
          </article>
          <article className="is-type">
            <b>Type changed</b>
            <p>The value at the same path has a different JSON type, such as a number becoming a string.</p>
            <pre><code>{`Before: { "id": 42 }
After:  { "id": "42" }`}</code></pre>
          </article>
        </div>
      </section>

      <section id="json-paths">
        <h2>Find a difference by JSON path or JSON Pointer</h2>
        <p>
          A useful diff must tell you where to look. PicToSpec shows a readable path such as
          <code>$.user.profile.name</code> or <code>$.items[2].price</code>. Property names containing
          spaces or punctuation are written in bracket notation so they are not confused with
          separate path segments.
        </p>
        <p>
          Each result also includes a <strong>JSON Pointer</strong>. JSON Pointer is a standard
          string format for identifying a value inside a JSON document. It starts with a slash for
          each path segment, for example <code>/user/profile/name</code> or
          <code>/items/2/price</code>. A property name containing <code>~</code> is escaped as
          <code>~0</code>, and a slash inside a property name is escaped as <code>~1</code>.
        </p>
        <p>
          The Copy pointer action copies that exact path. You can use it in a developer note,
          validation report or another system that accepts RFC 6901 JSON Pointer values. See the
          <a href="https://www.rfc-editor.org/rfc/rfc6901.html" target="_blank" rel="noreferrer">
            RFC 6901 specification
          </a>
          for the formal syntax.
        </p>
      </section>

      <section id="how-to-compare-json">
        <h2>How to compare two JSON documents online</h2>
        <ol>
          <li><strong>Paste the original:</strong> enter the earlier JSON value in the Original JSON editor.</li>
          <li><strong>Paste the updated version:</strong> enter the later value in the Updated JSON editor.</li>
          <li><strong>Check validation:</strong> the page reports which side has invalid JSON so you can fix the right input.</li>
          <li><strong>Review the summary:</strong> see the total number of differences and counts for added, removed, changed and type-changed values.</li>
          <li><strong>Filter the results:</strong> choose a difference type or search by a readable path or JSON Pointer.</li>
          <li><strong>Copy or download:</strong> copy an individual pointer, copy the full JSON report or download the report as a JSON file.</li>
        </ol>
        <p>
          Use Format original, Format updated or Format both to make pasted JSON easier to read.
          Formatting does not change the structural comparison result. Swap sides reverses the
          direction of the comparison, so an addition becomes a removal when the inputs are
          reversed.
        </p>
      </section>

      <section id="comparison-rules">
        <h2>How this JSON comparison works</h2>
        <div className="json-diff-table-wrap">
          <table>
            <thead><tr><th>JSON feature</th><th>Comparison rule</th></tr></thead>
            <tbody>
              <tr><td>Object property order</td><td>Ignored. Objects are compared by property name and value.</td></tr>
              <tr><td>Nested objects</td><td>Compared recursively, with a path for each changed value.</td></tr>
              <tr><td>Arrays</td><td>Compared by position (index). Moving an item can create differences at several indexes.</td></tr>
              <tr><td>Value types</td><td>Number, string, boolean, null, object and array types are kept distinct.</td></tr>
              <tr><td>Whitespace and indentation</td><td>Ignored after both documents are parsed as JSON.</td></tr>
              <tr><td>Invalid JSON</td><td>Comparison is paused and an input-specific parsing error is shown.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Arrays are compared by index, not by a record's <code>id</code> property. If you insert an
          item at the start of an array, later positions may be reported as changed. This version
          does not attempt to guess whether two records represent the same entity.
        </p>
      </section>

      <section id="json-diff-use-cases">
        <h2>Common uses for a JSON diff tool</h2>
        <ul>
          <li><strong>API response comparison:</strong> compare a response before and after a backend release to spot changed fields.</li>
          <li><strong>Configuration review:</strong> inspect changes to package settings, application configuration or feature flags.</li>
          <li><strong>Data migration checks:</strong> compare exported records before and after a migration or transformation.</li>
          <li><strong>Test fixtures:</strong> compare expected and actual JSON values when debugging an automated test.</li>
          <li><strong>Webhook debugging:</strong> find which fields were added or changed between two event payloads.</li>
          <li><strong>Schema and integration work:</strong> locate a changed value before deciding whether application validation rules need an update.</li>
        </ul>
        <p>
          The tool reports structural changes; it does not decide whether a change is correct or
          compatible with your application. Review the business meaning of each difference before
          deploying a configuration or API change.
        </p>
      </section>

      <section id="json-diff-limitations">
        <h2>Important limitations before comparing JSON</h2>
        <ul>
          <li>Both inputs must be valid standard JSON. Comments, trailing commas and JavaScript object literals are not accepted.</li>
          <li>Arrays are compared by index. There is no ignore-array-order or match-by-ID mode.</li>
          <li>JavaScript parses JSON numbers as Number values. Very large integers or precision-sensitive decimals may not be represented exactly; use a precision-preserving comparison workflow for those values.</li>
          <li>Duplicate property names are not preserved as separate values by the browser's JSON parser.</li>
          <li>The report records structural differences; it does not create or apply a JSON Patch, merge documents or validate an application-specific JSON Schema.</li>
        </ul>
        <p>
          Both documents are processed in your browser. The comparison does not upload them to a
          PicToSpec processing server. For confidential data, still follow your organisation's
          device and browser policies.
        </p>
      </section>

      <section id="json-diff-faqs">
        <h2>JSON Diff Tool – Frequently asked questions</h2>
        <details>
          <summary>How do I compare two JSON files online?</summary>
          <p>
            Open the JSON Diff Tool, paste the original JSON on the left and the updated JSON on the
            right. The page validates both inputs and shows structural differences with paths.
            It currently accepts pasted JSON text rather than uploading files.
          </p>
        </details>
        <details>
          <summary>Does JSON diff ignore object key order?</summary>
          <p>
            Yes. Object properties are compared by their names and values, so moving keys into a
            different order does not create a difference. Array order is different and is compared
            by index.
          </p>
        </details>
        <details>
          <summary>Can this tool compare nested JSON objects and arrays?</summary>
          <p>
            Yes. It recursively compares nested objects and array positions, then reports a
            readable location and a JSON Pointer for each difference.
          </p>
        </details>
        <details>
          <summary>What is the difference between Added, Removed and Changed?</summary>
          <p>
            Added means a value exists only in the updated JSON at that location. Removed means it
            exists only in the original JSON. Changed means the values differ while their JSON
            types are the same. Type changed means the JSON type is different.
          </p>
        </details>
        <details>
          <summary>What is a JSON Pointer?</summary>
          <p>
            JSON Pointer is a standard way to identify a value inside a JSON document. It uses
            slash-separated path segments, with special escaping for slash and tilde characters in
            property names.
          </p>
        </details>
        <details>
          <summary>Why does changing an array order show several differences?</summary>
          <p>
            This tool compares array items by their index. When an item moves, values at multiple
            indexes may change. It does not match array records by an id property or ignore array
            order.
          </p>
        </details>
        <details>
          <summary>Are my JSON documents uploaded to a server?</summary>
          <p>
            No. Parsing and comparison run locally in your browser. The inputs are not sent to a
            PicToSpec processing server.
          </p>
        </details>
        <details>
          <summary>Can I download the JSON diff result?</summary>
          <p>
            Yes. Choose Download report to save the complete comparison summary and all differences
            as a JSON report. The report includes every difference even when the on-page results
            are filtered.
          </p>
        </details>
        <details>
          <summary>Does the tool create a JSON Patch or merge the two documents?</summary>
          <p>
            No. It creates a structured difference report with before and after values. It does
            not produce an RFC 6902 JSON Patch, apply changes or merge the input documents.
          </p>
        </details>
      </section>

      <section className="json-diff-related-tools">
        <h2>Related JSON and developer tools</h2>
        <p>
          Validate one document with the <a href="/json-validator">JSON Validator</a>, make it easier
          to read with the <a href="/json-formatter">JSON Formatter</a>, transform records with the
          <a href="/json-to-csv-converter"> JSON to CSV Converter</a>, or prepare data for another
          format using the <a href="/json-to-yaml-converter">JSON to YAML Converter</a>.
        </p>
      </section>
    </section>
  );
}
