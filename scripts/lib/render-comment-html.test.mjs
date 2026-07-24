import assert from 'node:assert/strict';
import test from 'node:test';
import { renderCommentHtml, sanitizeCommentHtml } from './render-comment-html.mjs';

test('removes executable HTML and unsafe URLs', () => {
	const html = sanitizeCommentHtml(`
		<script>alert('nope')</script>
		<p onclick="alert('nope')">Safe text</p>
		<a href="javascript:alert('nope')">unsafe link</a>
		<img src="http://example.com/tracker.png" onerror="alert('nope')">
	`);

	assert.doesNotMatch(html, /script|onclick|onerror|javascript:|http:\/\/example/);
	assert.match(html, /<p>Safe text<\/p>/);
});

test('preserves useful Markdown as inert HTML', () => {
	const html = renderCommentHtml(`
[docs](https://example.com)

\`\`\`js
const example = "<script>";
\`\`\`
	`);

	assert.match(
		html,
		/<a href="https:\/\/example\.com" rel="nofollow noopener noreferrer">docs<\/a>/
	);
	assert.match(html, /<pre><code class="language-js">/);
	assert.match(html, /&lt;script&gt;/);
	assert.doesNotMatch(html, /<script>/);
});
