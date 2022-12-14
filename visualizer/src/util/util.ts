export function calculateUsage(total: number, free: number): number {
	let num = (total - free) / total * 100;
	return Math.round((num + Number.EPSILON) * 100) / 100;
}

const SUFFIXES: string[] = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"];

export function humanReadableSize(size: number): string {
	if (size === 0) return `0 ${SUFFIXES[0]}`;
	
	const place = Math.floor(Math.log(size) / Math.log(1024));
	const num = size / Math.pow(1024, place);
	return `${Math.round((num + Number.EPSILON) * 100) / 100} ${SUFFIXES[place]}`;
}
