import { WebR } from "webr";

/**
 * Helper function to setup R
 * 
 * @returns WebR object with necessary dependencies installed
 */
export const setupR = async (): Promise<WebR> => {
	const webR = new WebR();
	console.log("[webR] Setup started")
	await webR.init();
	console.log("[webR] Install dependencies")
	await webR.installPackages(["minpack.lm"]);
	console.log("[webR] Setup finished")
	return webR;
};
