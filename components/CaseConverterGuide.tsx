export default function CaseConverterGuide() {
  return (
    <section className="tool-content case-guide" aria-label="Caps Lock converter and text case guide">
      <div className="case-guide-intro">
        <p className="kicker">CAPS LOCK CONVERTER & TEXT CASE GUIDE</p>
        <h2>Free Online Caps Lock Converter – Change Text to UPPERCASE, lowercase and More</h2>
        <p className="lead">
          Pasted a paragraph that looks like THIS? Or typed a message with the wrong capitalization?
          Use the PicToSpec Caps Lock Converter to change the case of text in one click. Convert
          uppercase to lowercase, make headings easier to read, format sentences, or prepare
          programming names such as camelCase and snake_case.
        </p>
        <p>
          The converter works on text you enter in this page. It does not press or switch the
          physical Caps Lock key on your keyboard. Your original input stays separate from the
          converted result, so you can compare, copy, download or use the output as a new input.
        </p>
      </div>

      <nav className="case-toc" aria-label="On this page">
        <h3>On this page</h3>
        <ol>
          <li><a href="#what-is-caps-lock-converter">What is a Caps Lock converter?</a></li>
          <li><a href="#case-formats">Text case formats explained</a></li>
          <li><a href="#how-to-use-case-converter">How to use the converter</a></li>
          <li><a href="#caps-lock-examples">Common Caps Lock fixes</a></li>
          <li><a href="#developer-case-formats">Case formats for developers</a></li>
          <li><a href="#case-conversion-privacy">Privacy and how conversion works</a></li>
          <li><a href="#case-converter-faqs">Frequently asked questions</a></li>
        </ol>
      </nav>

      <section id="what-is-caps-lock-converter">
        <h2>What is a Caps Lock converter?</h2>
        <p>
          A Caps Lock converter is a text utility that changes the capitalization of words you
          paste into an editor. It is useful when a sentence was typed in uppercase by mistake,
          when text copied from a PDF has inconsistent capitalization, or when a heading needs a
          different writing style.
        </p>
        <p>
          A keyboard's Caps Lock key changes how future letters are typed. An online Caps Lock text
          converter does something different: it transforms text that already exists. For example,
          if you paste <code>PLEASE CHECK THIS MESSAGE</code> and choose lowercase, the result is
          <code>please check this message</code>. Choosing Sentence case produces
          <code>Please check this message</code>.
        </p>
        <p>
          You can also use the same page as an uppercase converter, lowercase converter, title case
          converter, sentence case converter and developer case formatter.
        </p>
      </section>

      <section id="case-formats">
        <h2>Text case formats explained</h2>
        <p>
          Each format has a different purpose. Choose a writing style for normal text or a naming
          convention when formatting code, variables, file names and data keys.
        </p>
        <div className="case-table-wrap">
          <table>
            <thead><tr><th>Format</th><th>Example input</th><th>Example result</th><th>Common use</th></tr></thead>
            <tbody>
              <tr><td><strong>UPPERCASE</strong></td><td>hello world</td><td>HELLO WORLD</td><td>Short labels and headings</td></tr>
              <tr><td><strong>lowercase</strong></td><td>HELLO WORLD</td><td>hello world</td><td>Fixing accidental Caps Lock text</td></tr>
              <tr><td><strong>Title Case</strong></td><td>the quick brown fox</td><td>The Quick Brown Fox</td><td>Simple headline formatting</td></tr>
              <tr><td><strong>Capitalize Each Word</strong></td><td>the quick brown fox</td><td>The Quick Brown Fox</td><td>Names and labels</td></tr>
              <tr><td><strong>Sentence case</strong></td><td>HELLO WORLD. HOW ARE YOU?</td><td>Hello world. How are you?</td><td>Readable body text</td></tr>
              <tr><td><strong>tOGGLE cASE</strong></td><td>hELLO wORLD</td><td>Hello World</td><td>Reverse existing letter case</td></tr>
              <tr><td><strong>aLtErNaTiNg</strong></td><td>hello world</td><td>HeLlO WoRlD</td><td>Stylized informal text</td></tr>
              <tr><td><strong>camelCase</strong></td><td>user profile name</td><td>userProfileName</td><td>JavaScript variables and object properties</td></tr>
              <tr><td><strong>PascalCase</strong></td><td>user profile name</td><td>UserProfileName</td><td>Class and component names</td></tr>
              <tr><td><strong>snake_case</strong></td><td>user profile name</td><td>user_profile_name</td><td>Python names and data keys</td></tr>
              <tr><td><strong>kebab-case</strong></td><td>user profile name</td><td>user-profile-name</td><td>URL slugs and CSS classes</td></tr>
              <tr><td><strong>CONSTANT_CASE</strong></td><td>user profile name</td><td>USER_PROFILE_NAME</td><td>Constant identifiers</td></tr>
              <tr><td><strong>Collapse extra spaces</strong></td><td>hello    world</td><td>hello world</td><td>Cleaning pasted text while keeping line breaks</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Title Case and Capitalize Each Word are close, but not identical in this tool. Basic Title
          Case keeps a small set of common English words lowercase in the middle of a heading;
          Capitalize Each Word capitalizes every word. Neither option is a complete AP, Chicago or
          other editorial style checker.
        </p>
      </section>

      <section id="how-to-use-case-converter">
        <h2>How to use the online Caps Lock converter</h2>
        <ol>
          <li><strong>Enter text:</strong> paste the paragraph, title, message or list you want to change.</li>
          <li><strong>Choose a format:</strong> click UPPERCASE, lowercase, Sentence case, Title Case or another available format.</li>
          <li><strong>Review the result:</strong> the converted text appears in a separate result box below the editor.</li>
          <li><strong>Copy or download:</strong> copy the output, save it as a TXT file or use the result as the next input.</li>
          <li><strong>Check special words:</strong> review names, acronyms, product names and technical terms before publishing or using the result.</li>
        </ol>
        <p>
          You can switch between formats more than once. The input remains unchanged until you
          select Use as input or edit it yourself. This makes it easier to compare the output
          without losing the original text.
        </p>
      </section>

      <section id="caps-lock-examples">
        <h2>Common Caps Lock and text formatting examples</h2>
        <h3>Fix a sentence typed in all capital letters</h3>
        <pre><code>{`INPUT
PLEASE SEND THE UPDATED DOCUMENT TODAY.

lowercase
please send the updated document today.

Sentence case
Please send the updated document today.`}</code></pre>

        <h3>Correct mixed capitalization</h3>
        <pre><code>{`INPUT
hELLO wORLD! tHIS TEXT LOOKS WRONG.

Toggle case
Hello World! This text looks wrong.`}</code></pre>

        <h3>Prepare a developer variable name</h3>
        <pre><code>{`INPUT
customer account status

camelCase
customerAccountStatus

snake_case
customer_account_status

kebab-case
customer-account-status`}</code></pre>
        <p>
          These examples show formatting rules, not spelling correction. A case converter does
          not proofread grammar, verify a person's name or decide whether an acronym should stay
          uppercase.
        </p>
      </section>

      <section id="developer-case-formats">
        <h2>Case converter for programmers and developers</h2>
        <p>
          Different languages and tools use different naming conventions. For example, JavaScript
          projects often use camelCase for local variables, Python code commonly uses snake_case,
          and CSS class names frequently use kebab-case. Some frameworks and programming languages
          use PascalCase for classes or components.
        </p>
        <p>
          PicToSpec extracts words from your input and joins them using the selected convention.
          It can split common camelCase and acronym boundaries, such as
          <code>myHTTPServer</code> into <code>my</code>, <code>HTTP</code> and
          <code>Server</code>. Punctuation and symbols are removed when a developer identifier is
          created. Always verify the generated name against your project's naming rules.
        </p>
        <p>
          The formatter does not parse source code. Do not paste a complete program expecting it
          to preserve operators, comments, strings or syntax. Use it for plain identifiers, labels
          and short phrases.
        </p>
      </section>

      <section id="case-conversion-privacy">
        <h2>Privacy and how text conversion works</h2>
        <p>
          Case conversion runs in your browser using JavaScript string and Unicode casing
          operations. The text you type or paste is not sent to a PicToSpec text-processing server.
          The tool does not need an account or an AI service.
        </p>
        <p>
          Uppercase and lowercase mapping can be language-sensitive. JavaScript provides
          locale-aware methods such as <code>toLocaleUpperCase()</code> and
          <code>toLocaleLowerCase()</code>; some letters change differently depending on language.
          See the
          <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase" target="_blank" rel="noreferrer">MDN documentation for locale-aware uppercase conversion</a>
          for examples.
        </p>
        <p>
          Because case conversion can change the number of characters for some Unicode letters,
          check the final character count when working with strict form limits. Avoid pasting
          passwords, API keys or other secrets into shared devices.
        </p>
      </section>

      <section id="case-converter-faqs">
        <h2>Caps Lock converter – Frequently asked questions</h2>
        <details>
          <summary>How do I convert all caps text to normal text?</summary>
          <p>
            Paste the text and choose Sentence case for a paragraph or lowercase if you want every
            letter to be small. Review names and abbreviations afterwards.
          </p>
        </details>
        <details>
          <summary>Is this the same as turning off Caps Lock on my keyboard?</summary>
          <p>
            No. This page reformats text that is already in the editor. It cannot switch the
            physical Caps Lock key or change keyboard settings on your device.
          </p>
        </details>
        <details>
          <summary>Can I convert lowercase to uppercase online?</summary>
          <p>
            Yes. Paste lowercase text and select UPPERCASE. Copy the converted result or download
            it as a TXT file.
          </p>
        </details>
        <details>
          <summary>What is the difference between uppercase and title case?</summary>
          <p>
            Uppercase turns every letter into a capital letter. Title Case capitalizes words in a
            heading and leaves selected short English words lowercase in the middle.
          </p>
        </details>
        <details>
          <summary>Can I use the case converter for camelCase and snake_case?</summary>
          <p>
            Yes. The developer formats include camelCase, PascalCase, snake_case, kebab-case and
            CONSTANT_CASE. Use them for plain identifiers and review the result before placing it
            in source code.
          </p>
        </details>
        <details>
          <summary>Does the converter keep my line breaks?</summary>
          <p>
            Yes. Case conversions preserve line breaks. The Collapse extra spaces option cleans
            repeated horizontal whitespace on each line while keeping the line structure.
          </p>
        </details>
        <details>
          <summary>Is my text stored or uploaded?</summary>
          <p>
            No. The conversion is performed in your browser and the text is not sent to a
            PicToSpec processing server.
          </p>
        </details>
        <details>
          <summary>Does the tool correct spelling or grammar?</summary>
          <p>
            No. It changes capitalization, developer word separators or repeated spaces. It does
            not proofread, translate or rewrite your text.
          </p>
        </details>
      </section>

      <section className="case-related-tools">
        <h2>Related text tools</h2>
        <p>
          Check length and character limits with the <a href="/word-counter">Word Counter</a>,
          practise typing with the <a href="/typing-speed-test">Typing Speed Test</a>, or compare
          two text versions using <a href="/text-compare">Text Compare</a>.
        </p>
      </section>
    </section>
  );
}
