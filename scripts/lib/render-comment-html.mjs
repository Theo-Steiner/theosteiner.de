import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const sanitizerOptions = {
	allowedTags: [
		'p',
		'br',
		'a',
		'blockquote',
		'pre',
		'code',
		'ul',
		'ol',
		'li',
		'strong',
		'em',
		'del',
		'hr',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'table',
		'thead',
		'tbody',
		'tr',
		'th',
		'td',
		'img'
	],
	allowedAttributes: {
		a: ['href', 'title', 'rel'],
		code: ['class'],
		ol: ['start'],
		th: ['align'],
		td: ['align'],
		img: ['src', 'alt', 'title', 'width', 'height']
	},
	allowedClasses: {
		code: [/^language-[a-z0-9_-]+$/i]
	},
	allowedSchemes: ['http', 'https', 'mailto'],
	allowedSchemesByTag: {
		img: ['https']
	},
	allowProtocolRelative: false,
	enforceHtmlBoundary: true,
	transformTags: {
		a: sanitizeHtml.simpleTransform(
			'a',
			{ rel: 'nofollow noopener noreferrer' },
			true
		)
	}
};

export function sanitizeCommentHtml(html) {
	return sanitizeHtml(html, sanitizerOptions);
}

export function renderCommentHtml(markdown) {
	const html = marked.parse(markdown, {
		gfm: true,
		breaks: true,
		async: false
	});

	return sanitizeCommentHtml(html);
}
