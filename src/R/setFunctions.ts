import type { RObject } from "webr";
import { setupR } from "./setupR";

export const getCustomRFunction = async (
	pathScript: string,
): Promise<RObject> => {
	const webR = await setupR();
	const script = Bun.file(pathScript);
	return await webR.evalR(await script.text());
};
