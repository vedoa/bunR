import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import app from "./index";

let server: ReturnType<typeof app.listen>;
let url: string;
beforeAll(() => {
	server = app;
	const port = server.server?.port;
	url = `http://localhost:${port}/`;
});

afterAll(() => {
	server?.stop();
});

describe("Elysia API with webR example", () => {
	it("GET / should return a nice greeting", async () => {
		const res = await fetch(url);
		const text = await res.text();

		expect(res.status).toBe(200);
		expect(text).toBe(await Bun.file("./public/index.html").text());
	});

	it("GET /rnorm should return n random normal variables", async () => {
		const data = {
			rnorm: {
				type: "double",
				names: null,
				values: [
					-0.6264538107423324, 0.18364332422208224, -0.8356286124100472,
					1.5952808021377916, 0.3295077718153605, -0.8204683841180153,
					0.4874290524284853, 0.7383247051292173, 0.5757813516534923,
					-0.305388387156356,
				],
			},
		};
		const res = await fetch(`${url}/rnorm?seed=1`);
		const json = await res.json();
		expect(res.status).toBe(200);
		expect(json).toEqual(data);
	});

	it("POST /minpack should return minpack optimization", async () => {
		const data = {
			minpack: {
				type: "double",
				names: ["x1", "x2"],
				values: [2.541069136022282, 0.2595018505022068],
			},
		};
		const res = await fetch(`${url}/minpack`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				t: [1, 2, 4, 5, 8],
				y: [3.2939, 4.2699, 7.1749, 9.3008, 20.259],
			}),
		});
		const json = await res.json();
		expect(res.status).toBe(200);
		expect(json).toEqual(data);
	});
});
