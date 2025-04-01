import App from "./routes/+page.svelte";
import { mount } from "svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Could not find app element");

const app = mount(App, {
	target,
	props: {},
});

export default app;
