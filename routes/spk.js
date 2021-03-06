var express = require('express');                                
var router = express.Router();
var exec = require("child_process").exec;

var fs = require('fs')

var appRoute = 'app/'
var appFolder = './app'

router.get('/', function(req, res, next) {

    console.log(req.query.spkfile);
    console.log(req.query.textfile);
    console.log(req.query.username);

    var submit = 'spark-submit ' + appRoute + req.query.spkfile + ' --file=' + req.query.textfile + ' --user=' + req.query.username

    exec('hdfs dfs -ls /' + req.query.username , function(err, stdout, stderr){
	//make file list to username
	var fileList = stdout.split('\n')
	for(var i=1 ; i<fileList.length-1 ; i++){
		fileList[i] = fileList[i].split('/'+req.query.username+'/')[1]
		console.log(fileList[i])
	}

    exec('hdfs dfs -ls /', function(err, stdout, stderr){

	//make user list
	var userList = stdout.split('\n')	
	for(var i=1 ; i<userList.length-1 ; i++){
		userList[i] = userList[i].split('/')[1]
		console.log(userList[i])
	}

      fs.readdir(appFolder, function (err, files){	
        exec(submit, function (err, stdout, stderr) {




          console.log(stdout);
          console.log(stderr);

          res.render('spk', { title: 'spark-submit', data: stdout, applist: files, userlist: userList, filelist: fileList });

        });
      });
    });
    });

});

module.exports = router;
