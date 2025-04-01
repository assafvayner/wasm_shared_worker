import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	mode:   "development",
	entry:  "./src/main.ts",
	output: {
		path:     path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	experiments: {
		asyncWebAssembly: true,
		syncWebAssembly:  true,
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use:  "svelte-loader",
			},
			{
				test:    /\.(js|ts)$/,
				exclude: /node_modules/,
				use:     {
					loader:  "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-typescript"],
					},
				},
			},
			{
				test: /\.css$/,
				use:  ["style-loader", "css-loader"],
			},
			{
				test: /\.wasm$/,
				type: "webassembly/async",
			},
		],
	},
	resolve: {
		extensions: [".js", ".ts", ".svelte"],
		alias:      {
			$lib: path.resolve(__dirname, "src/lib"),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, "public"),
		},
		compress: true,
		port:     3000,
		hot:      true,
	},
};
