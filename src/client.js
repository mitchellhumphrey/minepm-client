
const FILEHOST_URL = 'http://localhost:5000'

require('./install.js')();
require('./init.js')();
const fs = require('fs');
const io = require('console-read-write');
const init = require('./init.js');

var args = {}
let anyargs = false;
process.argv.forEach((val, index) => {
    if (index > 1){
        args[index - 2] = val;
        anyargs = true;
    }
})
console.log(args)

if (anyargs){
    if (args[0] === "install"){
        //args[1] is name of mod
        //args[2] is version of mod
        //args[3] is local path
        if (args[3] == null || args[3] == undefined) args[3] = './'
        initMinePM(args[3], (minepmObject)=>{
            installMod(args[1], args[2], FILEHOST_URL, args[3], minepmObject, (minepmObject)=>{
                console.log(minepmObject)
                replaceMinePM(minepmObject, args[3]);
            });
        })
        
    }

    if (args[0] === "init"){
        //args[1] is path to init minepm folder
        initMinePM(args[1]);
        

    }
}

else {
    console.log("No Parameters passed");
}