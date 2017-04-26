

module.exports = function init(config, modelStructure, app, storageClient) {
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var multer = require('multer');
	var uuid = require('uuid/v4');
	var fs = require('fs');

	var filesApi = [];

	var shemaConfiguration = extractShema(modelStructure);


	var model = mongoose.model(config.shema, shemaConfiguration);


	var service = {
		"getAll": function(){
			return new Promise(function (fulfill, reject){
			    model.find(function(err, list) {
					if (err){
						reject(500);
					}else{
						fulfill(list);
					}
				});
			});			
		},
		"getById": function(id){
			return new Promise(function (fulfill, reject){
			    model.findById(id, function(err, object) {
			    	if (!object){
						reject(404);
					}else if (err){
						reject(500);
					}else{
						fulfill(object);
					}
				});
			});	
		},

		"find": function(criteria){
			return new Promise(function (fulfill, reject){
			    model.find(criteria, function(err, list) {
			    	if (err){
						reject(500);
					}else{
						fulfill(list);
					}
				});
			});	
		},

		
		"create": function(object){
			return new Promise(function (fulfill, reject){
				var keys = Object.keys(shemaConfiguration);
				var data = updateObject({}, object);
				model.create(data, function(err, objectCreated) {
					if (err){
						reject(500);
					}else{
						fulfill(objectCreated);
					}
				});
			});	
		},
		"update": function(id, object){
			return new Promise(function (fulfill, reject){
				var keys = Object.keys(shemaConfiguration);
				model.findById(id, function(err, objectFound) {
					if (!objectFound)
						reject(404);
					else {
						var keys = Object.keys(object);
						var data = updateObject(objectFound, object);
						data.save(function(err) {
							fulfill(data);
						});
					}
				});
			});	
		},
		"deleteById": function(id){
			return new Promise(function (fulfill, reject){
			    model.findByIdAndRemove(id, function(err, object) {
			    	if (!object){
						reject(404);
					}else if (err){
						reject(500);
					}else{
						fulfill(object);
					}
				});
			});	
		} 
	};


	//GET /
	app.get(config.baseApi, ensureAuthenticated, function(req, res) {
		console.log("GET "+config.baseApi);
		service.getAll().then(function(list){
				res.json(list);
			}, 
			function(error){
				res.status(500).send(error);
			}
		);		
	});

	//GET /:id
	app.get(config.baseApi+':id', function(req, res) {
		console.log("GET "+config.baseApi+req.params.id);
		service.getById(req.params.id).then(function(object){
				res.json(convert(object));
			}, 
			function(error){
				res.status(error);
			}
		);	
	});

	//DELETE /:id
	app.delete(config.baseApi+':id', function(req, res) {
		console.log("DELETE "+config.baseApi+req.params.id);
		service.deleteById(req.params.id).then(function(object){
				res.send();
			}, 
			function(error){
				res.status(error);
			}
		);	
	});

	//POST /
	app.post(config.baseApi, function(req, res) {
		console.log("POST "+config.baseApi);
		service.create(req.body).then(function(object){
				res.json(convert(object));
			}, 
			function(error){
				res.status(error);
			}
		);	
	});


	//PUT /:id
	app.put(config.baseApi+':id', function(req, res) {
		console.log("PUT "+config.baseApi+req.params.id);
		service.update(req.params.id, req.body).then(function(object){
				res.json(convert(object));
			}, 
			function(error){
				res.status(error);
			}
		);	
	});

	for(var i = 0; i < filesApi.length; i++){
		registerSubFieldFile(filesApi[i]);
	}



	function extractShema(modelStructure){
		var shemaConfiguration = {};
		for(var i = 0; i < modelStructure.length; i++){
			var structure = modelStructure[i];
			if(structure.type === "String"){
				shemaConfiguration[structure.name] = structure.type;
			}if(structure.type === "Boolean"){
				shemaConfiguration[structure.name] = structure.type;
			}else if(structure.type === "Files"){
				shemaConfiguration[structure.name] = [{ _id: 'string',  href: 'string'}];
				filesApi.push(structure);
			}else if(structure.type === "Object"){
				shemaConfiguration[structure.name] = extractShema(structure.shema);
			}else{
				console.error("not managed type")
			}
		}
		return shemaConfiguration;
	}

	function updateObject(objet1, object2) {
		var keys = Object.keys(object2);
		for(var i = 0; i < keys.length; i++){
			objet1[keys[i]] = object2[keys[i]];
		}		
		return objet1;
	}

	function convert(object){
		if(object)
			object.href = config.baseApi+"/"+object._id;
		return object;
	};

	function registerSubFieldFile(truc){
		var name = truc.name;
		var storageContainer = truc.container;

		//POST /:id/name/
		app.post(config.baseApi+':id/'+name+'/', function(req, res) {
			console.log("POST "+config.baseApi+req.params.id+'/'+name+'/');
			model.findById(req.params.id, function(err, object) {
				if (!object)
					res.status(404).send("not found");
				else if(err){
					res.status(500).send(err);

				}
				else{
					 upload(req,res,function(err){
						if(err){
			             	res.json({error_code:1,err_desc:err});
			             	return;
						}


						var fileId = req.file.filename;

						var readStream = fs.createReadStream(req.file.path);
						var writeStream = storageClient.upload({
							container: storageContainer,
							remote: fileId
						});

						writeStream.on('error', function(err) {
							 console.log('upload failed:', err);
						});

						writeStream.on('success', function(file) {
							var file = {
							 	"_id" : fileId,
							 	"href" : config.serverHost+":"+config.port+config.baseApi+req.params.id+'/'+name+'/'+fileId
							 };
							object[name].push(file);
							object.save(function(err) {
								if(err){
					        		res.json({error_code:0,err_desc:err.message});
								}else{
									res.json(file);
								}
							});
						});

						readStream.pipe(writeStream);

					});

				}
			});
		   

		});
		//GET /:id/name/:fileId
		app.get(config.baseApi+':id/'+name+'/:fileId', function(req, res) {

			console.log("GET "+config.baseApi+req.params.id+'/'+name+'/'+req.params.id);
			model.findById(req.params.id, function(err, object) {
				if (!object)
					res.status(404).send("not found");
				else if(err){
					res.status(500).send(err);
				}
				else{
					var fileId = req.params.fileId;

					var download= storageClient.download({
						container: storageContainer,
						remote: fileId
					});

					download.pipe(fs.createWriteStream('/tmp/'+fileId));   	
					download.on('end', function() {
						res.sendFile("/tmp/"+fileId);
		 			});
		 			download.on('error', function() {
		 				console.log("erroooooooooooooooooor");
						res.sendFile("/tmp/"+fileId);
		 			});		
		   		}
		   	});

		});


		//DELETE /:id/name/:fileId
		app.delete(config.baseApi+':id/'+name+'/:fileId', function(req, res) {

			console.log("DELETE "+config.baseApi+req.params.id+'/'+name+'/'+req.params.id);
			model.findById(req.params.id, function(err, object) {
				if (!object)
					res.status(404).send("not found");
				else if(err){
					res.status(500).send(err);
				}
				else{
					var fileId = req.params.fileId;

					var download= storageClient.removeFile(storageContainer,fileId, function(err){
						if (err) {
							res.json({error_code:0,err_desc:err.message});
						}else {
							var index = -1;
							for(var i = 0; i < object[name].length;i++){
								if(object[name][i]._id === fileId){
									index = i;
								}
							}
							if(index != -1){
							    object[name].splice(index, 1);
								object.save(function(err) {
						        	res.json({error_code:0,err_desc:null});
								});
							}
						}
					});
		   		}
		   	});

		});
	}

	var storage = multer.diskStorage({ //multers disk storage settings

		destination: function (req, file, cb) {

		    cb(null, '/tmp/');

		},

		filename: function (req, file, cb) {

		    var name = uuid(); 

		    cb(null, name);

		}

	});



	var upload = multer({ //multer settings

		storage: storage

	}).single('file');

	function ensureAuthenticated(req, res, next) {
  		if (req.isAuthenticated()) {
  			return next();
  		}
  		res.sendStatus(401);
	}

	return service;

};