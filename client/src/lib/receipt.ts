/*
 * RUJAK.Co — Receipt PNG Generator
 * Mirrors main's downloadReceiptPNG(): captures a DOM node with
 * html2canvas (loaded from CDN, same as main — avoids adding a new
 * npm dependency), triggers a local download, and best-effort uploads
 * to the `receipts` Supabase Storage bucket for the Telegram notification.
 */

import { uploadReceipt } from "./supabase-client";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Gagal memuat script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Captures `elementId` into a PNG, triggers a browser download, and
 * (best-effort) uploads it to Supabase Storage so it can be attached to
 * the Telegram admin notification.
 *
 * Returns `{ localDownload, uploadUrl, error }`:
 * - localDownload: whether the PNG was captured and downloaded to the device
 * - uploadUrl: the public Supabase URL if the upload also succeeded
 * - error: a short machine-readable reason when localDownload is false,
 *   so the caller can show the customer something more useful than
 *   "gagal" (most commonly "cors" — the logo/QRIS images embedded in the
 *   receipt are served cross-origin, and the browser will refuse to
 *   export the canvas to a PNG if that CDN doesn't return the right
 *   Access-Control-Allow-Origin header).
 */
export async function generateReceiptPNG(
  elementId: string,
  orderCode: string
): Promise<{ localDownload: boolean; uploadUrl: string | null; error: string | null }> {
  const element = document.getElementById(elementId);
  if (!element) return { localDownload: false, uploadUrl: null, error: "element-missing" };

  let html2canvas: any;
  try {
    if (typeof (window as any).html2canvas === "undefined") {
      // html2canvas-pro: fork of html2canvas with support for modern CSS
      // color functions (oklch/oklab/lab/lch/color-mix), which the stock
      // html2canvas 1.4.1 cannot parse. Our CSS uses oklch() throughout
      // (Tailwind v4 style), which made every capture — including the
      // text-only fallback — throw "unsupported color function oklch".
      await loadScript("https://cdn.jsdelivr.net/npm/html2canvas-pro@2.0.4/dist/html2canvas-pro.min.js");
    }
    html2canvas = (window as any).html2canvas;
    if (!html2canvas) return { localDownload: false, uploadUrl: null, error: "script-load-failed" };
  } catch (err) {
    console.warn("[Receipt] Failed to load html2canvas from CDN:", err);
    return { localDownload: false, uploadUrl: null, error: "script-load-failed" };
  }

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });
  } catch (err) {
    // Most commonly a cross-origin image (logo/QRIS) without the right
    // CORS headers — html2canvas throws while trying to read pixel data.
    console.warn("[Receipt] html2canvas failed to capture element (likely CORS on an embedded image):", err);
    return { localDownload: false, uploadUrl: null, error: "capture-failed-cors" };
  }

  let blob: Blob | null;
  try {
    blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))), "image/png");
    });
  } catch (err) {
    // A tainted canvas throws a SecurityError here specifically.
    console.warn("[Receipt] canvas.toBlob() failed — canvas is likely tainted by a cross-origin image:", err);
    return { localDownload: false, uploadUrl: null, error: "tainted-canvas" };
  }
  if (!blob) return { localDownload: false, uploadUrl: null, error: "no-blob" };

  // Always give the customer a local copy first.
  const safeCode = orderCode.replace(/[^a-zA-Z0-9]/g, "-");
  try {
    const localUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = localUrl;
    a.download = `${safeCode}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(localUrl);
  } catch (err) {
    console.warn("[Receipt] Local download trigger failed:", err);
    return { localDownload: false, uploadUrl: null, error: "download-trigger-failed" };
  }

  try {
    const uploadUrl = await uploadReceipt(`${safeCode}.png`, blob);
    return { localDownload: true, uploadUrl, error: null };
  } catch (uploadErr) {
    console.warn("[Receipt] Upload to Supabase Storage failed (local download still worked):", uploadErr);
    return { localDownload: true, uploadUrl: null, error: "upload-failed" };
  }
}
