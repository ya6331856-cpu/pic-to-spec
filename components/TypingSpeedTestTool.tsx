"use client";

import { useEffect, useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
import { calculateTypingStats } from "@/lib/typing-speed.mjs";

const passages = [
  "Clear writing helps people understand an idea without extra effort. A good tool should be simple to use, quick to load, and honest about what it can do. Practice a little every day and focus on accuracy before speed.",
  "Technology is most useful when it solves a real problem. Small improvements in focus, careful work, and regular practice can build strong skills over time. Keep your eyes on the text, use a steady rhythm, and avoid rushing.",
  "A reliable website gives visitors a clear path from the first click to the final result. Helpful instructions, readable text, and working buttons make everyday tasks easier. Quality comes from checking the details and improving them consistently."
];

export default function TypingSpeedTestTool() {
  const [duration, setDuration] = useState(60);
  const [passageIndex, setPassageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [finished, setFinished] = useState(false);
  const passage = passages[passageIndex];

  useEffect(() => {
    if (startedAt === null || finished) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current - startedAt >= duration * 1000) setFinished(true);
    }, 100);
    return () => window.clearInterval(timer);
  }, [startedAt, finished, duration]);

  const elapsedSeconds = startedAt === null
    ? 0
    : Math.max(0, Math.min(duration, (now - startedAt) / 1000));
  const remainingSeconds = Math.max(0, Math.ceil(duration - elapsedSeconds));
  const progress = Math.min(100, (elapsedSeconds / duration) * 100);
  const stats = useMemo(
    () => calculateTypingStats(passage, typed, elapsedSeconds),
    [passage, typed, elapsedSeconds]
  );

  function reset(nextDuration = duration, nextPassage = passageIndex) {
    setDuration(nextDuration);
    setPassageIndex(nextPassage);
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setFinished(false);
  }

  function handleTyping(value: string) {
    if (finished || value.length > passage.length) return;
    const current = Date.now();
    if (startedAt === null) setStartedAt(current);
    setNow(current);
    setTyped(value);
    if (value.length >= passage.length) setFinished(true);
  }

  const secondsLabel = startedAt === null ? duration : remainingSeconds;

  return (
    <main className="seo-page">
      <div className="tool-page-top">
        <a className="back" href="/">← PicToSpec home</a>
        <ToolSearch />
      </div>
      <p className="kicker">FREE TYPING PRACTICE TOOL</p>
      <h1>Typing Speed Test – Check Your WPM</h1>
      <p className="lead">
        Test your typing speed online and see your words per minute, accuracy and mistakes. Choose a short timer, type the passage and review your result instantly.
      </p>

      <section className="workspace" style={{ margin: "24px 0", padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
          <label>
            Test duration
            <select value={duration} disabled={startedAt !== null && !finished} onChange={event => reset(Number(event.target.value))}>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </label>
          <label>
            Practice passage
            <select value={passageIndex} disabled={startedAt !== null && !finished} onChange={event => reset(duration, Number(event.target.value))}>
              <option value={0}>Everyday writing</option>
              <option value={1}>Technology</option>
              <option value={2}>Website quality</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 20 }}>
          <span style={{ fontWeight: 700 }}>Time remaining</span>
          <strong role="timer" aria-live="off" style={{ fontSize: 26, fontVariantNumeric: "tabular-nums" }}>{secondsLabel}s</strong>
        </div>
        <div style={{ height: 8, overflow: "hidden", borderRadius: 99, background: "rgba(120,140,130,.2)", marginTop: 8 }}>
          <div style={{ width: progress + "%", height: "100%", background: "#15956d", transition: "width .1s linear" }} />
        </div>

        <div style={{ marginTop: 20, padding: 16, border: "1px solid #31515c", borderRadius: 12, lineHeight: 2, fontSize: 16, overflowWrap: "anywhere" }} aria-label="Text to type">
          {passage.split("").map((character, index) => {
            const isTyped = index < typed.length;
            const isCorrect = isTyped && typed[index] === character;
            const isCurrent = index === typed.length && !finished;
            return (
              <span
                key={index}
                style={{
                  background: isCurrent ? "rgba(33,180,136,.24)" : isTyped && !isCorrect ? "rgba(220,65,65,.25)" : "transparent",
                  color: isTyped ? (isCorrect ? "#48d6a7" : "#ff9898") : "inherit",
                  borderRadius: 3
                }}
              >{character}</span>
            );
          })}
        </div>

        <label style={{ display: "block", marginTop: 18 }}>
          Type the passage here
          <textarea
            value={typed}
            disabled={finished}
            rows={5}
            maxLength={passage.length}
            onChange={event => handleTyping(event.target.value)}
            onPaste={event => event.preventDefault()}
            onDrop={event => event.preventDefault()}
            placeholder="Start typing here. The timer begins with your first character."
            style={{ display: "block", width: "100%", marginTop: 8, padding: 13, border: "1px solid #31515c", borderRadius: 10, font: "inherit", resize: "vertical" }}
          />
        </label>

        <p style={{ marginTop: 10, fontSize: 13 }}>
          {startedAt === null ? "The timer starts when you type the first character. Pasting is disabled for a fair test." : finished ? "Test completed. Review your score below." : "Keep a steady pace. Correct characters count toward your score."}
        </p>

        {(finished || startedAt !== null) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginTop: 16 }}>
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(21,149,109,.13)", textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: 25 }}>{stats.wordsPerMinute}</strong>
              <span style={{ fontSize: 12 }}>Net WPM</span>
            </div>
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(21,149,109,.13)", textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: 25 }}>{stats.accuracy}%</strong>
              <span style={{ fontSize: 12 }}>Accuracy</span>
            </div>
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(21,149,109,.13)", textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: 25 }}>{stats.errors}</strong>
              <span style={{ fontSize: 12 }}>Errors</span>
            </div>
          </div>
        )}

        <button className="primary download-action" type="button" onClick={() => reset()} style={{ marginTop: 18, width: "100%" }}>
          ↻ Restart test
        </button>
      </section>

      <section className="tool-content">
        <h2>How the typing speed test works</h2>
        <p>
          Choose a 30, 60 or 120-second test and type the displayed passage. The timer begins with your first character. The test stops when the time runs out or when you finish the passage. Your net words per minute are calculated from correct characters, using five characters as one standard word. Accuracy compares correct characters with all characters typed.
        </p>
        <h3>Tips to improve typing speed</h3>
        <ul>
          <li>Look at the passage instead of watching your keyboard.</li>
          <li>Build accuracy first, then gradually increase your pace.</li>
          <li>Practice for a few minutes regularly and take short breaks.</li>
        </ul>
        <h3>Frequently asked questions</h3>
        <details>
          <summary>What does WPM mean?</summary>
          <p>WPM means words per minute. This test uses five correctly typed characters as one standard word.</p>
        </details>
        <details>
          <summary>Does accuracy affect my WPM?</summary>
          <p>Yes. The score shown is net WPM, based only on correctly typed characters. Incorrect and extra characters count as errors.</p>
        </details>
        <details>
          <summary>Is my typing saved or uploaded?</summary>
          <p>No. The test runs in your browser and does not send your typed text to a PicToSpec processing server.</p>
        </details>
        <h3>Related practice tools</h3>
        <p>
          Build a daily writing routine with the <a href="/word-counter">word and character counter</a>,
          or clean up headings and labels with the <a href="/case-converter">text case converter</a>.
        </p>
      </section>
    </main>
  );
}
