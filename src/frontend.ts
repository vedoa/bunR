import van from "vanjs-core";

const { a, div, h1, h2, form, label, input, button, pre } = van.tags;

const apiBase = "http://localhost:3001";

// Reactive state
const rnormResult = van.state<string>("");
const minpackResult = van.state<string>("");

// Helper to safely parse number arrays from input
const parseNumberArray = (value: string): number[] =>
	value
		.split(",")
		.map((v) => parseFloat(v.trim()))
		.filter((v) => !Number.isNaN(v));

// rnorm form
const rnormForm = form(
	{
		onsubmit: (e: SubmitEvent) => {
			e.preventDefault();

			(async () => {
				const target = e.target as HTMLFormElement;
				const formData = new FormData(target);
				const params = new URLSearchParams();

				for (const [key, value] of formData.entries()) {
					if (value !== "") params.append(key, value.toString());
				}

				try {
					const res = await fetch(`${apiBase}/rnorm?${params}`);
					const data = await res.json();
					rnormResult.val = JSON.stringify(data.rnorm.values, null, 2);
				} catch (err) {
					rnormResult.val = `Error: ${(err as Error).message}`;
				}
			})();
		},
	},
	h2("rnorm"),
	label("n: ", input({ name: "n", type: "number", min: "1" })),
	label("mean: ", input({ name: "mean", type: "number" })),
	label("sd: ", input({ name: "sd", type: "number", min: "1" })),
	label("seed: ", input({ name: "seed", type: "number" })),
	button({ type: "submit" }, "Run rnorm"),
	pre(() => rnormResult.val),
);

// minpack form
const minpackForm = form(
	{
		onsubmit: (e: SubmitEvent) => {
			e.preventDefault();

			(async () => {
				const target = e.target as HTMLFormElement;
				const tInput = target.t as HTMLInputElement;
				const yInput = target.y as HTMLInputElement;

				const t = parseNumberArray(tInput.value);
				const y = parseNumberArray(yInput.value);

				try {
					const res = await fetch(`${apiBase}/minpack`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ t, y }),
					});
					const data = await res.json();
					minpackResult.val = JSON.stringify(data.minpack.values, null, 2);
				} catch (err) {
					minpackResult.val = `Error: ${(err as Error).message}`;
				}
			})();
		},
	},
	h2("minpack"),
	div(
		"Example D.2 from Appendix D of ",
		a(
			{
				href: "https://math.gmu.edu/~igriva/book/Appendix%20D.pdf",
				target: "_blank",
				style: "color: var(--r-blue); text-decoration: underline;",
			},
			"https://math.gmu.edu/~igriva/book/Appendix%20D.pdf",
		),
		" demonstrates fitting an exponential model y = x₁·e^(x₂·t) to population data using the Gauss-Newton method. ",
		"The default values below correspond to the antelope population data: ",
		"t = [1, 2, 4, 5, 8], y = [3.2939, 4.2699, 7.1749, 9.3008, 20.259].",
	),
	label("t: ", input({ name: "t", type: "text", value: "1,2,4,5,8" })),
	label(
		"y: ",
		input({
			name: "y",
			type: "text",
			value: "3.2939,4.2699,7.1749,9.3008,20.259",
		}),
	),
	button({ type: "submit" }, "Run minpack"),
	pre(() => minpackResult.val),
);

// Mount to body
van.add(
	document.body,
	h1("bunR Frontend VanJS Backend ElysiaJS"),
	rnormForm,
	minpackForm,
);
