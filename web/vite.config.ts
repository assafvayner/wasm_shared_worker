import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [wasm(), topLevelAwait(), sveltekit()],
	server:  {
		fs: {
			allow: ["../xet_wasm/pkg"],
		},
	},
	resolve: {
		alias: {
			"@shared-worker":   resolve(__dirname, "src/lib/shared-worker.ts"),
			"@xet":             resolve(__dirname, "../xet_wasm/pkg"),
			"@huggingface/xet": resolve(__dirname, "../../xet-core/hf_xet_js"),
		},
	},
	worker: {
		format:  "es",
		plugins: () => [wasm(), topLevelAwait()],
	},
	optimizeDeps: {
		exclude: ["@sveltejs/kit"],
	},
});
