const worker = new SharedWorker('shared_worker.js', { name: "huggingface-xet-shared-worker"});

worker.port.start();

worker.port.onmessage = function (event) {
    console.log('Message from worker:', event.data);
};

document.getElementById('btn').addEventListener('click', function () {
    const text = document.getElementById('textbox').value;
    console.log(`1 sending: ${text}`)
    worker.port.postMessage({content: text});
});


document.getElementById('customBtn').addEventListener('click', function () {
    console.log(`2 sending upload message`)
    worker.port.postMessage({
        op: "upload",
        files: [],
        file_paths: [],
        url: "",
        token: "",
    });
});