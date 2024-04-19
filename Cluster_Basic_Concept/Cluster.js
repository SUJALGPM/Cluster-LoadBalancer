const express = require("express");
const colors = require("colors");
const cluster = require('cluster');
const os = require('os');


//Configure express app...
const app = express();
const port = 6000;


//Handle numberCPUs...
const numberCPUs = os.cpus().length;

//Create Child process as per noCPUs...
app.get("/", (req, res) => {
    res.send({ message: `Worker process id ${process.pid} give response..` });
});


//Configure cluster...
if (cluster.isPrimary) {

    console.log(`Master Process means Primary Node ${process.pid}`.bgCyan.white);

    for (let i = 0; i < numberCPUs; i++) {
        cluster.fork();
    }

    //handle cluster died...
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker with processId ${process.pid} died..`.bgRed.white);
        cluster.fork();
    })
} else {
    app.listen(port, () => {
        console.log(`Worker with processID ${process.pid} live on Server is listeining on port no ${port}`.bgMagenta.white);
    })
}