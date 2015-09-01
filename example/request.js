/**
 * Created by ncl on 15. 8. 27.
 */
var request = require('request');
//var async = require('async');



//addBook(4,'eee',3, function(result){
//    rentBook(2,function(result){
//        rentBook(1, function(result){
//            getAccount(function(result){
//                returnBook(2, function(result){
//                    rentBook(1, function(result){
//                        returnBook(1, function(result){
//
//                        })
//                    })
//                })
//            })
//        })
//    })
//});
//
//function addBook(bookID, bookName, rentPrice, cb){
//    request({
//        method: 'POST',
//        uri: 'http://143.248.2.224:55555/addBook',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({id: bookID, name: bookName, price: rentPrice})
//    },function(e, r, b){
//        var addedBook = JSON.parse(b);
//        console.log(addedBook);
//        cb(addedBook);
//    });
//}
//
//function rentBook(bookID, cb){
//    request({
//        method: 'GET',
//        uri: 'http://143.248.2.224:55555/rentBook/'+bookID,
//        headers:{
//            'Content-Type': 'application/json'
//        }
//    },function(e, r, b){
//        var rentedBook = JSON.parse(b);
//        console.log(rentedBook);
//        cb(rentedBook);
//    });
//}
//
//function returnBook(bookID, cb){
//    request({
//        method: 'GET',
//        uri: 'http://143.248.2.224:55555/returnBook/'+bookID,
//        headers:{
//            'Content-Type': 'application/json'
//        }
//    },function(e, r, b){
//        var returnedBook = JSON.parse(b);
//        console.log(returnedBook);
//        cb(returnedBook);
//    });
//}
//
//function removeBook(bookID, cb){
//    request({
//        method: 'GET',
//        uri: 'http://143.248.2.224:55555/removeBook/'+bookID,
//        headers:{
//            'Content-Type': 'application/json'
//        }
//    },function(e, r, b){
//        var removedBook = JSON.parse(b);
//        console.log(removedBook);
//        cb(removedBook);
//    });
//}
//
//function getAccount(cb){
//    request({
//        method: 'GET',
//        uri: 'http://143.248.2.224:55555/getAccount',
//        headers:{
//            'Content-Type': 'application/json'
//        }
//    },function(e, r, b){
//        var account = JSON.parse(b);
//        console.log(account);
//        cb(account);
//    });
//}
//
//function getStatus(cb){
//    request({
//        method: 'GET',
//        uri: 'http://143.248.2.224:55555/getStatus',
//        headers:{
//            'Content-Type': 'application/json'
//        }
//    },function(e, r, b){
//        var status = JSON.parse(b);
//        console.log(status);
//        cb(status);
//    })
//}

openstackAuth('admin', 'ncl2015', 'admin', function(tokenID, novaServiceURL){
    //getVirtualInstances(tokenID, novaServiceURL, function(VMs){
    //    console.log(VMs);
    //});
    getFlavors(tokenID, novaServiceURL, function(flavors) {
        var flavorsMap = {};
        for(var index in flavors.flavors){
            var flavor = flavors.flavors[index];
            flavorsMap[flavor.name] = flavor;
        }
        getImages(tokenID, novaServiceURL, function(images){
            var imagesMap = {};
            for(var index in images.images){
                var image = images.images[index];
                imagesMap[image.name] = image;
            }

            createVirtualInstance(tokenID, novaServiceURL, "testest", flavorsMap["m1.small"], imagesMap["cirros-0.3.4-x86_64"], function(vm){
                console.log(vm);
                getVirtualInstances(tokenID, novaServiceURL, function(VMs){
                    console.log(VMs);
                })
            })
        })
    });
});
function openstackAuth(id, pw, tenentName, cb){
    request({
        method: 'POST',
        uri: 'http://143.248.2.209:5000/v2.0/tokens',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            auth: {
                tenantName: tenentName,
                passwordCredentials:{
                    username: id,
                    password: pw
                }
            }
        })
    }, function(e, r, b){
        var authRes = JSON.parse(b);
        var tokenID = authRes.access.token.id;
        var novaServiceURL = authRes.access.serviceCatalog[1].endpoints[0].publicURL;
        cb(tokenID, novaServiceURL);
    });
}

function getVirtualInstances(tokenID, novaServiceURL, cb){
    request({
        method: 'GET',
        uri: novaServiceURL + '/servers',
        headers:{
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b){
        var VMs = JSON.parse(b);
        cb(VMs);
    })
}

function getDetailVirtualInstance(tokenID, novaServiceURL, serverID, cb){
    request({
        method: 'GET',
        uri: novaServiceURL+'/servers/'+serverID,
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b){
        var vm = JSON.parse(b);
        cb(vm);
    });
}

function terminateVirtualInstance(tokenID, novaServiceURL, serverID, cb){
    request({
        method: 'DELETE',
        uri: novaServiceURL + '/servers/' +serverID,
        headers:{
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b){
        console.log(r.statusCode);
        cb();
    });
}

function getFlavors(tokenID, novaServiceURL, cb){
    request({
        method: 'GET',
        uri: novaServiceURL + '/flavors',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b){

    });
}

function getFlavors(tokenID, novaServiceURL, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/flavors',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var flavors = JSON.parse(b);
        cb(flavors);
    });
}

function getImages(tokenID, novaServiceURL, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/images',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var images = JSON.parse(b);
        cb(images);
    });
}

function createVirtualInstance(tokenID, novaServiceURL, name, flavor, image, cb) {
    request({
        method: 'POST',
        uri: novaServiceURL + '/servers',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        },
        body: JSON.stringify({
            server: {
                name: name,
                imageRef: image.id,
                flavorRef: flavor.id
            }
        })
    }, function(e, r, b) {
        var vm = JSON.parse(b);
        cb(vm);
    });
}

function getVirtualInstanceAddress(tokenID, novaServiceURL, serverID, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/servers/' + serverID + '/ips',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function (e, r, b) {
        var address = JSON.parse(b);
        cb(address);
    });
}

