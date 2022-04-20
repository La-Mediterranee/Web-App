import { seti18nContext } from '$i18n/utils';
import { setAllergensContext } from './allergens';
import { setAnimationsContext } from './animations';
import { setAppContext } from './app';

function setStores() {
	seti18nContext();
	setAppContext();
	setAllergensContext();
	setAnimationsContext();
}
