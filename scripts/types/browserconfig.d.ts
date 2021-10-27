interface BrowserconfigImage {
	src: FilePath;
	width: number;
	height: number;
	/**
	 * @defaultValue `"square"`
	 */
	form?: 'wide' | 'square';
}

interface Browserconfig {
	tileColor: Color;
	logos: BrowserconfigImage[];
}
