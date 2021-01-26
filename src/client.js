
const FILEHOST_URL = 'http://localhost:5000'

require('./install.js')();


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
        //console.log(`attempting to install ${args[1]} version ${args[2]}`)
        //args[1] is name of mod
        //args[2] is version of mod
        //downloadFile(args[1],args[2],`mod.zip`, `${FILEHOST_URL}/${args[1]}/${args[2]}/mod.zip`,()=>{console.log("done")})
        installMod(args[1], args[2], FILEHOST_URL);
    }
}

else {
    console.log("No Parameters passed");
}