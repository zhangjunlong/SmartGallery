/**
 * SI Smart Gallery Library
 * 
 * @author Zhang Junlong
 * @require JQuery, JQuery Mobile, PhotoSwipe
 */
var si = si ? si : {};
si.gallery = si.gallery ? si.gallery : new SIGallery();
si.auth=si.auth ? si.auth : new SIAuth();

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
	} else if('gallery'== albumType) {
		$(document).delegate('#'+albumId+'Page', 'pageinit', function() {
		    //notice I start the selection with the current page,
		    //this way you only run the code on images on this pseudo-page
			var option={
			    effect : "fadeIn"
			};
		    $(this).find("img.lazy").lazyload(option);
		});
	}
	
	$.each(list.split('|'), function(i, line) {
		line = $.trim(line);
		if ('' != line && '#' != line.charAt(0)) {
			var url = si.gallery.home + albumId + '/' + line;
			var suffix = line.substring(line.length - 3,
					line.length);
			var tag='';
			
			if (suffix == 'm4v' || suffix == 'mp4') {
				tag = '<video preload="none" src="' + url
						+ '" alt="' + line
						+ '" poster="'+url+'.png"/>';
			} else if(suffix=='txt' || suffix=='htm' || suffix=='tml'){
				$.get(url, function(txt) {
					tag = '<div>' + txt + '</div>';
				});
			} else {
				tag = '<img class="lazy" src="generic/images/grey.gif" data-original="' + url + '" alt="' + line + '" />';
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
					_V_(albumId+'VideoPlayer').src(url);
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

function SIAuth() {
	
}
SIAuth.prototype.check=function() {
	$.mobile.showPageLoadingMsg();
	//localStorage 
	if(!window.localStorage){ 
	 	alert("不支持本地存储"); 
	}
	var loAuthCode=window.localStorage.getItem("authCode");
	
	if(!loAuthCode) {
		$('#gotoVisitAnchor').hide();
		window.location.hash="settingsPage";
	} else {
		var authDate=window.localStorage.getItem('authDate');	
		if(getSimpleDate()>authDate) {
			$('#authMsg').html('授权已过期');
			$('#gotoVisitAnchor').hide();
			window.location.hash="settingsPage";
		} else{
			$('#authMsg').html('授权有效（过期时间：'+authDate+'）');
		}
	}
};
SIAuth.prototype.verify=function () {
	var code = $.trim($('#authCodeInput').val());
	window.localStorage.removeItem('authCode');
	window.localStorage.removeItem('authDate');
	
	$.get('authorization/'+code.toUpperCase()+'.auth?'+new Date())
	.success(function (authInfo){
		authInfo=authInfo.split(':');
		var authDate=authInfo[1];
		
		if(getSimpleDate()>authDate) {
			$('#authMsg').html('授权已过期（过期时间：'+authDate+'）');
			$('#gotoVisitAnchor').hide();
		} else {
			$('#authMsg').html('授权有效（过期时间：'+authDate+'）');
			window.localStorage.setItem('authCode',code);
			window.localStorage.setItem('authDate',authDate);
			$('#gotoVisitAnchor').show();
		}
	})
	.error(function (e){
		$.mobile.hidePageLoadingMsg();
		$('#authMsg').html("授权失败，请获得有效的授权再尝试");
	});
};
SIAuth.prototype.reset=function() {
	if(confirm('重置后您将需要重新进行授权才能访问内容，确定进行重置授权吗？')){
		window.localStorage.removeItem('authCode');
		window.localStorage.removeItem('authDate');
		$('#authCodeInput').val('');
		$('#authMsg').html('请重新输入授权码');
		$('#gotoVisitAnchor').hide();
	}
};
SIAuth.prototype.initAuthPage=function() {
	var loAuthCode=window.localStorage.getItem("authCode");
	if(loAuthCode) {
		$('#authCodeInput').val(loAuthCode);
		var authDate=window.localStorage.getItem('authDate');
		if(getSimpleDate()>authDate) {
			$('#authMsg').html('授权已过期');
			$('#gotoVisitAnchor').hide();
		} else{
			$('#authMsg').html('授权有效（过期时间：'+authDate+'）');
			$('#gotoVisitAnchor').show();
		}
	}
};
function getSimpleDate() {
	var cdate = new Date();
	var month = cdate.getMonth()+1;
	var date = cdate.getDate();
	if(month<10){
		month='0'+month;
	}
	if(date<10){
		date='0'+date;
	}
	return cdate.getFullYear()+'/'+month+'/'+date;
}