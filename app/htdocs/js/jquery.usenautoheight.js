/*!
* jQuery usenautoheight plugin
* Version 1.0.1 2013/11/25
*/

(function ($) {
	var autoheight = {
		target: new Array
	};

	$.fn.usenautoheight = function(options) {
		var t = $(this);
		var tId = t.attr("id");
		autoheight.target[tId] = {
			p: $.extend({
					panel: new Array,
				}, options),
			bmHeightRev: 0,		//高さ固定部分のheightの合計値
			bmHeightMin: 100	//高さ調整部分の最小値
		};

		var o = autoheight.target[tId];

		$.each($(o.p.panel), function (i, row) {
			if (row.height>0) {
				o.bmHeightRev += parseInt(row.height);
				$(row.id).height(row.height - parseInt($(row.id).css("padding-top")) - parseInt($(row.id).css("padding-bottom")));
			} else {
				o.bmHeightRev += (parseInt($(row.id).css("padding-top")) + parseInt($(row.id).css("padding-bottom")));
				o.bmO = $(row.id);
			}
		});

		//メインパネルの高さを調整
		if (parseInt(t.height()) < o.bmHeightRev + o.bmHeightMin) t.css("min-height",o.bmHeightRev + o.bmHeightMin);

		//高さ調整部分のheightをセット
		o.bmO.height(parseInt(t.height()) - o.bmHeightRev);

		//ブラウザのリサイズの再セット
		$(window).resize(function(){
			if (parseInt(t.height()) < o.bmHeightRev + o.bmHeightMin) t.css("min-height",o.bmHeightRev + o.bmHeightMin);
			o.bmO.height(parseInt(t.height()) - o.bmHeightRev);
		});
		
		return $(this);
	}
})(jQuery);
