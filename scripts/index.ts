import website from './config/website';

import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

main();

async function main(lang = 'de') {
	const pollyfills = `<script>
			${readFileSync(resolve(__dirname, './pollyfills.js'))}
	</script>`;

	const head = `${pollyfills}`;

	const html = `
	<!DOCTYPE html>
	<html lang="${lang}">
		${writeHead(head)}

		<body>
			<div id="svelte">%svelte.body%</div>
			${firebaseA11y()}	
		</body>
	</html>`;

	writeFileSync(resolve(__dirname, './index.html'), html);
	return 0;
}

function writeHead(head?: string) {
	return `
	<head>
		${head}
		%svelte.head%
	</head>`;
}

function firebaseA11y() {
	return `
		<script>
			const observer = new MutationObserver((mutations) => {
				for (let mutation of mutations) {
					if (mutation.type === 'childList') {
						const node = mutation.addedNodes[0];
						if (node?.tagName === 'IFRAME' && node?.id?.startsWith('I0')) {
							node.style.visibility = 'hidden';
							observer.disconnect();
						}
					}
				}
			});
			observer.observe(document.body, { childList: true });
		</script>`;
}

function preConnections() {
	return `
		<link rel="preconnect" href="https://fonts.gstatic.com" />
		<link rel="dns-prefetch" href="https://fonts.gstatic.com" />

		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="dns-prefetch" href="https://fonts.googleapis.com" />

		<link rel="preconnect" href="https://www.googletagmanager.com" />
		<link rel="dns-prefetch" href="https://www.googletagmanager.com" />`;
}
