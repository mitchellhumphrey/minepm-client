/*

for downloading files https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
for creating directories https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
dealing with zip files NOT YET IMPLEMENTED https://stackoverflow.com/questions/10308110/simplest-way-to-download-and-unzip-files-in-node-js-cross-platform

*/

module.exports = function() {
    //console.log("LOADING INSTALL.JS")

    const http = require('http');
    const fs = require('fs');
    var AdmZip = require('adm-zip');

    this.ensureExists = function (path, mask, callback) {
        if (typeof mask == 'function') { // allow the `mask` parameter to be optional
            callback = mask;
            mask = 0777;
        }
        fs.mkdir(path, mask, function(err) {
            if (err) {
                if (err.code == 'EEXIST') callback(null); // ignore the error if the folder already exists
                else callback(err); // something else went wrong
            } else callback(null); // successfully created folder
        });
    }
    
    this.downloadFile = function (modname,version, name, URL, local_path, callback){
        ensureExists(local_path + '/' + modname, (err)=>{
            if (err) {
                console.log("error with ensureExists");
                return;
            }
            ensureExists(local_path + '/' + modname + '/' + version, (err)=>{
                if (err) {
                    console.log("error with ensureExists");
                    return;
                }
                const file = fs.createWriteStream(local_path + '/' + modname + '/' + version + '/' + name);
                const request = http.get(URL, (response)=> {
                    response.pipe(file);
                    file.on("finish", ()=>{
                        console.log(`finished downloading ${name}`)
                        file.close(callback); //calls the callback function once file is completed downloading
                    });
                }).on("error", (err)=>{
                    fs.unlink(name, (err)=>{
                        console.log(err);
                    });
                    console.log(err);
                })
            })
        })        
    }
    
    this.installInfo = function (modname, version,host_URL, local_path, callback){
        console.log(`attempting to download info for ${modname} version ${version}`)
        downloadFile(modname, version, `info.json`, `${host_URL}/${modname}/${version}/info.json`, local_path, callback)
    }
    
    this.installMod = function (modname, version, host_URL, local_path, minepmObject, callback){

        this.ensureExists(local_path + "/minepm.json", (err)=>{
            if (err) {
                console.log(err);
                return;
            }
            
        })
        let exists = minepmObject.mods.find((obj) =>{
            return (obj.modname === modname && obj.version === version)
        })

        if (exists){
            console.log("MOD ALREADY INSTALLED")
            callback(minepmObject);
            return;
        }
        console.log(`attempting to install ${modname} version ${version}`)
        var info;

        installInfo(modname, version, host_URL, local_path, ()=>{

            const data = fs.readFileSync(`${local_path}/${modname}/${version}/info.json`)
            info = JSON.parse(data);

            downloadFile(modname,version, `mod.zip`,`${host_URL}/${modname}/${version}/mod.zip`, local_path,()=>{
                let zip = new AdmZip(`${local_path}/${modname}/${version}/mod.zip`);
                zip.extractAllTo(`${local_path}/${modname}/${version}`);

                minepmObject.mods.push(info)
                for (var x of info.dependencies){
                    installMod(x.name,x.version, host_URL, local_path, minepmObject, (newminepmObject)=>{
                        Object.assign(minepmObject, newminepmObject);
                    })
                }
                delete info.dependencies
                callback(minepmObject);

                
            })






            // fs.readFile(`${local_path}/${modname}/${version}/info.json`, (err, data)=>{
            //     if (err) {
            //         console.log(err);
            //         return;
            //     }
            //     info = JSON.parse(data);
            //     downloadFile(modname,version, `mod.zip`,`${host_URL}/${modname}/${version}/mod.zip`, local_path,()=>{
            //         let zip = new AdmZip(`${local_path}/${modname}/${version}/mod.zip`);
            //         zip.extractAllTo(`${local_path}/${modname}/${version}`);

                    
            //         minepmObject.mods.push(info)
            //         for (var x of info.dependencies){
            //             installMod(x.name,x.version, host_URL, local_path, minepmObject, (newminepmObject)=>{
            //                 //console.log("recursive console.log" + x.name)
            //                 //minepmObject = newminepmObject;
            //                 Object.assign(minepmObject, newminepmObject);
            //             })
            //         }
            //         delete info.dependencies
            //         callback(minepmObject);

                    
                // })
            // })
        });   
    }
}

