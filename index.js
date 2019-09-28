const express    = require('express'),
      fs         = require('fs'),
      app        = express(),
      port       = 5000,
      bodyParser = require('body-parser')

app.use(bodyParser.text({ "type": "text/plain" }))


function fetchExistingMemosNames( callback ) {
    fileList = [];

    fs.readdir("./memory/", function(err, names) {
        callback(names);
    });
}

app.post("/:memoName", function(req, res) {

    let body     = req.body,
        memoName = req.params.memoName;

    console.log(`\nCreating memo '${memoName}'...`)

    fetchExistingMemosNames(names => {

        // name already taken?
        if( names.indexOf(memoName) !== -1 ) {
            res.status(400).send ({
                "status": "error",
                "message": "Name already taken"
            });

            console.log("memo already exists, aborting...");

            return;
        }

        // no body given?
        if( ! body ) {
            res.status(400).send ({
                "status": "error",
                "message": "No body provided"
            })

            console.log("No body, aborting...")

            return;
        }

        fs.writeFile("./memory/" + memoName, body, function(err) {
            if(err) {
                return console.log(err)
            }
            console.log("The memo was saved!")

            res.send({
                "status": "success",
                "message": "Memo successfully created"
            })
        }); 
    });

})

app.post("/:memoName/end", function(req, res) {

    let body     = req.body,
        memoName = req.params.memoName;

    console.log(`\nAppening content to memo '${memoName}'...`)

    fetchExistingMemosNames(names => {

        // Memo exists?
        if( names.indexOf(memoName) === -1 ) {
            res.status(400).send ({
                "status": "error",
                "message": "No such memo"
            });

            console.log("memo desn't exists, aborting...");

            return;
        }

        // no body given?
        if( ! body ) {
            res.status(400).send ({
                "status": "error",
                "message": "No body provided"
            })

            console.log("No body, aborting...")

            return;
        }

        fs.appendFile("./memory/" + memoName, '\n'+body, function(err) {
            if(err) {
                return console.log(err)
            }
            console.log("The memo was updated!")

            res.send({
                "status": "success",
                "message": "Memo successfully updated"
            })
        }); 
    });

})

app.post("/:memoName/beg", function(req, res) {

    let body     = req.body,
        memoName = req.params.memoName;

    console.log(`\nPrepending content to memo '${memoName}'...`)

    fetchExistingMemosNames(names => {

        // Memo exists?
        if( names.indexOf(memoName) === -1 ) {
            res.status(400).send ({
                "status": "error",
                "message": "No such memo"
            });

            console.log("memo desn't exists, aborting...");

            return;
        }

        // no body given?
        if( ! body ) {
            res.status(400).send ({
                "status": "error",
                "message": "No body provided"
            })

            console.log("No body, aborting...")

            return;
        }

        fs.readFile("./memory/" + memoName, {encoding: 'utf-8'}, function(err, fileContents) {
            if(err) {
                return console.log(err)
            }

            fs.writeFile("./memory/" + memoName, body+'\n'+fileContents, function(err) {
                if(err) {
                    return console.log(err)
                }
                console.log("The memo was updated!")

                res.send({
                    "status": "success",
                    "message": "Memo successfully updated"
                })
            }); 
        }); 
    });

})

app.get("/:memoName", function(req, res) {

    let memoName = req.params.memoName;

    console.log(`\nReading memo '${memoName}'...`)

    fetchExistingMemosNames(names => {

        // Memo exists?
        if( names.indexOf(memoName) === -1 ) {
            res.status(400).send ({
                "status": "error",
                "message": "No memo with that name"
            });

            console.log("No such memo, aborting...");

            return;
        }

        fs.readFile("./memory/" + memoName, {encoding: 'utf-8'}, function(err, contents) {
            if(err) {
                return console.log(err)
            }
            console.log("The memo was read!")
            
            fs.stat("./memory/" + memoName, function(err, stats) {
                console.log("The metadata was retreived");

                res.send({
                    "status": "success",
                    "message": "Memo retreived successfully",
                    "data": contents,
                    "lastModified": stats.mtime
                })
            }); 
        }); 
    });

});

app.delete("/:memoName", function(req, res) {
    let memoName = req.params.memoName;

    console.log(`\ndeleting memo '${memoName}'...`);

    fetchExistingMemosNames(names => {

        // Memo exists?
        if( names.indexOf(memoName) === -1 ) {
            res.status(400).send ({
                "status": "error",
                "message": "No memo with that name"
            });

            console.log("No such memo, aborting...");

            return;
        }

        fs.unlink("./memory/" + memoName, function(err) {
            if(err) {
                return console.log(err)
            }
            console.log("The memo was deleted!")

            res.send({
                    "status": "success",
                    "message": "Memo deleted",
                })
        }); 
    });

});


app.listen(port, () => {
    console.log(`server running on port ${port}`)
});