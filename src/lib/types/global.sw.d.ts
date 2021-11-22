/* eslint-disable no-undef */
interface ExtendedNavigator extends WorkerNavigator, Navigator {
	/**
	 * @throws "NotSupportedError" DOMException
	 * Only on the Main Thread if the Navigator
	 * does not have a document that this action can be acted on.
	 */
	setAppBadge(contents?: any): Promise<undefined>;
	/**
	 * @throws "NotSupportedError" DOMException
	 * Only on the Main Thread if the Navigator
	 * does not have a document that this action can be acted on.
	 */
	clearAppBadge(): Promise<undefined>;
}
