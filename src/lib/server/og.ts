import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { openSync } from "fontkit";
import type { Font } from "fontkit";
import logoComponent from "$lib/components/Logo.svelte?raw";
import { podcastEntries, posts, talkEntries } from "$lib/server/content";
import { SITE_TITLE } from "$lib/siteConfig";

export interface OgEntry {
  kind: "page" | "blog" | "talk" | "podcast";
  slug: string;
  title: string;
}

export const ogEntries: OgEntry[] = [
  { kind: "page", slug: "home", title: SITE_TITLE },
  { kind: "page", slug: "about", title: "about" },
  { kind: "page", slug: "contents", title: "everything" },
  ...posts.map(({ slug, title }) => ({ kind: "blog" as const, slug, title })),
  ...talkEntries.map(({ slug, title }) => ({
    kind: "talk" as const,
    slug,
    title,
  })),
  ...podcastEntries.map(({ slug, title }) => ({
    kind: "podcast" as const,
    slug,
    title,
  })),
];

const logo = logoComponent.match(/<g fill="currentColor">[\s\S]*?<\/g>/)?.[0];
if (!logo) throw new Error("Could not extract the wordmark from Logo.svelte");

// Resolve package assets instead of constructing paths below node_modules. The
// latter breaks Netlify's function file tracer when pnpm uses symlinked modules.
const require = createRequire(import.meta.url);
const instrumentFont = require.resolve(
  "@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff"
);
const notoRoot = dirname(require.resolve("@fontsource/noto-sans-jp/600.css"));

interface FontSlice {
  file: string;
  ranges: Array<[number, number]>;
}

function japaneseFontSlices(): FontSlice[] {
  const css = readFileSync(resolve(notoRoot, "600.css"), "utf8");
  return [
    ...css.matchAll(
      /src: url\(\.\/files\/([^)]+)\)[\s\S]*?unicode-range:\s*([^;]+);/g
    ),
  ].map(([, file, unicodeRanges]) => ({
    // fontkit parses WOFF much faster than WOFF2. Fontsource ships both.
    file: resolve(notoRoot, "files", file.replace(/\.woff2$/, ".woff")),
    ranges: unicodeRanges.split(",").map((rawRange) => {
      const [start, end = start] = rawRange
        .trim()
        .replace(/^U\+/i, "")
        .split("-");
      return [Number.parseInt(start, 16), Number.parseInt(end, 16)];
    }),
  }));
}

const notoSlices = japaneseFontSlices();

function loadFont(file: string): Font {
  const font = openSync(file);
  if ("fonts" in font) throw new Error(`Expected a single font in ${file}`);
  return font;
}

interface FontContext {
  instrument: Font;
  japanese: Map<string, Font>;
}

function fontForCharacter(character: string, fonts: FontContext) {
  const codepoint = character.codePointAt(0)!;
  if (fonts.instrument.hasGlyphForCodePoint(codepoint)) return fonts.instrument;
  const slice = notoSlices.find(({ ranges }) =>
    ranges.some(([start, end]) => codepoint >= start && codepoint <= end)
  );
  if (!slice) return fonts.instrument;
  const cached = fonts.japanese.get(slice.file);
  if (cached) return cached;
  const font = loadFont(slice.file);
  fonts.japanese.set(slice.file, font);
  return font;
}

function characterWidth(character: string) {
  if (/\s/u.test(character)) return 0.3;
  if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(character))
    return 1;
  if (/[ilI1.,'’]/u.test(character)) return 0.3;
  if (/[mwMW@]/u.test(character)) return 0.85;
  return 0.56;
}

function textWidth(value: string) {
  return [...value].reduce(
    (width, character) => width + characterWidth(character),
    0
  );
}

function wrapTitle(title: string, maxWidth: number, fontSize: number) {
  const segments = [
    ...new Intl.Segmenter(undefined, { granularity: "word" }).segment(title),
  ].map(({ segment }) => segment);
  const maxUnits = maxWidth / fontSize;
  const lines: string[] = [];
  let line = "";

  for (const segment of segments) {
    const candidate = `${line}${segment}`;
    if (line && textWidth(candidate) > maxUnits) {
      lines.push(line.trim());
      line = segment.trimStart();
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

function titleLayout(title: string) {
  for (const fontSize of [68, 60, 52, 46]) {
    const lines = wrapTitle(title, 1000, fontSize);
    if (lines.length <= 3) return { fontSize, lines };
  }

  const lines = wrapTitle(title, 1000, 46);
  const visible = lines.slice(0, 3);
  visible[2] = `${visible[2].replace(/[.…]*$/u, "")}…`;
  return { fontSize: 46, lines: visible };
}

function vectorText(
  value: string,
  x: number,
  baseline: number,
  fontSize: number,
  letterSpacing: number,
  fonts: FontContext
) {
  const runs: Array<{ font: Font; text: string }> = [];
  for (const character of value) {
    const font = fontForCharacter(character, fonts);
    const lastRun = runs.at(-1);
    if (lastRun?.font === font) lastRun.text += character;
    else runs.push({ font, text: character });
  }

  let cursor = x;
  const paths: string[] = [];
  for (const { font, text } of runs) {
    const scale = fontSize / font.unitsPerEm;
    const layout = font.layout(text);
    for (let index = 0; index < layout.glyphs.length; index += 1) {
      const glyph = layout.glyphs[index];
      const position = layout.positions[index];
      const path = glyph.path.toSVG();
      if (path) {
        paths.push(
          `<path d="${path}" transform="translate(${
            cursor + position.xOffset * scale
          } ${
            baseline - position.yOffset * scale
          }) scale(${scale} ${-scale})" fill="#21201c"/>`
        );
      }
      cursor += position.xAdvance * scale + letterSpacing;
    }
  }
  return paths.join("");
}

export function renderOgImage(entry: OgEntry) {
  // Fontkit caches mutable shaping state, so each image gets an isolated context.
  const fonts: FontContext = {
    instrument: loadFont(instrumentFont),
    japanese: new Map(),
  };
  const { fontSize, lines } = titleLayout(entry.title);
  const lineHeight = fontSize * 1.14;
  const blockHeight = lineHeight * lines.length;
  const startY = 316 - blockHeight / 2 + fontSize * 0.82;
  const label = entry.kind === "page" ? "theosteiner.de" : entry.kind;
  const title = lines
    .map((line, index) =>
      vectorText(line, 100, startY + index * lineHeight, fontSize, -1.2, fonts)
    )
    .join("");

  const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" style="color:#21201c">
			<rect width="1200" height="630" fill="#fcfcfa"/>
			<rect x="0" y="0" width="18" height="630" fill="#facc15"/>
			<g transform="translate(100 72) scale(1.14)">${logo}</g>
			${title}
			<g opacity="0.65">${vectorText(label.toUpperCase(), 100, 558, 22, 2, fonts)}</g>
		</svg>
	`;

  return new Resvg(svg, {
    fitTo: { mode: "original" },
  })
    .render()
    .asPng();
}
