import openapi from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";
import type { RDouble, RFunction } from "webr";
import { getCustomRFunction } from "./R/setFunctions";
import { setupR } from "./R/setupR";

class HttpError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = "HttpError";
	}
}

const webR = await setupR();

const rnorm = (await webR.evalR("rnorm")) as RFunction;
const minpack = (await getCustomRFunction(webR, "./R/minpack.R")) as RFunction;

const app = new Elysia()
	.use(openapi())
	.use(staticPlugin({ assets: "./public" }))
	.get("/", () => Bun.file("public/index.html"))
	.get(
		"/rnorm",
		async ({ query }) => {
			if (query.seed !== undefined) {
				await webR.evalRVoid(`set.seed(${query.seed})`);
			}
			const result = (await rnorm(
				Math.floor(query.n ?? 10),
				query.mean ?? 0,
				query.sd ?? 1,
			)) as RDouble;
			return {
				rnorm: result,
			};
		},
		{
			query: t.Object({
				n: t.Optional(t.Numeric({ minimum: 1 })),
				mean: t.Optional(t.Numeric({ default: 0 })),
				sd: t.Optional(t.Numeric({ minimum: 1 })),
				seed: t.Optional(t.Numeric()),
			}),
		},
	) // /rnorm endpoint
	.post(
		"/minpack",
		async ({ body }) => {
			if (body.t.length === 0 || body.y.length === 0) {
				throw new HttpError(404, "No data provided");
			}

			if (body.t.length !== body.y.length) {
				throw new HttpError(400, "y and t must be the same length");
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
	) // /minpack endpoint
	.onError(({ error }) => {
		if (error instanceof HttpError) {
			return {
				status: error.status,
				message: error.message,
			};
		}

		return {
			status: 500,
			message: "Internal Server Error",
		};
	}) // what to do in unchecked case
	.listen(3001);

// Log
console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app;
