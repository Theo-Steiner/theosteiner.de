<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const printResume = () => window.print();
</script>

<Seo
	title="Résumé"
	description="Theodor Steiner — software engineer, open-source contributor, conference speaker, and community builder in Tokyo."
	path="/resume"
	noindex
/>

<div class="resume-page">
	<div class="toolbar">
		<a href="https://theosteiner.de" class="back-link">← theosteiner.de</a>
		<span class="privacy-note">résumé</span>
		<button type="button" onclick={printResume}>Print / save as PDF</button>
	</div>

	<article class="resume-document">
		<header class="resume-header">
			<div class="identity">
				<a class="brand" href="https://theosteiner.de" aria-label="theosteiner.de">
					<Logo height={15} title="theosteiner" />
				</a>
				<h1>Theodor Baltus Steiner</h1>
				<p class="role">Software Engineer, Frontend Technical Lead <span aria-hidden="true">·</span> Tokyo, Japan</p>
			</div>

			<div class="contact" aria-label="Contact information">
				<a href="mailto:theo@theosteiner.de">theo@theosteiner.de</a>
				<a href="https://theosteiner.de">theosteiner.de</a>
				<a href="https://github.com/Theo-Steiner">github.com/Theo-Steiner</a>
				<a href="https://bsky.app/profile/theosteiner.de">bsky.app/profile/theosteiner.de</a>
			</div>
		</header>

		<section class="profile" aria-labelledby="profile-heading">
			<h2 id="profile-heading">Profile</h2>
			<p>
				Product-minded software engineer specializing in <strong>TypeScript, frontend
				architecture, and developer tooling</strong>. Leads multi-million-user products at LY
				Corporation and turns complex platform knowledge into reusable systems adopted across
				teams. <strong>Persistent problem solver, open-source contributor, conference speaker, and community builder</strong> who
				carries ambiguous problems from first diagram to production.
			</p>
		</section>

		<div class="resume-columns">
			<main class="experience">
				<section aria-labelledby="experience-heading">
					<h2 id="experience-heading">Experience</h2>

					<div class="entry">
						<div class="entry-heading">
							<div>
								<h3>LY Corporation</h3>
								<p class="entry-role">Software Engineer · Official Account Business Platform</p>
							</div>
							<p class="date">Oct 2022–present</p>
						</div>

						<p class="recognition">
							Promoted twice in under three years; consistently rated in LY Corporation’s
							top performance bands.
						</p>

						<ul>
							<li>
								<strong>Lead frontend architecture</strong> for Order with LINE, a greenfield,
								multi-tenant restaurant-ordering product integrated with LINE Messenger.
								Designed real-time synchronization with optimistic updates and single-flight
								mutations.
							</li>
							<li>
								Initiated and helped lead a multi-year effort to unify the launch architecture
								of several large LINE applications, <strong>coordinating across multiple engineering teams</strong>.
							</li>
							<li>
								Own frontend technical direction across a portfolio of Official Account
								consumer applications—including ordering, profiles, coupons, memberships, and
								loyalty products - collectively serving <strong>millions of daily active users</strong>.
							</li>
							<li>
								Architecting an <strong>LLM-powered QA agent</strong> to automate regression
								testing across consumer LIFF applications, increasing delivery velocity while
								preserving production quality.
							</li>
							<li>
								Created type-safe tooling for localization and telemetry platforms, deriving
								application types from platform specifications to move correctness checks into
								the compiler. The tools reduce integration errors and are used by
								<strong>5+ teams</strong>.
							</li>
							<li>
								Reworked <strong>deployment architecture</strong> shared by multiple consumer applications to decouple frontend and backend releases.
							</li>
							<li>
								Contributed accessible web-component implementations to LY Corporation’s toly design library.
							</li>
							<li>
								Represented LY Corporation at Google I/O three times, giving direct feedback on
								proposed web-platform features and <strong>building technical relationships</strong> with
								engineers at Google.
							</li>
						</ul>
						<a class="detail-link" href="https://www.lycorp.co.jp/en/company/">lycorp.co.jp ↗</a>
					</div>

					<div class="entry compact-entry">
						<div class="entry-heading">
							<div>
								<h3>MortimerBaltus</h3>
								<p class="entry-role">Co-founder & Software Engineer · Germany / Remote</p>
							</div>
							<p class="date">Jan 2021–present</p>
						</div>
						<ul>
							<li>
								Co-founded a web-development agency and delivered production applications for
								a German tax SaaS company, the 5-Now platform, and small-business clients.
							</li>
							<li>
								Led client discovery, technical scoping, estimation, prototyping,
								implementation, and deployment support.
							</li>
						</ul>
						<a class="detail-link" href="https://mortimerbaltus.com">mortimerbaltus.com ↗</a>
					</div>
				</section>

			</main>

			<aside>
				<section aria-labelledby="community-heading">
					<h2 id="community-heading">Community</h2>
					<div class="side-entry">
						<div class="side-title">
							<h3>UIT INSIDE Podcast</h3>
							<span>since Jun 2023</span>
						</div>
						<p>
							<strong>Produced and hosted</strong> episodes in English and Japanese,
							<strong>developing topics and booking</strong> prominent developers including Dan
							Abramov, Anthony Fu, and Sapphi-red.
						</p>
						</div>
					<div class="side-entry">
						<div class="side-title">
							<h3>Svelte Ambassador</h3>
							<span>since Jan 2022</span>
						</div>
						<p>
							Inaugural ambassador, API feedback contributor, and moderator of the global
							Svelte and Svelte Japan Discord communities.
						</p>
						<p>
							Helped grow Svelte Japan from <strong>&lt;100 to &gt;1,000 members</strong>;
							organized its first in-person meetup and multiple online and offline events.
						</p>
					</div>
				</section>

				<section aria-labelledby="education-heading">
					<h2 id="education-heading">Education</h2>
					<div class="side-entry education-entry">
						<h3>MA, Japanese Studies</h3>
						<p>Sophia University · 2022</p>
						<p>GPA 4.0 · MEXT Honors Scholarship</p>
						<p>Built a web-based GIS platform for cartographic literary analysis.</p>
					</div>
					<div class="side-entry education-entry">
						<h3>BA, East Asian Studies</h3>
						<p>Universität Hamburg · 2020</p>
						<p>German Grade: 1.58 · DAAD Scholarship</p>
						<p>Minor in Computer Science</p>
					</div>
				</section>

				<section aria-labelledby="skills-heading">
					<h2 id="skills-heading">Skills</h2>
					<dl class="skills">
						<div>
							<dt>Primary</dt>
							<dd>TypeScript, JavaScript, Svelte, Vue, React, Node.js</dd>
						</div>
						<div>
							<dt>Additional</dt>
							<dd>SQL, Go, Python, ATProto</dd>
						</div>
						<div>
							<dt>Focus</dt>
							<dd>
								Software architecture, library development, developer tooling,
								web components, real-time applications
							</dd>
						</div>
					</dl>
				</section>
			</aside>
		</div>

		<section class="projects-main" aria-labelledby="projects-heading">
			<h2 id="projects-heading">Projects & OSS</h2>

			<div class="projects-grid">
				<div class="project-card">
					<div class="side-title">
						<h3>tiger.mom</h3>
						<span>founder</span>
					</div>
					<p>
						AI accountability app for iOS that restricts distractions until users submit evidence
						of progress. Native iOS and Go with a custom model harness, Markdown memory, fine tuned Apple
						Foundation Models, and Gemini fallback.
					</p>
					<a class="detail-link" href="https://tiger.mom">tiger.mom ↗</a>
				</div>

				<div class="project-card">
					<div class="side-title">
						<h3>svebcomponents</h3>
						<span>creator</span>
					</div>
					<p>
						Created an open source library for building server-renderable web components with Svelte.<br/>
						Presented on the main stage at Svelte Summit Spring 2025.
					</p>
					<a class="detail-link" href="https://svebcomponents.dev">svebcomponents.dev ↗</a>
				</div>

				<div class="project-card">
					<div class="side-title">
						<h3>open source</h3>
						<span>contributor</span>
					</div>
					<p>
						Contributor to Node.js, Svelte, SvelteKit, spanning runtime reliability, documentation, developer tooling, and framework ergonomics.<br/>
					</p>
					<a class="detail-link" href="https://github.com/search?q=is:pr+author:Theo-Steiner+is:merged+-user:Theo-Steiner+-org:svebcomponents&type=pullrequests&p=1">github.com ↗</a>
				</div>
			</div>
		</section>

		<footer class="resume-footer">
			<p>
				<strong>Languages</strong> German — native · Japanese — professional, JLPT N1 ·
				English — professional, IELTS 8.0
			</p>
			<p class="footer-mark"><span></span> <a class="detail-link" href="https://theosteiner.de/resume">theosteiner.de/resume</a></p>
		</footer>
	</article>
</div>

<style>
	:global(html:has(.resume-page)) {
		background: #efeee9;
	}

	:global(body:has(.resume-page)) {
		background: #efeee9;
	}

	.resume-page {
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

	.resume-document {
		box-sizing: border-box;
		width: min(210mm, 100%);
		min-height: 297mm;
		margin: 0 auto;
		padding: 12mm 13mm 9mm;
		background: #fcfcfa;
		box-shadow: 0 18px 60px rgb(42 40 32 / 12%);
		font-size: 8.3pt;
		line-height: 1.36;
	}

	.resume-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		padding-bottom: 4.5mm;
		border-bottom: 1px solid #dcd9d0;
	}

	.brand {
		display: inline-block;
		margin-bottom: 3.5mm;
		color: #21201c;
		text-decoration: none;
	}

	h1 {
		margin: 0;
		font-size: 21px;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.05;
	}

	.role {
		margin: 6px 0 0;
		font-size: inherit;
		font-weight: 500;
		color: #625f56;
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

	.profile {
		display: grid;
		grid-template-columns: 25mm 1fr;
		gap: 5mm;
		margin: 4.5mm 0 5mm;
		padding: 3.8mm 4.2mm;
		background: rgba(250, 204, 21, 0.13);
		border-left: 2.5px solid var(--yellow);
	}

	.profile h2 {
		margin: 1px 0 0;
	}

	.profile p {
		margin: 0;
		font-size: inherit;
		line-height: inherit;
		color: #34322d;
	}

	.profile strong {
		font-weight: 650;
	}

	.resume-columns {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 4mm;
	}

	.experience {
		grid-column: span 2;
		padding-right: 4mm;
		border-right: 1px solid #e3e1da;
	}

	aside {
		grid-column: span 1;
	}

	section + section {
		margin-top: 5mm;
	}

	h2 {
		margin: 0 0 2.4mm;
		font-family: var(--font-mono);
		font-size: 7pt;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #77746b;
	}

	h3 {
		margin: 0;
		font-size: 9.1pt;
		font-weight: 680;
		letter-spacing: -0.012em;
		line-height: 1.2;
	}

	.entry + .entry {
		margin-top: 5mm;
	}

	.entry-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.entry-role {
		margin: 2px 0 0;
		font-size: 7.1pt;
		font-weight: 520;
		color: #57544b;
	}

	.date {
		flex: none;
		margin: 1px 0 0;
		font-family: var(--font-mono);
		font-size: 6.5pt;
		color: #77746b;
		white-space: nowrap;
	}

	.recognition {
		margin: 2.2mm 0;
		padding: 1.6mm 2.2mm;
		background: #f3f1ea;
		font-size: inherit;
		color: #403e37;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		position: relative;
		margin-top: 1.65mm;
		padding-left: 3.2mm;
	}

	li::before {
		content: '';
		position: absolute;
		top: 0.53em;
		left: 0;
		width: 1.2mm;
		height: 1.2mm;
		border-radius: 50%;
		background: var(--red);
	}

	.side-entry + .side-entry {
		margin-top: 3.2mm;
		padding-top: 3.2mm;
		border-top: 1px solid #ebe9e3;
	}

	aside section + section {
		margin-top: 7mm;
	}

	.side-title {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}

	.side-title span {
		font-family: var(--font-mono);
		font-size: 6pt;
		color: #8a877e;
		white-space: nowrap;
	}

	.side-entry p {
		margin: 1.2mm 0 0;
		color: #4a4841;
	}

	.projects-main {
		margin-top: 5.5mm;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 4mm;
	}

	.project-card {
		padding-top: 2.6mm;
		border-top: 1px solid #dcd9d0;
	}

	.project-card p {
		margin: 1.2mm 0 0;
		color: #4a4841;
	}

	.detail-link {
		display: inline-block;
		margin-top: 1.1mm;
		font-family: var(--font-mono);
		font-size: 6.1pt;
	}

	.education-entry p {
		margin-top: 0.8mm;
	}

	.skills {
		margin: 0;
		display: grid;
		gap: 1.5mm;
		color: #4a4841;
		line-height: 1.4;
	}

	.skills div {
		display: grid;
		grid-template-columns: 15.5mm minmax(0, 1fr);
		gap: 1.5mm;
		align-items: baseline;
	}

	.skills dt {
		font-family: var(--font-mono);
		font-size: 6.1pt;
		font-weight: 650;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #77746b;
	}

	.skills dd {
		min-width: 0;
		margin: 0;
	}

	.resume-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 5mm;
		padding-top: 3mm;
		border-top: 1px solid #dcd9d0;
		font-family: var(--font-mono);
		font-size: 6.1pt;
		color: #625f56;
	}

	.resume-footer p {
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
		.resume-page {
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

		.resume-document {
			min-height: 0;
			padding: 28px 22px;
			font-size: 12px;
			line-height: 1.45;
		}

		.resume-header {
			display: block;
		}

		h1 {
			font-size: clamp(24px, 7vw, 32px);
		}

		.contact {
			margin-top: 18px;
			text-align: left;
			font-size: 10px;
		}

		.profile {
			display: block;
			margin: 22px 0 28px;
			padding: 18px;
		}

		.profile h2 {
			margin-bottom: 10px;
		}

		.resume-columns {
			display: block;
		}

		aside {
			margin-top: 28px;
			padding: 0;
			border: 0;
		}

		.experience {
			padding-right: 0;
			border-right: 0;
		}

		.projects-grid {
			display: block;
		}

		.project-card + .project-card {
			margin-top: 18px;
		}

		.skills {
			gap: 8px;
		}

		.skills div {
			grid-template-columns: 78px minmax(0, 1fr);
			gap: 10px;
		}

		section + section {
			margin-top: 28px;
		}

		h2 {
			margin-bottom: 12px;
			font-size: 10px;
		}

		h3 {
			font-size: 15px;
		}

		.entry-role {
			font-size: 11px;
		}

		.date {
			font-size: 9px;
		}

		.recognition {
			margin: 10px 0;
			padding: 9px 10px;
		}

		.side-title span,
		.detail-link {
			font-size: 9px;
		}

		li {
			margin-top: 9px;
			padding-left: 14px;
		}

		li::before {
			width: 5px;
			height: 5px;
		}

		.resume-footer {
			display: block;
			margin-top: 28px;
			font-size: 9px;
			line-height: 1.5;
		}

		.footer-mark {
			margin-top: 8px !important;
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

		.resume-page {
			width: auto;
			min-height: 0;
			height: auto;
			margin: 0;
			padding: 0;
		}

		.toolbar {
			display: none;
		}

		.resume-document {
			width: 210mm;
			height: auto;
			min-height: 0;
			margin: 0;
			padding: 7mm 13mm 6mm;
			box-shadow: none;
			overflow: visible;
			font-size: 8.3pt;
			line-height: 1.36;
			break-inside: avoid;
			page-break-inside: avoid;
		}

		.resume-header {
			display: flex;
			padding-bottom: 3.5mm;
		}

		.brand {
			margin-bottom: 2.5mm;
		}

		h1 {
			font-size: 21px;
		}

		.contact {
			margin-top: 0;
			text-align: right;
			font-size: 6.5pt;
		}

		.profile {
			display: grid;
			grid-template-columns: 25mm 1fr;
			margin: 3.5mm 0 4mm;
			padding: 3mm 4mm;
		}

		.profile h2 {
			margin: 1px 0 0;
		}

		.resume-columns {
			display: grid;
		}

		aside {
			margin-top: 0;
		}

		section + section {
			margin-top: 4mm;
		}

		h2 {
			margin-bottom: 2.4mm;
			font-size: 7pt;
		}

		h3 {
			font-size: 9.1pt;
		}

		aside section + section {
			margin-top: 5mm;
		}

		.entry + .entry {
			margin-top: 4mm;
		}

		.recognition {
			margin: 1.5mm 0;
			padding: 1.2mm 2mm;
		}

		.entry-role {
			font-size: 7.1pt;
		}

		.date {
			font-size: 6.5pt;
		}

		li {
			margin-top: 1.35mm;
			padding-left: 3.2mm;
		}

		li::before {
			width: 1.2mm;
			height: 1.2mm;
		}

		.projects-main {
			margin-top: 4mm;
		}

		.projects-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.project-card {
			padding-top: 2mm;
		}

		.project-card + .project-card {
			margin-top: 0;
		}

		.side-title span {
			font-size: 6pt;
		}

		.detail-link {
			font-size: 6.1pt;
		}

		.skills {
			gap: 1.5mm;
		}

		.skills div {
			grid-template-columns: 15.5mm minmax(0, 1fr);
			gap: 1.5mm;
		}

		.resume-footer {
			display: flex;
			margin-top: 3.5mm;
			padding-top: 2.3mm;
			font-size: 6.1pt;
			line-height: 1.36;
		}

		.footer-mark {
			margin-top: 0 !important;
		}

		a {
			color: inherit !important;
		}
	}
</style>
