/*

for downloading files https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
for creating directories https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
dealing with zip files NOT YET IMPLEMENTED https://stackoverflow.com/questions/10308110/simplest-way-to-download-and-unzip-files-in-node-js-cross-platform

*/

module.exports = function() {
    console.log("LOADING INSTALL.JS")

    const http = require('http');
    const fs = require('fs');

    this.ensureExists = function (path, mask, cb) {
        if (typeof mask == 'function') { // allow the `mask` parameter to be optional
            cb = mask;
            mask = 0777;
        }
        fs.mkdir(path, mask, function(err) {
            if (err) {
                if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
                else cb(err); // something else went wrong
            } else cb(null); // successfully created folder
        });
    }
    
    this.downloadFile = function (modname,version, name, URL, callback){
        ensureExists('./'+ modname, (err)=>{
            if (err) {
                console.log("error with ensureExists");
                return;
            }
        })
    
        ensureExists('./'+ modname + '/' + version, (err)=>{
            if (err) {
                console.log("error with ensureExists");
                return;
            }
        })
    
        const file = fs.createWriteStream('./'+ modname + '/' + version + '/' + name);
        const request = http.get(URL, (response)=> {
            response.pipe(file);
            file.on("finish", ()=>{
                console.log(`finished downloading ${name}`)
                file.close(callback); //calls the callback function once file is completed downloading
            });
        }).on("error", (err)=>{
            fs.unlink(name);
            console.log(err);
    
        })
        
    }
    
    this.installInfo = function (modname, version,host_URL, callback){
        console.log(`attempting to download info for ${modname} version ${version}`)
        downloadFile(modname, version, `info.json`, `${host_URL}/${modname}/${version}/info.json`, callback)
    }
    
    this.installMod = function (modname, version, host_URL, callback){
        console.log(`attempting to install ${modname} version ${version}`)
        var info;
        installInfo(modname, version, host_URL, ()=>{
            fs.readFile(`./${modname}/${version}/info.json`, (err, data)=>{
                if (err) {
                    console.log(err);
                    return;
                }
                info = JSON.parse(data);
                downloadFile(modname,version, `mod.zip`,`${host_URL}/${modname}/${version}/mod.zip`,()=>{
                    let index = 0
                    while (index < info.dependancies.length){
                        installMod(info.dependancies[index].name,info.dependancies[index].version, host_URL)
                        index++;
                    }
                })
                
            })
            
        });
        callback;
        
        
        
    }
}

