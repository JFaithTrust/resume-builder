import puppeteer from "puppeteer";

export const runtime = "nodejs";

const DEFAULT_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];
const MM_TO_PX = 96 / 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX);
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX);
const MIN_SCALE = 0.7;

export async function POST(request: Request) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    const { origin } = await request.json();

    if (!origin) {
      return new Response(JSON.stringify({ message: "Missing origin" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    browser = await puppeteer.launch({
      headless: true,
      args: DEFAULT_ARGS,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      deviceScaleFactor: 2,
    });
    await page.emulateMediaType("print");
    const targetUrl = `${origin}?pdf=1`;

    await page.goto(targetUrl, { waitUntil: "networkidle0" });
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contentHeight = await page.evaluate(() => {
      const resume = document.querySelector<HTMLElement>(".resume-wrapper");
      return resume?.scrollHeight ?? document.body.scrollHeight;
    });

    const safeContentHeight = Math.max(contentHeight || A4_HEIGHT_PX, 1);
    const desiredScale = Math.min(1, A4_HEIGHT_PX / safeContentHeight);
    const scale = Math.max(MIN_SCALE, desiredScale);

    if (scale < 1) {
      await page.evaluate(
        (value, widthMm, heightMm) => {
          const resume = document.querySelector<HTMLElement>(".resume-wrapper");
          if (resume) {
            resume.style.transformOrigin = "top left";
            resume.style.transform = `scale(${value})`;
            resume.style.width = `${widthMm / value}mm`;
            resume.style.minHeight = `${heightMm / value}mm`;
          }

          const root = document.documentElement;
          root.style.backgroundColor = "#ffffff";
          document.body.style.margin = "0";
          document.body.style.padding = "0";
        },
        scale,
        A4_WIDTH_MM,
        A4_HEIGHT_MM,
      );
    }

    const pdfBuffer = await page.pdf({
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      printBackground: true,
      scale: 1,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: "1",
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
