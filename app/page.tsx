/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";

type GenerateResponse = {
  code: string;
  parameters: Record<string, unknown>;
  filename: string;
};

export default function HomePage() {
  const [prompt, setPrompt] = useState(
    "modern glass office tower with 20 floors, rectangular footprint 30x20 meters, floor height 3 meters, curtain wall facade, revolving door entrance, flat roof with parapet"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const canDownload = useMemo(() => !!result?.code, [result]);

  async function onGenerate() {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = (await res.json()) as GenerateResponse;
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function onCopy() {
    if (!result?.code) return;
    navigator.clipboard.writeText(result.code);
  }

  function onDownload() {
    if (!result?.code) return;
    const blob = new Blob([result.code], { type: "text/x-python" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = result.filename || "building_generator.py";
    link.click();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1020 0%, #0f1a2b 100%)",
        color: "white"
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "48px 20px" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <img src="https://fav.farm/???" alt="logo" width={32} height={32} />
          <h1 style={{ fontSize: 28, margin: 0 }}>Architect AI Assistant for Blender</h1>
        </header>

        <section
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16
          }}
        >
          <label htmlFor="prompt" style={{ display: "block", fontSize: 13, opacity: 0.9, marginBottom: 8 }}>
            Describe the building you want:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. parisian haussmann 6 floors with balconies, stone facade, mansard roof..."
            rows={5}
            style={{
              width: "100%",
              borderRadius: 8,
              padding: 12,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              onClick={onGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                background: "#6ee7b7",
                color: "#052e2b",
                border: 0,
                padding: "10px 14px",
                borderRadius: 8,
                cursor: loading ? "wait" : "pointer",
                fontWeight: 600
              }}
            >
              {loading ? "Generating..." : "Generate Blender Script"}
            </button>
            <button
              onClick={onCopy}
              disabled={!canDownload}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "white",
                padding: "10px 14px",
                borderRadius: 8,
                cursor: canDownload ? "pointer" : "not-allowed"
              }}
            >
              Copy
            </button>
            <button
              onClick={onDownload}
              disabled={!canDownload}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "white",
                padding: "10px 14px",
                borderRadius: 8,
                cursor: canDownload ? "pointer" : "not-allowed"
              }}
            >
              Download .py
            </button>
          </div>
        </section>

        {error && (
          <div
            style={{
              background: "rgba(255,0,0,0.08)",
              border: "1px solid rgba(255,0,0,0.18)",
              color: "#fecaca",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <section
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>Preview</h3>
              <code style={{ opacity: 0.8 }}>{result.filename}</code>
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                overflowX: "auto",
                background: "rgba(0,0,0,0.3)",
                padding: 12,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: 12
              }}
            >
{result.code}
            </pre>
          </section>
        )}

        <section style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6 }}>
          <h3 style={{ marginTop: 24 }}>How to use in Blender</h3>
          <ol>
            <li>Open Blender, go to Scripting workspace.</li>
            <li>Create a new text block, paste the generated code, and click Run Script.</li>
            <li>Alternatively, download the .py and run it via Text Editor ? Open ? Run Script.</li>
          </ol>
          <p style={{ opacity: 0.8 }}>
            The script is self-contained and uses only Blender&apos;s <code>bpy</code> API with procedural modeling.
          </p>
        </section>
      </div>
    </main>
  );
}

