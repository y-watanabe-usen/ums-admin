/* Japanese initialisation for the jQuery UI date picker plugin. */
/* Written by Kentaro SATO (kentaro@ranvis.com). */
jQuery(function($){
	$.datepicker.regional['ja'] = {
		closeText: '閉じる',
		prevText: '&#x3C;前',
		nextText: '次&#x3E;',
		currentText: '今日',
		monthNames: ['1月','2月','3月','4月','5月','6月',
		'7月','8月','9月','10月','11月','12月'],
		monthNamesShort: ['1月','2月','3月','4月','5月','6月',
		'7月','8月','9月','10月','11月','12月'],
		dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
		dayNamesShort: ['日','月','火','水','木','金','土'],
		dayNamesMin: ['日','月','火','水','木','金','土'],
		weekHeader: '週',
		dateFormat: 'yy/mm/dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '年',
		monthSuffix: '月',
		yearRange: 'c-10:c+10',
		changeMonth: true,
		changeYear: true,
		beforeShowDay: function(day) {
			var result = null;
			switch (day.getDay()) {
				case 0: // 日曜日か？
					result = [true, "date-sunday"];
					break;
				case 6: // 土曜日か？
					result = [true, "date-saturday"];
					break;
				default:
					result = [true, ""];
				break;
			}
			return result;
		}
	};
	$.datepicker.setDefaults($.datepicker.regional['ja']);
});
