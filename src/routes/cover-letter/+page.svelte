<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const printLetter = () => window.print();
</script>

<Seo
	title="Letter"
	description="Theodor Steiner - letter."
	path="/letter"
	noindex
/>

<div class="letter-page">
	<div class="toolbar">
		<a href="https://theosteiner.de" class="back-link">← theosteiner.de</a>
		<span class="privacy-note">cover letter</span>
		<button type="button" onclick={printLetter}>Print / save as PDF</button>
	</div>

	<article class="letter-document">
		<header class="letter-header">
			<div class="identity">
				<a class="brand" href="https://theosteiner.de" aria-label="theosteiner.de">
					<Logo height={15} title="theosteiner" />
				</a>
			</div>

			<div class="contact" aria-label="Contact information">
				<a href="mailto:theo@theosteiner.de">theo@theosteiner.de</a>
			</div>
		</header>

		<div class="letter-body">
			<p class="salutation">Dear XXX,</p>
			<p>
				Hello,
				<a href="/">bye!</a>
			</p>

			<p class="closing">
				Best,<br />
				<span class="signature">Theo Steiner</span>
			</p>
		</div>

		<footer class="letter-footer">
			<p>Tokyo, Japan</p>
			<p class="footer-mark"><span></span> <a class="detail-link" href="https://theosteiner.de">theosteiner.de</a></p>
		</footer>
	</article>
</div>

<style>
	:global(html:has(.letter-page)) {
		background: #efeee9;
	}

	:global(body:has(.letter-page)) {
		background: #efeee9;
	}

	.letter-page {
		box-sizing: border-box;
		min-height: 100dvh;
		padding: 28px 20px 48px;
		color: #21201c;
	}

	.toolbar {
		width: min(210mm, 100%);
		margin: 0 auto 16px;
		display: flex;
		align-items: center;
		gap: 16px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: #77746b;
	}

	.back-link {
		color: inherit;
		text-decoration: none;
	}

	.back-link:hover {
		color: #21201c;
	}

	.privacy-note {
		margin-right: auto;
	}

	.toolbar button {
		border: 0;
		border-radius: 999px;
		padding: 9px 14px;
		background: #21201c;
		color: #fcfcfa;
		font: 600 11px/1 var(--font-mono);
		cursor: pointer;
		transition:
			transform 180ms var(--ease-pop),
			background 180ms ease;
	}

	.toolbar button:hover {
		transform: translateY(-1px);
		background: var(--red);
	}

	.letter-document {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: min(210mm, 100%);
		min-height: 297mm;
		margin: 0 auto;
		padding: 16mm 18mm 12mm;
		background: #fcfcfa;
		box-shadow: 0 18px 60px rgb(42 40 32 / 12%);
		font-size: 10.2pt;
		line-height: 1.62;
	}

	.letter-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		padding-bottom: 5mm;
		border-bottom: 1px solid #dcd9d0;
	}

	.brand {
		display: inline-block;
		color: #21201c;
		text-decoration: none;
	}

	.contact {
		display: grid;
		gap: 2px;
		text-align: right;
		font-family: var(--font-mono);
		font-size: 6.5pt;
	}

	.contact a,
	.detail-link {
		color: #57544b;
		text-decoration: none;
	}

	.contact a:hover,
	.detail-link:hover {
		color: var(--red);
	}

	.letter-body {
		flex: 1;
		margin-top: 8mm;
		color: #2c2a25;
	}

	.letter-body p {
		margin: 0 0 4.2mm;
	}

	.letter-body p:last-child {
		margin-bottom: 0;
	}

	.letter-body a {
		color: var(--red);
		text-decoration: none;
		border-bottom: 1px solid rgba(0, 0, 0, 0.14);
	}

	.letter-body a:hover {
		border-bottom-color: var(--red);
	}

	.salutation {
		font-weight: 550;
	}

	.closing {
		margin-top: 6mm !important;
	}

	.signature {
		display: inline-block;
		margin-top: 1.5mm;
		font-size: 12.5pt;
		font-weight: 650;
		letter-spacing: -0.01em;
	}

	.letter-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 9mm;
		padding-top: 3mm;
		border-top: 1px solid #dcd9d0;
		font-family: var(--font-mono);
		font-size: 6.1pt;
		color: #625f56;
	}

	.letter-footer p {
		margin: 0;
	}

	.footer-mark {
		flex: none;
	}

	.footer-mark span {
		display: inline-block;
		width: 5px;
		height: 5px;
		margin-right: 4px;
		border-radius: 50%;
		background: var(--red);
	}

	@media (max-width: 720px) {
		.letter-page {
			padding: 18px 12px 32px;
		}

		.toolbar {
			flex-wrap: wrap;
		}

		.privacy-note {
			display: none;
		}

		.toolbar button {
			margin-left: auto;
		}

		.letter-document {
			min-height: 0;
			padding: 28px 22px;
			font-size: 14px;
			line-height: 1.6;
		}

		.letter-header {
			display: block;
		}

		.contact {
			margin-top: 18px;
			text-align: left;
			font-size: 10px;
		}

		.letter-body {
			margin-top: 24px;
		}

		.letter-body p {
			margin-bottom: 16px;
		}

		.signature {
			font-size: 17px;
		}

		.letter-footer {
			margin-top: 28px;
			font-size: 9px;
		}
	}

	@page {
		size: A4 portrait;
		margin: 0;
	}

	@media print {
		:global(html),
		:global(body) {
			width: auto;
			height: auto;
			margin: 0;
			padding: 0;
			background: #fcfcfa !important;
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}

		.letter-page {
			width: auto;
			min-height: 0;
			height: auto;
			margin: 0;
			padding: 0;
		}

		.toolbar {
			display: none;
		}

		.letter-document {
			width: 210mm;
			height: auto;
			min-height: 0;
			margin: 0;
			padding: 15mm 18mm 12mm;
			box-shadow: none;
			overflow: visible;
			font-size: 10.2pt;
			line-height: 1.55;
			break-inside: avoid;
			page-break-inside: avoid;
		}

		.letter-header {
			display: flex;
			padding-bottom: 5mm;
		}

		.contact {
			margin-top: 0;
			text-align: right;
			font-size: 6.5pt;
		}

		.letter-body {
			margin-top: 7mm;
		}

		.letter-body p {
			margin-bottom: 3.8mm;
		}

		.closing {
			margin-top: 6mm !important;
		}

		.signature {
			font-size: 12.5pt;
		}

		.letter-body a {
			border-bottom: none;
		}

		.letter-footer {
			margin-top: 6mm;
			font-size: 6.1pt;
		}

		a {
			color: inherit !important;
		}
	}
</style>
