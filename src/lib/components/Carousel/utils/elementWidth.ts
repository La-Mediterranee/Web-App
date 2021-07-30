import { CarouselProps, ResponsiveType } from '../types';

function getPartialVisibilityGutter(
	responsive: ResponsiveType,
	partialVisible?: boolean,
	serverSideDeviceType?: string | undefined,
	clientSideDeviceType?: string | undefined
): number | undefined {
	let gutter: number | undefined = 0;
	const deviceType = clientSideDeviceType || serverSideDeviceType;
	if (partialVisible && deviceType) {
		gutter = responsive[deviceType].partialVisibilityGutter;
	}
	return gutter;
}

function getWidthFromDeviceType(
	deviceType: string,
	responsive: ResponsiveType
): number | string | undefined {
	let itemWidth: string;
	if (responsive[deviceType]) {
		const { items } = responsive[deviceType];
		itemWidth = (100 / items).toFixed(1);
	}
	return itemWidth;
}

function getItemClientSideWidth(
	props: CarouselProps,
	slidesToShow: number,
	containerWidth: number
): number {
	return Math.round(containerWidth / (slidesToShow + (props.centerMode ? 1 : 0)));
}

export { getWidthFromDeviceType, getPartialVisibilityGutter, getItemClientSideWidth };
