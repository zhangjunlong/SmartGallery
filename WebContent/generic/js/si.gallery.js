/**
 * SI Smart Gallery Library
 * 
 * @author Zhang Junlong
 * @require JQuery, JQuery Mobile, PhotoSwipe
 */
var si = si ? si : {};
si.gallery = si.gallery ? si.gallery : new SIGallery();

function SIGallery() {
	this.home = 'gallery/';
}

SIGallery.prototype.load = function() {
	$.mobile.showPageLoadingMsg();
	$.ajaxSetup({
		async : false
	});
	$.get(this.home + 'layout.properties', function(layout) {
		layout = layout.replace(/\r/g, '|').replace(/\n/g, '|').replace(
				/\|\|/g, '|');
		var subGalleries = layout.split('|');
		si.gallery.createAlbums(subGalleries);
		
		$('#all').html();
		$.each(subGalleries, function(i, gallery) {
			if ('' != $.trim(gallery[0]) && '#' != $.trim(gallery[0]).charAt(0)) {
				$.mobile.showPageLoadingMsg();
				gallery=gallery.split(':');
				$.get(si.gallery.home + gallery[0] + '/list.properties', function(
						list) {
					//$('#' + gallery).html();
					si.gallery.createAlbumPage(gallery,list);
					
					$.mobile.hidePageLoadingMsg();
				});
			}
		});
	});
	$.ajaxSetup({
		async : true
	});
};
/**
 * Create gallery albums on page according to layout file
 * @param albumsArray
 */
SIGallery.prototype.createAlbums = function(albumsArray) {
	var gTemplate = $('#gTemplate').html();
	var pTemplate=$('#pTemplate').html();
	
	$.each(albumsArray, function(i, album) {
		if ('' != $.trim(album) && '#' != $.trim(album).charAt(0)) {
			album = album.split(':');
			var id = album[0];
			var name = u2str(album[1]);
			var type = album[2];
			var gAlbum = gTemplate.replace(/{id}/g, id);
			$('#albums').append(gAlbum);
			$('#'+id+'Name').html(name);
			
			var gPage=pTemplate.replace(/{id}/g, id).replace(/{type}/g, type);
			$('body').append(gPage);
			$('#'+id+'Title').html(name);
			
		}
	});
};

SIGallery.prototype.createAlbumPage=function (album,list) {
	var albumId=album[0];
	var albumType=album[2].toLowerCase();
	
	list = list.replace(/\r/g, '|').replace(/\n/g, '|')
			.replace(/\|\|/g, '|');
	// Format List view according to album's type
	if ('news' == albumType) {
		$('#'+albumId+'List').attr('data-role','listview');
	} else if ('videos' == albumType) {
		if(!$.isEmptyObject($('#videoPlayer'))) {
			var vpHtml=$('#videoPlayerTemplate').html().replace(/{vpTemplateId}/g,albumId+'VideoPlayer');
			$('#'+albumId+'List').before(vpHtml);
			_V_(albumId+'VideoPlayer', {}, function(){
			      // Player (this) is initialized and ready.
			});
		}
	}
	
	$.each(list.split('|'), function(i, line) {
		line = $.trim(line);
		if ('' != line && '#' != line.charAt(0)) {
			var url = si.gallery.home + albumId + '/' + line;
			var suffix = line.substring(line.length - 3,
					line.length);
			var tag='';
			
			if (suffix == 'm4v' || suffix == 'mp4') {
				tag = '<video src="' + url
						+ '" alt="' + line
						+ '" preload="metadata" loop="loop" poster="'+url+'.png"/>';
			} else if(suffix=='txt' || suffix=='htm' || suffix=='tml'){
				$.get(url, function(txt) {
					tag = '<div>' + txt + '</div>';
				});
			} else {
				tag = '<img src="' + url + '" alt="' + line + '" />';
			}
			
			var html='<li><a href="{href}" {data-rel} {events}">'+tag+'</a></li>';
			if('gallery'==albumType) {
				var href=url;
				html=html.replace(/{data-rel}/g, 'rel="external"').replace(/{href}/g, href);
				html=html.replace(/{events}/g, '');
			}else if('videos'==albumType){
				var href='javascript:void(0)';
				html=html.replace(/{data-rel}/g, '').replace(/{href}/g, href);
				html=html.replace(/{events}/g, 'onclick="playVideo('+albumId+'VideoPlayer,this);"');
			}else{
				var href='#viewer';
				html=html.replace(/{data-rel}/g, '').replace(/{href}/g, href);
				html=html.replace(/{events}/g, 'onclick="showContent(this);"');
			}
			$('#' + albumId+'List').append(html);
			
			if (1 == i) {
				if('videos'==albumType) {
					$('#' + albumId + 'Thumb').attr('src',
							'generic/images/vlib.jpg');
				}else if('news'==albumType){
					$('#' + albumId + 'Thumb').attr('src',
							'generic/images/news.jpg');
				} else {
					var thumb = si.gallery.home + albumId + '/'
					+ $.trim(line);
					$('#' + albumId + 'Thumb').attr('src',
					thumb);
				}
			}
		}
	});
};

/**
 * transform text in utf8 format to string
 * @param text
 * @returns
 */
function u2str(text){
    return decodeURI(unescape((text.replace(/\\/g,'%').replace(/;/g,''))));
}

function showContent(obj) {
	$('#viewerContent').html($(obj).html());
	$('#viewerContent img').attr('class','');
}

function playVideo(vpId,obj) {
	var vp = _V_(vpId);
	vp.src(obj.firstChild.src);
	vp.play();
}