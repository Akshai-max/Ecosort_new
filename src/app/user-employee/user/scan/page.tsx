"use client";

import React from "react";

type PredictionResult = {
  category: string;
  confidence: number;
  description: string;
  disposal: string;
  overallAccuracy: number;
  timestamp: string;
  modelVersion: string;
};

export default function ScanPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PredictionResult | null>(null);
  const classes = React.useMemo(
    () => [
      "plastic",
      "paper",
      "glass",
      "metal",
      "organic",
      "electronic",
      "textile",
      "hazardous",
    ],
    []
  );

  const colorByClass = React.useMemo(
    () => ({
      plastic: { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
      paper: { bg: "#FEF3C7", text: "#B45309" }, // amber
      glass: { bg: "#CCFBF1", text: "#0F766E" }, // teal
      metal: { bg: "#E5E7EB", text: "#374151" }, // gray
      organic: { bg: "#DCFCE7", text: "#166534" }, // green
      electronic: { bg: "#F3E8FF", text: "#6D28D9" }, // purple
      textile: { bg: "#FEF9C3", text: "#92400E" }, // yellow
      hazardous: { bg: "#FEE2E2", text: "#B91C1C" }, // red
    }),
    []
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(null);
    setResult(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setError(null);
    const f = e.dataTransfer.files?.[0] || null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleScan = async (): Promise<void> => {
    setError(null);
    setResult(null);
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/ml/classify", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }
      const data = (await res.json()) as PredictionResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const downloadSummaryImage = async (): Promise<void> => {
    if (!result) return;
    const width = 900;
    const height = 500;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    // Title
    ctx.fillStyle = "#111827";
    ctx.font = "bold 28px Arial";
    ctx.fillText("Ecosort - Scan Result", 24, 48);

    // Confidence bar
    const conf = Math.max(0, Math.min(1, result.confidence));
    ctx.font = "16px Arial";
    ctx.fillText(`Prediction: ${result.category}`, 24, 92);
    ctx.fillText(`Confidence: ${(conf * 100).toFixed(1)}%`, 24, 116);
    const barX = 24;
    const barY = 132;
    const barW = width - 48;
    const barH = 20;
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(barX, barY, barW * conf, barH);

    // Class list
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#111827";
    ctx.fillText("Classes:", 24, 184);
    ctx.font = "18px Arial";
    const startY = 212;
    const lineH = 32;
    classes.forEach((c, i) => {
      const y = startY + i * lineH;
      if (c.toLowerCase() === result.category.toLowerCase()) {
        ctx.fillStyle = "#ef4444"; // red for predicted
        ctx.fillText(`${c}  ${(conf * 100).toFixed(1)}%`, 48, y);
      } else {
        ctx.fillStyle = "#374151";
        ctx.fillText(c, 48, y);
      }
    });

    // If thumbnail exists
    if (previewUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const thumbW = 300;
          const thumbH = 200;
          const x = width - thumbW - 24;
          const y = height - thumbH - 24;
          ctx.drawImage(img, x, y, thumbW, thumbH);
          ctx.strokeStyle = "#9ca3af";
          ctx.strokeRect(x, y, thumbW, thumbH);
          resolve();
        };
        img.src = previewUrl;
      });
    }

    const link = document.createElement("a");
    link.download = `ecosort_result_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Scan Waste</h1>
        <p style={{ color: "#555", marginBottom: 16 }}>
          Upload an image and click Scan Now to classify the waste type.
        </p>

      {/* Green themed drop area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          border: 0,
          borderRadius: 20,
          padding: 32,
          textAlign: "center",
          background: "#16a34a",
          marginBottom: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}
      >
        {/* Content */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "block", margin: "0 auto 8px" }}
          />
          <div style={{ color: "#ffffff" }}>
            Drag & drop an image here, or click to select.
          </div>
        </div>
      </div>

      {previewUrl && (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      )}

      <button
        onClick={handleScan}
        disabled={loading || !file}
        style={{
          padding: "10px 16px",
          background: loading || !file ? "#9ca3af" : "#2563eb",
          color: "white",
          border: 0,
          borderRadius: 8,
          cursor: loading || !file ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Scanning..." : "Scan Now"}
      </button>

      {error && (
        <div style={{ color: "#b91c1c", marginTop: 12 }}>Error: {error}</div>
      )}

      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#ffffff",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Prediction</div>
          <div>Category: {result.category}</div>
          <div>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
          <div style={{ color: "#6b7280", marginTop: 4 }}>Description: {result.description}</div>
          <div style={{ color: "#16a34a", marginTop: 4, fontWeight: 500 }}>Disposal: {result.disposal}</div>
          <div style={{ color: "#6b7280", marginTop: 4, fontSize: "0.875rem" }}>
            Model Accuracy: {(result.overallAccuracy * 100).toFixed(1)}%
          </div>

          {/* Classes board */}
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
            {classes.map((c) => {
              const isPred = result && c.toLowerCase() === result.category.toLowerCase();
              const palette = colorByClass[c as keyof typeof colorByClass] || { bg: "#fff", text: "#111827" };
              return (
                <div
                  key={c}
                  style={{
                    border: isPred ? `2px solid ${palette.text}` : "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: isPred ? palette.bg : "#ffffff",
                    color: isPred ? palette.text : "#111827",
                    fontWeight: isPred ? 700 : 600,
                  }}
                >
                  <span>{c}</span>
                  {isPred && <span>{(result.confidence * 100).toFixed(1)}%</span>}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={downloadSummaryImage}
              style={{
                padding: "8px 12px",
                background: "#10b981",
                color: "white",
                border: 0,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Download Result Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}