/**
 * Converts the archived GitHub comment Markdown to sanitized, immutable HTML.
 *
 * The site renders only bodyHtml. Keeping this script idempotent makes it safe
 * to re-run when the sanitizer allowlist changes.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCommentHtml, sanitizeCommentHtml } from './lib/render-comment-html.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMMENTS_DIR = path.join(ROOT, 'src/content/comments');
const files = (await readdir(COMMENTS_DIR)).filter((file) => file.endsWith('.json')).sort();

for (const file of files) {
	const filePath = path.join(COMMENTS_DIR, file);
	const comments = JSON.parse(await readFile(filePath, 'utf8'));
	const frozen = comments.map(({ body, bodyHtml, ...comment }) => ({
		...comment,
		bodyHtml:
			typeof body === 'string'
				? renderCommentHtml(body)
				: sanitizeCommentHtml(bodyHtml ?? '')
	}));

	await writeFile(filePath, `${JSON.stringify(frozen, null, '\t')}\n`);
	console.log(`✓ ${file} (${frozen.length} comments)`);
}
