import type { WebR } from "webr";

/**
 * Checks if the specified R packages are installed in the WebR environment,
 * and installs any that are missing.
 *
 * @param webR - An initialized WebR instance
 * @param packages - Array of R package names to verify and install if needed
 */

export const checkInstallPackages = async (
	webR: WebR,
	packages: string[],
): Promise<void> => {
	// Check which packages are already installed
	const pkgListStr = packages.map((pkg) => `"${pkg}"`).join(", ");
	// Logic to compare to currently installed packages
	const result = await webR.evalR(
		`missing <- setdiff(c(${pkgListStr}), rownames(installed.packages())); missing`,
	);
	// R to JS object conversion
	const missingPkgs = (
		(await result.toJs()) as {
			type: "double";
			names: null;
			values: string[];
		}
	).values;
	// Logic to install if missing
	if (missingPkgs.length > 0) {
		// Log
		console.log(
			`[webR] Installing missing packages: ${missingPkgs.join(", ")}`,
		);
		// Install missing
		await webR.installPackages(missingPkgs, { mount: false });
	} else {
		// Log
		console.log("[webR] All required packages are already installed.");
	}
};
