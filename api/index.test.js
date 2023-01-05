import { unstable_dev } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev(
			"src/index.js",
			{},
			{ disableExperimentalWarning: true }
		);
	});

	afterAll(async () => {
		await worker.stop();
  });

	it("should return Hello World", async () => {
		const resp = await worker.fetch();
		if (resp) {
			const text = await resp.text();
			expect(text).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});
});
