import { Elysia, error, t } from "elysia";
import swagger from "@elysiajs/swagger";
import { setupR } from "./R/setupR";
import { getCustomRFunction } from "./R/setFunctions";
import type { RDouble, RFunction } from "webr";

const webR = await setupR();

const rnorm = (await webR.evalR("rnorm")) as RFunction;
const minpack = (await getCustomRFunction("./R/minpack.R")) as RFunction;

const app = new Elysia()
	.use(swagger())
	.get("/", () => "WebR with Bun example! :D")
	.get(
		"/rnorm",
		async ({ query }) => {
			const result = (await rnorm(
				Math.floor(query.n === undefined ? 10 : query.n),
				query.mean === undefined ? 0 : query.mean,
				query.sd === undefined ? 1 : query.sd,
			)) as RDouble;
			return {
				rnorm: result,
			};
		},
		{
			query: t.Object({
				n: t.Optional(t.Numeric({ minimum: 1 })),
				mean: t.Optional(t.Numeric({ default: 0 })),
				sd: t.Optional(t.Numeric({ minimum: 0 })),
			}),
		},
	)
	.post(
		"/minpack",
		async ({ body }) => {
			if (body.t.length !== body.y.length) {
				return error(400, "Bad Request - y and t have to be the same length");
			}
			const result = (await minpack(body.y, body.t)) as RDouble;
			return {
				minpack: result,
			};
		},
		{
			body: t.Object({
				t: t.Array(t.Numeric(), { default: [1, 2, 4, 5, 8] }),
				y: t.Array(t.Numeric(), {
					default: [3.2939, 4.2699, 7.1749, 9.3008, 20.259],
				}),
			}),
		},
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
