import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [sveltekit()],
	server:  {
		fs: {
			allow: ["../xet_wasm/pkg"],
		},
	},
	resolve: {
		alias: {
			"@shared-worker": resolve(__dirname, "src/lib/shared-worker.ts"),
		},
	},
	worker: {
		format:  "es",
		plugins: () => [],
	},
	optimizeDeps: {
		exclude: ["@sveltejs/kit"],
	},
});
