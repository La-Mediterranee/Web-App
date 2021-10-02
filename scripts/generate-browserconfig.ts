import { dirname, join } from 'path';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browserconfig = join(__dirname, 'static/browserconfig.xml');

const logos: {
	src: string;
	width: number;
	height: number;
	/**
	 * @defaultValue `"square"`
	 */
	form?: 'wide' | 'square';
}[] = [
	{
		src: '',
		width: 70,
		height: 70,
	},
	{
		src: '',
		width: 150,
		height: 150,
	},
	{
		src: '',
		width: 310,
		height: 310,
	},
	{
		src: '',
		width: 310,
		height: 310,
		form: 'wide',
	},
];

function render(images: typeof logos, tileColor: string) {
	return `<?xml version="1.0" encoding="utf-8"?>
			<browserconfig>
			<msapplication>
				<tile>
				<TileColor>${tileColor}</TileColor>
					${images.map((logo) => {
						return `<${
							logo.form ||
							'square' + logo.width + 'x' + logo.height + 'logo'
						} src=${logo.src} />`;
					})}	
				</tile>
			</msapplication>
			</browserconfig>`;
}

writeFileSync(browserconfig, render(logos, '#2d89ef'));
