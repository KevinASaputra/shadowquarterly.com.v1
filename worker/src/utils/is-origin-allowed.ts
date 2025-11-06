import { allowedDomains } from '../config/app';

export function isOriginAllowed(origin: string | null): boolean {
	if (origin) {
		return allowedDomains.some((regex) => regex.test(origin));
	}

	return false;
}
