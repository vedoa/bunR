import { WebR } from "webr";
import { checkInstallPackages } from "./checkPackages";

/**
 * Helper function to setup R with mounted local folder and installed packages
 *
 * @returns WebR object with necessary dependencies installed
 */
export const setupR = async (): Promise<WebR> => {
	const webR = new WebR();
	// Log
	console.log("[webR] Setup started");
	// Initialize
	await webR.init();
	// Make virtual FS dir
	await webR.FS.mkdir("/libraries");
	// Create and mount local folder to WebR's virtual FS
	await webR.FS.mount("NODEFS", { root: "./R/libraries" }, "/libraries");
	// Log
	console.log("[webR] Mounted './libraries' to '/libraries'");
	// add to libPath to be able to install packages and store them for future runs
	await webR.evalR(".libPaths('/libraries')");
	// Log
	console.log(`[webR] Custom library path set`);
	// Check and if necessary Install required R packages
	await checkInstallPackages(webR, ["minpack.lm"]);
	// Log
	console.log("[webR] Setup finished");
	// Return webR initialized object
	return webR;
};
