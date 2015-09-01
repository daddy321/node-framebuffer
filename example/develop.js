// node v0.10.39에서 최적화



var framebuffer = require('../lib/framebuffer');
var express = require('express');
var fb = new framebuffer('/dev/fb0');
var path = require('path');

var app = express();
var server = app.listen( process.env.port || 55555, function(){
    console.log('This server is running on the port ' + this.address().port );
});



var io = require('socket.io').listen(server);
app.use( express.static( path.join(__dirname,'..', 'public') ));

var fb_tmp = fb.buffer();

//console.log(fb_tmp);
//var imgArray = new Uint8Array(fb_tmp);
//console.log(fb_tmp.toString('base64'));

//var imgArray = new Uint8Array(fb_tmp);
//console.log(imgArray.length);

//fs.readFile(path.join(__dirname,'..','public','screenshot.png'), function(err, buf){
//    console.log(buf);
//});


io.sockets.on('connection', function(socket){


    socket.on('publish', function(){

        //imgArray.slice(0,400)
        socket.emit('canvas', {image: true, buffer: fb_tmp });
        //var fb_tmp = fb.buffer();

        //socket.emit('canvas', {image:true, buffer: new Uint8Array(fb_tmp)});


        ////console.log(fb_tmp.toSting());
        ////console.log(fb_tmp.buffer().length/4);
        //


        //for(var i=0; i< fb_tmp.length; i++) {
        //    //socket.emit('canvas', fb_tmp.readUInt8(i));
        //    console.log(i);
        //    fb_tmp.readUInt8(i);
        //}

    });


});

//fb.close();