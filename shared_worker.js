onconnect = function (event) {
    const port = event.ports[0];

    port.onmessage = async function (e) {
        const wasmModule = await import('./pkg/xet_wasm.js');
        await wasmModule.default(); // initializing wasm env
        const { upload_async } = wasmModule;

        if (!e.data.op) {
            port.postMessage({error: "op key missing", status: "error"});
        }
        const op = e.data.op;
        if (op === "upload") {
            try {
                const result = await upload_async(e.data.files, e.data.file_paths, e.data.url, e.data.token);
                port.postMessage({result, status: "success"});
            } catch (e) {
                port.postMessage({error: e, status: "error"});
            }
        } else if (op === "download") {
            port.postMessage({result: "download not implemented yet", status: "success"});
        } else {
            port.postMessage({error: `operation ${op} not recognized`, status: "error"});
        }
    };
};