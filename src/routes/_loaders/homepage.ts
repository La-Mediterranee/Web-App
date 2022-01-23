import type { LoadOutput } from '@sveltejs/kit';
import type { HomepageProps } from '../api/homepage';

interface HomepageLoaderInput {
	fetch(info: RequestInfo, init?: RequestInit): Promise<Response>;
}

export default async function (
	fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<LoadOutput> {
	const url = `/api/homepage`;
	const homePageData: HomepageProps = await fetch(url)
		.then(p => p.json())
		.catch(error => console.error(error));

	return {
		props: { homePageData },
	};
}
