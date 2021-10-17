type MaybeUndefined<T> = T | undefined;
type MaybePromise<T> = T | Promise<T>;

// Apple Splash Screen
type PixelDensity = 2 | 3;

//Ipads
type IpadScreeenResolutions = {
	'1536x2048': 2;
	'1668x2224': 2;
	'1620x2160': 2;
	'1668x2388': 2;
	'2048x2732': 2;
};

type IphoneScreeenResolutions = {
	'750x1334': 2;
	'828x1792': 2;
	'1080x1920': 3;
	'1125x2436': 3;
	'1170x2532': 3;
	'1284x2778': 3;
};

type ScreenResolutionsWithDensity = IphoneScreeenResolutions & IpadScreeenResolutions;

// Sitemap
type RobotsPolicy = {
	userAgent: string;
	allow?: string[];
	disallow?: string[];
};

type AlternateRef = {
	href: string;
	hreflang: string;
};

interface RobotsTxt {
	policies?: RobotsPolicy[];
	additionalSitemaps?: string[];
}

type AdditionalPathsConfig = Readonly<
	SitemapConfig & {
		transform: NonNullable<SitemapConfig['transform']>;
	}
>;

type ChangeFrequenzy = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

type SitemapField = {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: number;
	alternateRefs?: AlternateRef[];
};

type OptionalSitemapConfig = {
	changefreq: ChangeFrequenzy;
	priority: number;
	sitemapBaseFileName: string;
	sourceDir: string;
	outDir: string;
	sitemapSize: number;
	// generateRobotsTxt: boolean;
	robotsTxt: RobotsTxt;
	autoLastmod: boolean;
	exclude: Readonly<string[]>;
	alternateRefs: Readonly<AlternateRef[]>;
	transform: (config: SitemapConfig, url: string) => MaybePromise<MaybeUndefined<SitemapField>>;
	additionalPaths: (config: AdditionalPathsConfig) => MaybePromise<MaybeUndefined<SitemapField>[]>;
	trailingSlash: boolean;
};

interface SitemapConfig extends Partial<OptionalSitemapConfig> {
	siteUrl: string;
}
