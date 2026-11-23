"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

const characterSets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?"
};

function secureIndex(max: number) {
  const limit = Math.floor(0x100000000 / max) * max;
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0] >= limit);
  return value[0] % max;
}

export default function PasswordTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function generate() {
    const selected = [
      upper ? characterSets.upper : "",
      lower ? characterSets.lower : "",
      numbers ? characterSets.numbers : "",
      symbols ? characterSets.symbols : ""
    ].filter(Boolean);

    if (!selected.length) {
      setPassword("");
      setError("Select at least one character type.");
      return;
    }
    if (length < selected.length) {
      setError("Password length is too short for the selected character types.");
      return;
    }

    try {
      const pool = selected.join("");
      const result = selected.map(set => set[secureIndex(set.length)]);
      while (result.length < length) result.push(pool[secureIndex(pool.length)]);

      for (let i = result.length - 1; i > 0; i--) {
        const j = secureIndex(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
      }

      setPassword(result.join(""));
      setError("");
    } catch {
      setPassword("");
      setError("Secure random generation is unavailable in this browser. Try a modern browser over HTTPS.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setError("");
    } catch {
      setError("Copy failed. Select and copy the password manually.");
    }
  }

  return <main style={{ maxWidth: 700, margin: "42px auto", padding: 20, color: "#17251e" }}>
    <div className="tool-page-top"><a href="/" style={{ color: "#14634b", fontWeight: 700, textDecoration: "none" }}>← PicToSpec home</a><ToolSearch /></div>
    <p style={{ fontSize: 11, letterSpacing: 2, color: "#14634b", fontWeight: 800, marginTop: 35 }}>FREE SECURITY UTILITY</p>
    <h1 style={{ fontSize: "clamp(32px,6vw,46px)", letterSpacing: -1.5, margin: "10px 0" }}>Strong Password Generator</h1>
    <p style={{ color: "#75847c", lineHeight: 1.7 }}>Create a random password with uppercase letters, lowercase letters, numbers and symbols. Generation happens locally in your browser.</p>
    <section style={{ marginTop: 25, padding: 22, border: "1px solid #e2eae4", borderRadius: 14 }}>
      <label style={{ fontWeight: 700 }}>Password length: {length}
        <input type="range" min="8" max="64" value={length} onChange={e => {setLength(Number(e.target.value));setPassword("");setError("");}} style={{ display: "block", width: "100%", margin: "14px 0 22px" }} />
      </label>
      {[
        [upper, setUpper, "Uppercase letters (A–Z)"],
        [lower, setLower, "Lowercase letters (a–z)"],
        [numbers, setNumbers, "Numbers (0–9)"],
        [symbols, setSymbols, "Symbols (!@#$…)"]
      ].map(([checked, setter, label]) => <label key={String(label)} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0" }}>
        <input type="checkbox" checked={checked as boolean} onChange={e => {(setter as (value: boolean) => void)(e.target.checked);setPassword("");setError("");}} />
        {label as string}
      </label>)}
      <button onClick={generate} style={{ width: "100%", marginTop: 15, padding: 14, border: 0, borderRadius: 9, background: "#14634b", color: "white", fontWeight: 800, fontSize: 15 }}>Generate secure password</button>
      {password && <div style={{ marginTop: 18, padding: 15, background: "#f2f8f3", borderRadius: 9, overflowWrap: "anywhere" }}>
        <code style={{ fontSize: 18, fontWeight: 700 }}>{password}</code>
        <button onClick={copy} style={{ display: "block", marginTop: 12, padding: "9px 14px", border: "1px solid #cbded1", borderRadius: 7, background: "white", color: "#14634b", fontWeight: 700 }}>Copy password</button>
      </div>}
      {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
    </section>
    <h2 style={{ marginTop: 30 }}>How to create a strong password</h2>
    <p style={{ color: "#75847c", lineHeight: 1.7 }}>Choose a longer password and use a mix of character types. Use a different password for every important account and store it in a trusted password manager. PicToSpec does not save the generated password.</p>
    <p style={{ fontSize: 12, color: "#75847c" }}>Security note: This tool uses your browser's cryptographic random number generator and unbiased character selection. Never share your passwords with anyone.</p>
    <section className="tool-content"><h2>How to make a safer password</h2><p>Use a long, unique password for each account. A password manager can help you store different passwords without reusing them. This generator does not save or transmit the generated password.</p><h3>Frequently asked questions</h3><details><summary>Is a longer password safer?</summary><p>Length is an important factor. A longer randomly generated password generally has more possible combinations than a short one.</p></details><details><summary>Is Base64 or password generation the same as encryption?</summary><p>No. This tool creates a random password; it does not encrypt or store your account data. Keep the generated password private and use a trusted password manager.</p></details></section>
  </main>;
}
