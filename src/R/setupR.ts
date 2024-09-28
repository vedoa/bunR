import { WebR } from "webr";

export const setupR = async (): Promise<WebR> => {
	const webR = new WebR();

	await webR.init();
	await webR.FS.mkdir("/libraries");
	await webR.FS.mount("NODEFS", { root: "./R/libraries" }, "/libraries");
	await webR.evalR(".libPaths('/libraries')");
	return webR;
};
