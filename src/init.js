const { FileSystem } = require("adm-zip/util")


module.exports = function () {
    require('./install.js')();
    const io = require('console-read-write');
    const fs = require('fs');

    this.initMinePM = function (local_path, callback) {
        ensureExists(local_path, async function (err){
            if (err) {
                console.log("PATH DOES NOT EXIST")
                console.log(err)
                return;
            }

            fs.access(local_path + "/minepm.json", fs.F_OK, async function (err){
                var output = new Object();
                if (err) {
                    io.write("What should modpack name be? :");
                    output.modpackname = await io.read();
                    let pickone = false;
                    while (!pickone){
                        io.write("is this a forge or fabric modpack? :");
                        let temp = await io.read();
                        if (temp === "fabric" || temp ==="forge") pickone = true;
                        if (!pickone) io.write("pick one");
                    }
                    io.write("Who is the creator of this modpack? :")
                    output.modpackauthor = await io.read();
                    io.write("What version of minecraft is this modpack for?")
                    output.mcversion = await io.read();
                    output.mods = [];
                    fs.writeFile(`${local_path}/minepm.json`, JSON.stringify(output), (err)=>{
                        if (err) console.log(err);
                    })
                    callback(output);
                }
                else {
                    console.log("minepm.json file already created")
                    fs.readFile(local_path + '/minepm.json', (err, data)=>{
                        
                        callback(JSON.parse(data));
                    })
                }  
            })
        })
    }

    this.replaceMinePM = function (minePMObject, local_path){
        fs.writeFile(`${local_path}/minepm.json`, JSON.stringify(minePMObject), (err)=>{
            console.log("WROTE TO FILE minepm.json")
            if (err) {
                console.log(error);
                return;
            }
        })
    }
}