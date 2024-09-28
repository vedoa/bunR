/* first run this script to download the R dependencies 
to speed up start time of the REST api (don't have to wait 
for all the packages to download)
*/
import { setupR } from "./setupR";

const webR = await setupR();
await webR.installPackages(["minpack.lm"], { mount: false });

process.exit(0);
