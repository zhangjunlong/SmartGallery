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
		var ttCnt = 0;
		var tvCnt = 0;
		$('#all').html();
		$.each(subGalleries, function(i, gallery) {
			if ('' != $.trim(gallery) && '#' != $.trim(gallery).charAt(0)) {
				$.mobile.showPageLoadingMsg();
				$.get(si.gallery.home + gallery + '/list.properties', function(
						list) {
					$('#' + gallery).html();
					var cnt = 0;
					list = list.replace(/\r/g, '|').replace(/\n/g, '|')
							.replace(/\|\|/g, '|');
					$.each(list.split('|'), function(i, line) {
						line = $.trim(line);
						if ('' != line && '#' != line.charAt(0)) {
							var url = si.gallery.home + gallery + '/' + line;
							var suffix = line.substring(line.length - 3,
									line.length);
							if (suffix == 'm4v' || suffix == 'mp4') {
								var vhtml = '<li><a href="' + url
										+ '" rel="external"><video src="' + url
										+ '" alt="' + line
										+ '" controls="controls" preload="metadata">您的浏览器可能不支持该视频</video></a></li>';
								$('#' + gallery).append(vhtml);
								$('#' + gallery + 'Cnt').html(++cnt);
							} else {
								var html = '<li><a href="' + url
										+ '" rel="external"><img src="' + url
										+ '" alt="' + line + '" /></a></li>';
								$('#' + gallery).append(html);
								$('#' + gallery + 'Cnt').html(++cnt);
								if (1 == i) {
									var thumb = si.gallery.home + gallery + '/'
											+ $.trim(line);
									$('#' + gallery + 'Thumb').attr('src',
											thumb);
								}
								$('#all').append(html);
								$('#allCnt').html(++ttCnt);
							}
						}
					});

					$.mobile.hidePageLoadingMsg();
				});
			}
		});
	});
	$.ajaxSetup({
		async : true
	});
};