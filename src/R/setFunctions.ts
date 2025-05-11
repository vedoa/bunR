import type { RObject, WebR } from "webr";

/**
 * Helper method to run custom R script
 * 
 * @param webR Initialized WebR object 
 * @param pathScript path to script
 * @returns result of script as RObject
 */
export const getCustomRFunction = async (
	webR: WebR,
	pathScript: string,
): Promise<RObject> => {
	const script = Bun.file(pathScript);
	return await webR.evalR(await script.text());
};
