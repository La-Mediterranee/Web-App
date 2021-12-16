import { constants, promises } from 'fs';

export async function fileExists(
	fileName: string,
	type?: 'file' | 'directory'
): Promise<boolean> {
	try {
		if (type === 'file') {
			const stats = await promises.stat(fileName);
			return stats.isFile();
		} else if (type === 'directory') {
			const stats = await promises.stat(fileName);
			return stats.isDirectory();
		} else {
			await promises.access(fileName, constants.F_OK);
		}
		return true;
	} catch (err) {
		if (
			isError(err) &&
			(err.code === 'ENOENT' || err.code === 'ENAMETOOLONG')
		) {
			return false;
		}
		throw err;
	}
}

export default function isError(err: unknown): err is KitError {
	return (
		typeof err === 'object' &&
		err !== null &&
		'name' in err &&
		'message' in err
	);
}

export interface KitError extends Error {
	type?: string;
	page?: string;
	code?: string | number;
	cancelled?: boolean;
}
