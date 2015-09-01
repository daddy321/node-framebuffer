/**
 * Created by ncl on 15. 8. 26.
 */
var fs = require('fs');
var path = require('path');
var outputFilename = 'test.txt';
var myArray =['helloworld'];
fs.writeFile(path.join(__dirname, outputFilename), JSON.stringify(myArray, null, 4), function(err){
    if(err){
        console.log(err);
    } else {
        console.log('Successful!!!');

        fs.rename(path.join(__dirname, 'test.txt'), path.join(__dirname, 'temp.txt'), function(err){
            if(err){
                console.log(err);
            } else{
                console.log('Successful!!!!');
                fs.stat(path.join(__dirname, 'temp.txt'), function(err3, stats){
                    console.log('Successful!!!!');
                    console.log(stats);
                });
            }
        });
    }
});