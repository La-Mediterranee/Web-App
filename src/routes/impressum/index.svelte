<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;
	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	export const prerender = true;
</script>

<script>
	import { SHOP_OWNER, SHOP_NAME } from '$lib/utils/constants';
</script>

<h1>Impressum</h1>

<!-- 
"14 July 2021" Spec says that address shouldn't contain any arbitrary addresses.
But MDN says: "In the latest spec versions however, its definition has been updated so it can now be used to mark up arbitrary addresses."
 -->
<address>
	<strong> Telefon: </strong> <a href="tel:+13115552368">01 361 90 60 90 </a><br />
	<strong> E-Mail: </strong> <a href="mailto:jim@rock.com">info@lamediterranee.at</a><br />
	<strong>Anschrift:</strong><br />
	{SHOP_NAME}<br />
	Breitenfurter Straße 189<br />
	1230 Wien
</address>

<p>
	<strong>Inhaber und Dienstanbieter i.S. §6 TDG:</strong><br />
	LA-Mediterranee Geschäftsführer: {SHOP_OWNER}
</p>

<p>
	Verantwortlich i.S. des §6 des Staatsvertrages über Mediendienste:<br />
	LA-Mediterranee Geschäftsführer: {SHOP_OWNER}
</p>

<style>
	/* your styles go here */
</style>
