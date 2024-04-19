const express = require('express');
const colors = require('colors');
const cluster = require('cluster');;
const os = require('os');


//Configure express app...
const app = express();
const port = 5000;


//Configure Number of CPU(Core)....
const totalCPUs = os.cpus().length;


//Configure server running track....
app.get("/", (req, res) => {

    // The loop runs 1e8 times, which is a shorthand for 1 followed by 8 zeros,
    // meaning it runs 100 million iterations.
    for (let i = 0; i < 1e8; i++) {
        //some long running task...
    }

    res.send(`This worker with processID :${process.pid} give response...`);
    // cluster.worker.kill();
});


// //Configure Cluster : (When the server starts, the primary cluster creates child worker processes (one per CPU core))....
if (cluster.isPrimary) {

    console.log(`Primary Cluster (Node) with processID :${process.pid}`.bgCyan.black);
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    //handle died cluster(secondary node)...
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker(secondary Node) ${worker.process.pid} died`.bgRed.white);
        cluster.fork();
    });

    //Implemented SIGINT handling for graceful shutdown, disconnecting workers before shutting down the master.
    process.on('SIGINT', () => {
        console.log('Shutting down gracefully...');
        for (const id in cluster.workers) {
            cluster.workers[id].disconnect();
        }
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    });

} else {
    app.listen(port, () => {
        console.log(`Worker processID ${process.pid} is running on live Express App listening on port ${port}`.bgYellow.black);
    });

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}


// Configure server is running on port...
// app.listen(port, () => {
//     console.log(`Express App listening on port no : ${port}`.bgCyan.white);
//     console.log(`Worker processID :${process.pid}`.bgYellow.black);
// })




