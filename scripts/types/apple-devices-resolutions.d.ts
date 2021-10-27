// Apple Splash Screen
type PixelDensity = 2 | 3;

// type ScreenResolutions = {
// 	'375x667': PixelDensity[];
// 	'375x812': PixelDensity[];
// 	'390x844': PixelDensity[];
// 	'414x736': PixelDensity[];
// 	'414x896': PixelDensity[];
// 	'428x926': PixelDensity[];
// 	'768x1024': PixelDensity[];
// 	'810x1080': PixelDensity[];
// 	'834x1112': PixelDensity[];
// 	'834x1194': PixelDensity[];
// 	'1024x1366': PixelDensity[];
// };

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
