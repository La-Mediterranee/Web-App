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
	sourceDir: DirPath;
	outDir: DirPath;
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
