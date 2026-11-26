"use client";

import { useEffect, useState } from "react";
import { COUNTRY_PROFILES, getCountryProfile } from "@/lib/country-settings.mjs";

const STORAGE_KEY = "pictospec.country.v1";
const COUNTRY_EVENT = "pictospec:country-change";

function isSupportedCountry(code: unknown): code is string {
  return typeof code === "string" && COUNTRY_PROFILES.some((country) => country.code === code);
}

export function useCountrySettings() {
  const [countryCode, setCountryCodeState] = useState("IN");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isSupportedCountry(saved)) setCountryCodeState(saved);
    } catch {
      // The calculator remains usable when browser storage is unavailable.
    }

    function handleCountryChange(event: Event) {
      const code = (event as CustomEvent<string>).detail;
      if (isSupportedCountry(code)) setCountryCodeState(code);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      setCountryCodeState(isSupportedCountry(event.newValue) ? event.newValue : "IN");
    }

    window.addEventListener(COUNTRY_EVENT, handleCountryChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(COUNTRY_EVENT, handleCountryChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function setCountryCode(nextCode: string) {
    if (!isSupportedCountry(nextCode)) return;
    setCountryCodeState(nextCode);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCode);
    } catch {
      // Keep the current page selection even when storage is blocked.
    }
    window.dispatchEvent(new CustomEvent(COUNTRY_EVENT, { detail: nextCode }));
  }

  return { countryCode, country: getCountryProfile(countryCode), setCountryCode };
}

export default function CountrySelector() {
  const { countryCode, country, setCountryCode } = useCountrySettings();

  return (
    <div
      className="country-settings"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "7px 10px",
        marginTop: 8,
        padding: "8px 10px",
        border: "1px solid #e1ebe4",
        borderRadius: 10,
        background: "#fbfdfb",
        color: "#43554b",
        fontSize: 11
      }}
    >
      <label htmlFor="pictospec-country" style={{ fontWeight: 800, whiteSpace: "nowrap" }}>
        Country & format
      </label>
      <select
        id="pictospec-country"
        value={countryCode}
        onChange={(event) => setCountryCode(event.target.value)}
        aria-label="Choose country for currency and regional formats"
        style={{
          minWidth: 0,
          maxWidth: "100%",
          padding: "7px 9px",
          border: "1px solid #d8e4dc",
          borderRadius: 7,
          background: "#fff",
          color: "#17251e",
          fontSize: 12,
          fontWeight: 700
        }}
      >
        {COUNTRY_PROFILES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.flag} {option.name} ({option.currency})
          </option>
        ))}
      </select>
      <span style={{ color: "#718077" }}>
        {country.dateFormat} · {country.measurementSystem === "us-customary" ? "US customary" : "Metric"}
      </span>
    </div>
  );
}
