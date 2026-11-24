"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("PicToSpec route error:", error);
  }, [error]);

  return (
    <main className="not-found-page" role="alert">
      <section className="not-found-panel">
        <p className="kicker">TEMPORARY PROBLEM</p>
        <h1>This tool needs a fresh start.</h1>
        <p className="not-found-copy">
          Something went wrong while opening this page. Your original file is not changed.
          Try again, or return to PicToSpec and open the tool once more.
        </p>
        <div className="not-found-actions">
          <button className="not-found-primary" type="button" onClick={() => reset()}>Try again</button>
          <a className="not-found-secondary" href="/">Go to homepage</a>
        </div>
        {error.digest ? <small>Reference: {error.digest}</small> : null}
      </section>
    </main>
  );
}
