import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { RESUME_STORAGE_KEY } from "@/lib/constants";
import { DEFAULT_RESUME_DATA } from "@/lib/default-resume";
import { IResume } from "@/types/resume";

export const runtime = "nodejs";
export const maxDuration = 60;

const A4_WIDTH_MM = 210;

export async function POST(request: Request) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const { origin, resume } = (await request.json()) as {
      origin?: string;
      resume?: IResume;
    };

    if (!origin) {
      return new Response(JSON.stringify({ message: "Missing origin" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resumePayload = resume ?? DEFAULT_RESUME_DATA;
    const serializedResume = JSON.stringify(resumePayload);

    const isLocal = process.platform === "darwin" || process.platform === "win32";
    const executablePath = isLocal
      ? process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : await chromium.executablePath();

    browser = await puppeteer.launch({
      args: isLocal ? ["--no-sandbox", "--disable-setuid-sandbox"] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Set viewport to A4 width at 96 DPI so layout matches PDF output
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    await page.evaluateOnNewDocument(
      (storageKey, resumeString) => {
        try {
          window.localStorage.setItem(storageKey, resumeString);
        } catch (error) {
          console.error("localStorage write failed", error);
        }
      },
      RESUME_STORAGE_KEY,
      serializedResume,
    );

    // Use screen media to avoid CSS print page-break rules splitting the output
    await page.emulateMediaType("screen");
    const targetUrl = `${origin}?pdf=1`;

    await page.goto(targetUrl, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Force no page breaks so entire resume renders as one continuous page
    await page.addStyleTag({
      content: "* { break-inside: auto !important; break-before: auto !important; break-after: auto !important; page-break-inside: auto !important; page-break-before: auto !important; page-break-after: auto !important; }",
    });

    // Get actual content height
    const contentHeightPx = await page.evaluate(() => {
      const resume = document.querySelector<HTMLElement>(".resume-wrapper");
      return resume?.scrollHeight ?? document.body.scrollHeight;
    });

    // Convert pixels to mm (using 96 DPI standard)
    const MM_TO_PX = 96 / 25.4;
    const contentHeightMm = contentHeightPx / MM_TO_PX;

    // Set proper body styling for PDF generation
    await page.evaluate(() => {
      const root = document.documentElement;
      root.style.backgroundColor = "#ffffff";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
    });

    // Generate PDF with A4 width but dynamic height based on content
    const pdfBuffer = await page.pdf({
      width: `${A4_WIDTH_MM}mm`,
      height: `${contentHeightMm}mm`,
      printBackground: true,
      scale: 1,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: false,
    });

    const pdfArrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    ) as ArrayBuffer;

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return new Response(JSON.stringify({ message: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
