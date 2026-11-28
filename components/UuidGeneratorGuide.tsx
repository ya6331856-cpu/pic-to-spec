export default function UuidGeneratorGuide() {
  const formatExample = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

  return (
    <section className="tool-content uuid-guide" aria-label="UUID generator guide">
      <div className="uuid-guide-intro">
        <p className="kicker">UUID V4 GENERATOR GUIDE</p>
        <h2>Free Random UUID Generator – Create UUID v4 IDs Online</h2>
        <p>
          Need a unique-looking identifier for a database record, test fixture, API resource or
          development task? Use the PicToSpec UUID generator to create one random UUID v4 or a batch
          of up to 100 identifiers. Copy the full list, download TXT or JSON, and choose the output
          format your project expects.
        </p>
        <p>
          This page generates <strong>UUID version 4 only</strong>. It uses the browser's
          cryptographically secure random number facilities and does not send generated UUID values
          to a PicToSpec processing server.
        </p>
      </div>

      <nav className="uuid-toc" aria-label="On this page">
        <h3>On this page</h3>
        <ol>
          <li><a href="#what-is-a-uuid">What is a UUID or GUID?</a></li>
          <li><a href="#uuid-format">UUID v4 format and structure</a></li>
          <li><a href="#uuid-versions">UUID v4 vs v7 vs v1</a></li>
          <li><a href="#how-to-generate">How to use this UUID generator</a></li>
          <li><a href="#uuid-code-examples">Code examples</a></li>
          <li><a href="#uuid-use-cases">Common UUID use cases</a></li>
          <li><a href="#uuid-collisions-security">Collision risk and security</a></li>
          <li><a href="#uuid-faqs">Frequently asked questions</a></li>
        </ol>
      </nav>

      <section id="what-is-a-uuid">
        <h2>What is a UUID?</h2>
        <p>
          A <strong>UUID</strong> (Universally Unique Identifier) is a 128-bit value used to identify
          an object, record, request or resource. Applications use UUIDs when they need identifiers
          that can be created independently without asking one central service to issue the next
          number. The same format is also commonly called a <strong>GUID</strong> (Globally Unique
          Identifier), especially in Microsoft and Windows development.
        </p>
        <p>
          A standard text UUID is usually written as 32 hexadecimal characters grouped in an
          8-4-4-4-12 pattern. For example:
        </p>
        <pre><code>550e8400-e29b-41d4-a716-446655440000</code></pre>
        <p>
          The hyphens make the value easier to read. Uppercase and lowercase hexadecimal letters
          represent the same identifier. The UUID specification is documented in
          <a href="https://www.rfc-editor.org/rfc/rfc9562.html" target="_blank" rel="noreferrer">
            RFC 9562
          </a>.
        </p>
      </section>

      <section id="uuid-format">
        <h2>UUID v4 format: how to read a random UUID</h2>
        <p>
          UUID v4 has 128 bits in total. Six bits identify the version and variant; the remaining
          122 bits are random or pseudorandom data. That is why a standard v4 string has a
          <code>4</code> at the start of its third group and one of <code>8</code>, <code>9</code>,
          <code>a</code> or <code>b</code> at the start of its fourth group.
        </p>
        <div className="uuid-format-example">
          <code>{formatExample}</code>
          <span>4 = version marker · y = variant marker (8, 9, a or b)</span>
        </div>
        <div className="uuid-table-wrap">
          <table>
            <thead>
              <tr><th>Part</th><th>What it represents</th></tr>
            </thead>
            <tbody>
              <tr><td>First group</td><td>48 random bits</td></tr>
              <tr><td>Third group, first hex digit</td><td>Version marker: 4 for UUID v4</td></tr>
              <tr><td>Fourth group, first hex digit</td><td>Variant marker: 8, 9, a or b</td></tr>
              <tr><td>Remaining variable positions</td><td>Random or pseudorandom bits</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          A hyphenated UUID contains 36 characters including separators. Removing the four
          hyphens produces the same 32 hexadecimal digits in a compact form; it does not create a
          different UUID. Keep the standard hyphenated version when the system you are integrating
          with expects the conventional text representation.
        </p>
      </section>

      <section id="uuid-versions">
        <h2>UUID v4 vs UUID v7 vs UUID v1</h2>
        <p>
          UUID versions are designed for different identifier requirements. This PicToSpec page
          currently generates random v4 identifiers, so choose another version in your own
          application when its properties are more suitable.
        </p>
        <div className="uuid-table-wrap">
          <table>
            <thead>
              <tr><th>Version</th><th>How it is made</th><th>Typical consideration</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>UUID v4</strong></td>
                <td>Random or pseudorandom bits, with version and variant markers</td>
                <td>General-purpose random IDs; the version generated by this tool</td>
              </tr>
              <tr>
                <td><strong>UUID v7</strong></td>
                <td>Time-ordered value with a Unix timestamp and random/counter fields</td>
                <td>Can help identifiers sort by creation time and suit some database workloads</td>
              </tr>
              <tr>
                <td><strong>UUID v1</strong></td>
                <td>Time-based fields and a node identifier</td>
                <td>May expose time or node-related information; consider privacy requirements</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Do not select a version only because its number is newer. Consider whether your system
          needs random identifiers, time ordering, deterministic name-based identifiers or
          compatibility with an existing database and API.
        </p>
      </section>

      <section id="how-to-generate">
        <h2>How to use the online UUID generator</h2>
        <ol>
          <li>Choose how many IDs you need, from 1 to 100.</li>
          <li>Select optional formatting: uppercase, no hyphens or GUID-style braces.</li>
          <li>Press <strong>Generate UUIDs</strong> to create a new UUID v4 batch in your browser.</li>
          <li>Choose <strong>Copy all</strong> to copy the list, or download it as a TXT or JSON file.</li>
          <li>Paste or import the result into your development project and check the format expected by that system.</li>
        </ol>
        <h3>What the output format options do</h3>
        <ul>
          <li><strong>Uppercase:</strong> changes hexadecimal letters from lowercase to uppercase.</li>
          <li><strong>Remove hyphens:</strong> keeps the same hexadecimal value but removes the four separators.</li>
          <li><strong>Wrap in braces:</strong> displays each value in a GUID-style form such as <code>{'{550e8400-e29b-41d4-a716-446655440000}'}</code>.</li>
        </ul>
        <p>
          These options change how an identifier is displayed, not the random value itself. Some
          databases and APIs require the normal hyphenated form, so confirm the destination format
          before importing a batch.
        </p>
      </section>

      <section id="uuid-code-examples">
        <h2>Generate a UUID v4 in code</h2>
        <p>
          When an application needs to generate UUIDs itself, use a library or a platform API
          designed for UUID creation. These examples create a version 4 UUID:
        </p>
        <h3>JavaScript in a secure browser context</h3>
        <pre><code>{`const id = crypto.randomUUID();
console.log(id);`}</code></pre>
        <h3>Python</h3>
        <pre><code>{`import uuid

id = str(uuid.uuid4())
print(id)`}</code></pre>
        <h3>Node.js</h3>
        <pre><code>{`import { randomUUID } from "node:crypto";

const id = randomUUID();
console.log(id);`}</code></pre>
        <p>
          The browser <a href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID" target="_blank" rel="noreferrer">Crypto.randomUUID()</a>
          method creates a v4 UUID using a cryptographically secure random number generator and
          requires a secure context such as HTTPS. The PicToSpec generator also has a
          <code>crypto.getRandomValues()</code> fallback for browsers that do not expose
          <code>randomUUID()</code>.
        </p>
      </section>

      <section id="uuid-use-cases">
        <h2>Common uses for random UUIDs</h2>
        <ul>
          <li><strong>Database records:</strong> identifiers for users, products, orders or other rows when your schema supports UUID values.</li>
          <li><strong>Test fixtures:</strong> sample IDs for unit tests, API mocks, demos and development data.</li>
          <li><strong>API resources:</strong> stable identifiers for resources that need to be referenced by clients.</li>
          <li><strong>Background jobs:</strong> correlation IDs that help connect logs and events belonging to the same operation.</li>
          <li><strong>Files and exports:</strong> identifiers that reduce the chance of filename clashes in automated workflows.</li>
        </ul>
        <p>
          UUIDs are not automatically the best choice for every database. If index size, insert
          ordering, storage format or compatibility matters, check your database's UUID support
          and compare random v4 values with time-ordered identifiers such as v7.
        </p>
      </section>

      <section id="uuid-collisions-security">
        <h2>Are UUID v4 values unique and secure?</h2>
        <p>
          UUID v4 values are designed to make accidental collisions extremely unlikely, not
          mathematically impossible. With 122 random bits, the number of possible v4 values is
          2<sup>122</sup>. As more values are generated, collision probability increases according
          to the birthday paradox, but remains very small at ordinary application scales.
        </p>
        <p>
          A UUID is an identifier, not a password or a general-purpose authentication credential.
          Do not use a UUID as a replacement for a dedicated password-reset token, API secret or
          access-control mechanism. For those purposes, follow your platform's security guidance
          and use purpose-built secrets with appropriate expiry and validation.
        </p>
        <p>
          Generated UUID values stay in this browser session and are not sent to a PicToSpec
          processing server. As with any web tool, avoid sharing private output on a device or
          browser profile that other people can access.
        </p>
      </section>

      <section id="uuid-faqs">
        <h2>UUID generator – Frequently asked questions</h2>
        <details>
          <summary>What is a UUID generator?</summary>
          <p>
            A UUID generator creates Universally Unique Identifiers. This page creates random
            version 4 UUIDs and can generate between 1 and 100 values in one batch.
          </p>
        </details>
        <details>
          <summary>How do I generate a random UUID online?</summary>
          <p>
            Enter a quantity, choose any output formatting options and select Generate UUIDs. Copy
            the generated list or download it as TXT or JSON.
          </p>
        </details>
        <details>
          <summary>Is this a UUID v4 generator?</summary>
          <p>
            Yes. PicToSpec generates version 4 UUIDs using the browser's cryptographic random API.
            It does not currently generate UUID v1, v5 or v7 values.
          </p>
        </details>
        <details>
          <summary>What is the difference between a UUID and a GUID?</summary>
          <p>
            UUID and GUID commonly refer to the same 128-bit identifier format. GUID is a term
            widely used in Microsoft development. Some systems display GUIDs in uppercase or
            surrounded by braces.
          </p>
        </details>
        <details>
          <summary>Can two UUID v4 values be identical?</summary>
          <p>
            A collision is possible in theory, but the 122 random bits make accidental duplicates
            extremely unlikely for ordinary workloads. Do not treat uniqueness as a substitute for
            database constraints where those are required.
          </p>
        </details>
        <details>
          <summary>Can I generate multiple UUIDs at once?</summary>
          <p>
            Yes. Choose any whole number from 1 to 100. The generator creates a new batch and lets
            you copy all values or download the list.
          </p>
        </details>
        <details>
          <summary>Can I remove hyphens or use uppercase GUID formatting?</summary>
          <p>
            Yes. Choose Uppercase, Remove hyphens or Wrap in braces before generating the list.
            These options change the display format, not the underlying identifier.
          </p>
        </details>
        <details>
          <summary>Are the UUIDs uploaded or stored by PicToSpec?</summary>
          <p>
            UUIDs are generated in your browser. The generated values are not submitted to a
            PicToSpec processing server. They remain available in the current page until you leave
            or replace the batch.
          </p>
        </details>
        <details>
          <summary>Should I use a UUID as an API key or password?</summary>
          <p>
            No. Use purpose-built credentials and secret-management practices for authentication,
            API access and password-reset flows. UUIDs are primarily identifiers.
          </p>
        </details>
      </section>

      <section className="uuid-related-tools">
        <h2>Related developer tools</h2>
        <p>
          Continue working with your generated IDs using the
          <a href="/json-formatter"> JSON Formatter and Validator</a>,
          <a href="/json-diff"> JSON Diff tool</a> or
          <a href="/sql-to-json-converter"> SQL to JSON Converter</a>. For credential creation,
          use a dedicated <a href="/password-generator">Password Generator</a> instead of a UUID.
        </p>
      </section>

      <p className="uuid-standard-note">
        Technical reference: <a href="https://www.rfc-editor.org/rfc/rfc9562.html" target="_blank" rel="noreferrer">RFC 9562 – Universally Unique Identifiers (UUIDs)</a>.
      </p>
    </section>
  );
}
