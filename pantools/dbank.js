var dbank = require("./lib/dbank.js");
var decrypt = dbank.decrypt;
var thunder_decode = dbank.thunder_decode;

var request = require('request');
var dbankurl = 'http://dl.vmall.com/c0kbgaqzjm';
var re = new RegExp('var globallinkdata = (.*);')

var print_file = function(file, level, stage) {
    var indent = "  ";
    for(var i=0; i<level; i++) {
        indent = indent + "  ";
    }

    if(stage == "info") {
        if(file.type == "Directory") {
            console.log(indent + "[D]" + file.name)
        } else {
            console.log(indent + "[F]" + file.name)
        }
    } else {
        if(file.type == "Directory") {
        } else {
            var url = decrypt(file.xunleiurl, salt)
            console.log(url)
            //console.log(thunder_decode(url))
        }
    }
}

var print_files = function(files, level, stage) {

    for(var i=0; i<files.length; i++) {
        print_file(files[i], level, stage);
        if(files[i].childList) {
            print_files(files[i].childList, level+1, stage)
        }
    }

}
var process_data = function(globallinkdata, stage) {
    salt = globallinkdata.data.encryKey;
    var files = globallinkdata.data.resource.files;
    print_files(files, 1, stage);

}

request(dbankurl, function(error, response, body){
    if(!error && response.statusCode == 200) {
            
        var c = body.split("\n");
        for(var i = 0; i < c.length; i++) {
            if(re.test(c[i])) {
                var match = c[i].match(re)[1];
                var json = JSON.parse(match)
                process_data(json, 'info')
                process_data(json, 'link')
            }
        }
    }
})
