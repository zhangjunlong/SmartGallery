/**
 * SI Smart Gallery Library
 * 
 * @author Zhang Junlong
 * @require JQuery, JQuery Mobile, PhotoSwipe
 */
var si = si ? si : {};
si.gallery = si.gallery ? si.gallery : new SIGallery();

function SIGallery() {
	this.home = '../../gallery/';
}

SIGallery.prototype.load = function() {
	$.mobile.showPageLoadingMsg();
	$.ajaxSetup({
		async : false
	});
	$.get(this.home + 'layout.properties', function(layout) {
		var subGalleries = layout.split('\n');
		var ttCnt = 0;
		$('#all').html();
		$.each(subGalleries, function(i, gallery) {
			if ('' != $.trim(gallery) && '#' != $.trim(gallery).charAt(0)) {
				$.mobile.showPageLoadingMsg();
				$.get(si.gallery.home + gallery + '/list.properties', function(
						list) {
					$('#' + gallery).html();
					var cnt = 0;
					$.each(list.split('\n'),
							function(i, line) {
								if ('' != $.trim(line)
										&& '#' != $.trim(line).charAt(0)) {
									var url = si.gallery.home + gallery + '/'
											+ $.trim(line);
									var html = '<li><a href="' + url
											+ '" rel="external"><img src="'
											+ url + '" alt="' + line
											+ '" /></a></li>';
									$('#' + gallery).append(html);
									$('#' + gallery + 'Cnt').html(++cnt);
									if (1 == i) {
										var thumb = si.gallery.home + gallery
												+ '/' + $.trim(line);
										$('#' + gallery + 'Thumb').attr('src',
												thumb);
									}
									$('#all').append(html);
									$('#allCnt').html(++ttCnt);
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