var Upload = {
	path: {
		'upload': 'http://test.com.br/uploads/'
	},
	_contructor: function(containers){
		Upload.create(containers);
	},
	create: function(containers){
		$(containers).each(function(index,object){
			var uploader = new plupload.Uploader({
				runtimes : 'html5,flash,browserplus',
				browse_button : $(object).find('a').attr('id'),
				unique_names: true,
				container: $(object).attr('id'),
				max_file_size : '800mb',
				url : 'upload.php',
				//resize : {width : 320, height : 240, quality : 90},
				flash_swf_url : 'js/plupload.flash.swf',
				filters : [
					{title : "Image files", extensions : "jpg,gif,png"},
					{title : "Zip files", extensions : "zip,rar"},
					{title : "ISO files", extensions : "iso"}
				]
			});

			Upload.events(uploader, $(object));
		});
	},
	events: function(uploader, container){
		$('#modal .close').on('click', function(e){
			e.preventDefault();

			$('#modal').hide().find('span').css('width','0%').html('0%');
		});

		uploader.bind('Error', function(up, error) {
			console.log(up);
			console.log(error);

			$(container).addClass('error');
			$('<label />').addClass('error').text(error.message).appendTo(container);
		});

		uploader.bind('FilesAdded', function(up, files) {
			setTimeout(function(){
				uploader.start();
			},1000);
		});

		uploader.bind('FileUploaded', function(up, file, response){
			if(Upload.isImage(file)){
				var size = {
					width: $(container).width()-2,
					height: $(container).height()-2
				}
				$(container).find('a').remove();

				var image = $('<span />').addClass('image');
				image.append(Upload.createThumbnail(file,size)).appendTo(container);

				Upload.createThumbnail(file,size);
			}

			$(container).removeClass('error');
		});

		uploader.bind('UploadComplete', function(up, files){
			$('#modal .title').text('Upload realizado com sucesso!');
		});

		uploader.bind('UploadProgress', function(up, file) {
			var percent = file.percent;
			$('#modal').show();
			$('#modal .progress-bar > span').html(percent+'%').css('width',percent+'%');
		});

		uploader.init();
	},
	createThumbnail: function(file, maxSize){
		var thumbnail = new Image();
		thumbnail.onload = function(){
			var ratio = maxSize.height/maxSize.width;
			if(this.height/this.width > ratio){
				if(this.height > maxSize.height){
					this.width = Math.round(this.width*(maxSize.height/this.height));
					this.height = maxSize.height;
				}
			}else{
				if(this.width > maxSize.height){
					this.height = Math.round(this.height*(maxSize.width/this.width));
					this.width = maxSize.width;
				}
			}
		}
		thumbnail.src = Upload.path.upload+file.target_name;

		return thumbnail;
	},
	isImage: function(file){
		var extension = Upload.getExtension(file.name),
			imageExtensions = 'jpg,png,gif';

			if(imageExtensions.indexOf(extension) != -1)
				return true;

		return false;
	},
	getExtension: function(file){
		var arr = file.split('.');
		var total = arr.length;

		return arr[total-1];
	}
};