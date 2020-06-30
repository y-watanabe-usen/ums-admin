/*!
* jQuery usengrid plugin
* Version 1.1.6 2014/8/14
*/

;(function ($) {
	var plugname = 'usengrid';

	var grid = {
		scrollSize: 18,		//スクロールの幅
		defTdWidth: 100,	//デフォルトの項目幅
		minTdWidth: 10,		//最小の項目幅
		headerSize: 20,		//タイトルの高さ
		scPadTop: 23,		//grid.headerSize+1
		tableSpace: 20,		//表の最下部スペース
		target: new Array
	};


	$.fn[plugname] = function(method) {

		var t = this;
		var tId = $(t).attr("id");
		grid.selId = tId;


		var methods = {
		
			//------------------------------------------------------------------------
			//初期
			//------------------------------------------------------------------------
			init : function(pt) {

				grid.target[tId] = {
					p : $.extend({
							height: 200,		//gridの高さ
							width: 'auto',		//gridの幅
							resize: true,		//リサイズON/OFF
							scroll: true,		//強制的にスクロールを消したいときはfalseにする
							hcolor: 'gray',		//タイトルの背景色
							nowrap: true,		//グリッドの改行
							firstRow: null,		//初期表示件数
							loadRow: 50,		//スクロール時のロード件数
							click : function(){},		//
							dblclick : function(){},
							scBottom : function(){},
							custom: function(value, line, i, j){
								return value;
							},
							data: new Array,
							column: new Array
						}, pt),
					colCnt : $('thead th', t).length,
					rowCnt : $('tbody tr', t).length,
					gDiv : document.createElement('div'),		//global
					mDiv : document.createElement('div'),		//main
					hDiv : document.createElement('div'),		//タイトル
					sDiv : document.createElement('div'),		//縦スクロール用1
					nDiv : document.createElement('div'),		//縦スクロール用2
					dDiv : document.createElement('div'),		//データ
					cDrag : document.createElement('div'),		//ドラッグ
					lDiv : document.createElement('div'),		//loading用
					dTable : document.createElement('table'),
					rDivArr : new Array,
					thWidthArr : new Array,
					beforeClickTr : null,
					selectedTr : null,
					dispRow : 0
				};

				//thisを初期化
				$(t).attr({cellPadding: 0, cellSpacing: 0, border: 0}).hide();

				//classをセット
				$(grid.target[tId].gDiv).addClass("usengrid");
				$(grid.target[tId].mDiv).addClass("mDiv");
				$(grid.target[tId].hDiv).addClass("hDiv");
				$(grid.target[tId].sDiv).addClass("sDiv");
				$(grid.target[tId].nDiv).addClass("nDiv");
				$(grid.target[tId].dDiv).addClass("dDiv");
				$(grid.target[tId].cDrag).addClass("cDrag");
				$(grid.target[tId].lDiv).addClass("lDiv").html("loading...");
				$(grid.target[tId].dTable).addClass("dataTable");

				//htmlをdataに変換するためにバックアップ
				var tmpTBody = $("tbody",t).clone(true);
				$("tbody",t)[0].innerHTML = "";


				$(t).before(grid.target[tId].gDiv);
				$(grid.target[tId].gDiv).width(grid.target[tId].p.width).height(grid.target[tId].p.height);

				var gh = grid.target[tId].p.height;
				var gw = grid.target[tId].p.width;
				if (isNaN(grid.target[tId].p.width)) {
					gw = $(grid.target[tId].gDiv).width() - 1;
				}
				if (isNaN(grid.target[tId].p.height)) {
					gh = $(grid.target[tId].gDiv).height();
				}

				$(grid.target[tId].gDiv).append(grid.target[tId].hDiv).append(grid.target[tId].mDiv).append(grid.target[tId].sDiv).append(grid.target[tId].cDrag).append(grid.target[tId].lDiv);
				$(grid.target[tId].sDiv).append(grid.target[tId].nDiv);
				$(grid.target[tId].mDiv).append(t);


				//resizeしないときは、横スクロールを表示しない
				if (grid.target[tId].p.resize == false) {
					$(grid.target[tId].mDiv).width(gw-grid.scrollSize).height(gh).css("overflow-x", "hidden");
					$(grid.target[tId].hDiv).height(grid.headerSize)
					$(grid.target[tId].sDiv).width(grid.scrollSize).height(gh-grid.scPadTop).css("margin-top", grid.scPadTop + 'px');
					$(grid.target[tId].dDiv).height(gh-grid.scPadTop);
					$(grid.target[tId].cDrag).height(gh);
					$(grid.target[tId].lDiv).width(gw-grid.scrollSize).css("bottom", 0);
					
					//scrollなしのときは、縦スクロールを表示しない
					if (grid.target[tId].p.scroll == false) {
						$(grid.target[tId].mDiv).width(gw);
						$(grid.target[tId].sDiv).css("display", "none");
					}
				} else {
					$(grid.target[tId].mDiv).width(gw-grid.scrollSize).height(gh);
					$(grid.target[tId].hDiv).height(grid.headerSize)
					$(grid.target[tId].sDiv).width(grid.scrollSize).height(gh-grid.scrollSize-grid.scPadTop).css("margin-top", grid.scPadTop + 'px');
					$(grid.target[tId].dDiv).height(gh-grid.scrollSize-grid.scPadTop);
					$(grid.target[tId].cDrag).height(gh-grid.scrollSize);
					$(grid.target[tId].lDiv).width(gw-grid.scrollSize).css("bottom", grid.scrollSize);
				}

				//色のセット
				var headColor = "usengrid-bg-gray";
				if (grid.target[tId].p.hcolor == "green") {
					headColor = "usengrid-bg-green";
				} else if (grid.target[tId].p.hcolor == "darkgreen") {
					headColor = "usengrid-bg-darkgreen";
				} else if (grid.target[tId].p.hcolor == "red") {
					headColor = "usengrid-bg-red";
				} else if (grid.target[tId].p.hcolor == "blue") {
					headColor = "usengrid-bg-blue";
				} else if (grid.target[tId].p.hcolor == "purple") {
					headColor = "usengrid-bg-purple";
				} else if (grid.target[tId].p.hcolor == "gray") {
					headColor = "usengrid-bg-gray";
				}
				$(grid.target[tId].hDiv).addClass(headColor);

				$(t).append('<tr><td colspan="'+grid.target[grid.selId].colCnt+'" border="0"></td></tr>');
				$('td', t).html(grid.target[tId].dDiv);

				$(grid.target[tId].dDiv).append(grid.target[tId].dTable).append('<div style="height:'+grid.tableSpace+'px;"></div>');

				//表示する
				$(t).show();

				$.each($('thead th', t), function (i, row) {
					grid.target[tId].thWidthArr[i] = (parseInt(row.width)) ? parseInt(row.width) : $(row).width();

					if (!grid.target[tId].thWidthArr[i]) grid.target[tId].thWidthArr[i] = grid.tdWidth;
					$(row).removeAttr('width').css('width','');
					var thHtml = row.innerHTML;
					row.innerHTML = '<span class="dSpan resizeClass'+tId+i+'" style="width:'+grid.target[tId].thWidthArr[i]+'px;height:'+grid.headerSize+'px;">'+thHtml+'</span>';

					if (grid.target[tId].p.resize) {
						//リサイズボタン
						grid.target[tId].rDivArr[i] = document.createElement('div');
						$(grid.target[tId].rDivArr[i]).addClass('rDiv').addClass(headColor);
						$("span",row).append($(grid.target[tId].rDivArr[i]));
					}
					
					//column初期設定
					if (!grid.target[tId].p.column[i]) {
						grid.target[tId].p.column[i] = {"name":i, "style":""};
					} else if (!grid.target[tId].p.column[i].style) {
						grid.target[tId].p.column[i].style = "";
					}
				});

				//htmlをdataに変換
				if ($("tr",tmpTBody)[0]) {
					$.each($("tr",tmpTBody), function(i, tr) {
						var tmpObj = {};
						$.each($("td",tr), function(j, td) {
							tmpObj[grid.target[tId].p.column[j].name] = $(td).html();
							var c = $(td).attr("class");
							if (c) {
								if (!tmpObj["_class"]) tmpObj["_class"] = {};
								tmpObj["_class"][j] = c;
							}
							
						});
						grid.target[tId].p.data.push(tmpObj);
					});
				}

				if (grid.target[tId].p.data.length == 0) {
					grid.noData();
					grid.setResizeEvent();
				} else {
					grid.addRow(0, (grid.target[tId].p.firstRow>0) ? grid.target[tId].p.firstRow : grid.target[tId].p.data.length);
					grid.setResizeEvent();
					grid.setEvent();
				}

				return t;
			},
			clear : function(p) {
				$(grid.target[grid.selId].dTable)[0].innerHTML = "";
				grid.target[grid.selId].dispRow = 0;
				grid.target[grid.selId].p.data = new Array;
				grid.setEvent();
				$(grid.target[grid.selId].sDiv).unbind('scroll');
				grid.noData();
				return t;
			},
			add : function(p) {
				if (grid.target[grid.selId].p.data.length == 0) $(grid.target[grid.selId].dTable)[0].innerHTML = "";
				$.each(p, function (i, row) {
					grid.target[grid.selId].p.data.push(row);
				});
				grid.addRow(grid.target[grid.selId].dispRow, p.length);
				grid.setEvent();
				return t;
			},
			loading : function(p) {
				if (p == 1) {
					$(grid.target[grid.selId].lDiv).show();
				} else {
					$(grid.target[grid.selId].lDiv).hide();
				}
				return t;
			},
			change  : function(p) {alert("change"); return this;},
			getSelected : function(p) {
				return $(selectedTr[dTableId]).index();
			},
			test : function(p) {alert(plugname); return this;}
		};

		if ( methods[method] ) {
			return methods[ method ]
				.apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.' + plugname );
			return this;
		}

	};

	grid.getAccessor = function(obj, expr) {
		var ret,prm,p = [], i;
		ret = obj[expr];
		if (ret===undefined) {
			try {
				prm = expr.split('.');
				i = prm.length;
				if (i) {
					ret = obj;
					while (ret && i--) {
						p = prm.shift();
						ret = ret[p];
					}
				}
				if (ret===undefined) {
					ret = "";
				}
			} catch (e) {}
		}
		return ret;
	}

	grid.addRow = function(start, limit) {
		if (grid.target[grid.selId].p.data.length - start <= limit) limit = grid.target[grid.selId].p.data.length - start;

		var end = start + limit;
		var trArr = new Array;
		var spanCss = (!grid.target[grid.selId].p.nowrap) ? 'white-space:normal;word-wrap:break-word;overflow:visible;' : '';
		for (i=start; i<end; i++) {
			var tmpTd ="";
			if (!grid.target[grid.selId].p.data[i]._class) grid.target[grid.selId].p.data[i]._class = new Array;
			for (j=0; j<grid.target[grid.selId].colCnt; j++) {
				var str = grid.target[grid.selId].p.custom(
								grid.getAccessor(grid.target[grid.selId].p.data[i],grid.target[grid.selId].p.column[j].name),
								grid.target[grid.selId].p.data[i],
								i,
								j
							);
				var tdClass = "";
				if (grid.target[grid.selId].p.data[i]._class[j] != "") {
					tdClass = "class='" + grid.target[grid.selId].p.data[i]._class[j] + "'";
				}
				tmpTd += '<td '+tdClass+' style="'+grid.target[grid.selId].p.column[j].style+'"><span class="dSpan resizeClass'+grid.selId+j+'" style="width:'+grid.target[grid.selId].thWidthArr[j]+'px;'+spanCss+'">'+str+'</span></td>';
			}
			trArr.push('<tr>'+tmpTd+'</tr>');
		}
		$(grid.target[grid.selId].dTable).append(trArr.join(''));
		grid.target[grid.selId].dispRow = end;
	};

	grid.noData = function() {
		var rowCnt = (Math.floor( $(grid.target[grid.selId].sDiv).height() / 20));
		var trArr = new Array;
		for (i=0; i<rowCnt; i++) {
			var tmpTd ="";
			for (j=0; j<grid.target[grid.selId].colCnt; j++) {
				tmpTd += '<td><span class="dSpan resizeClass'+grid.selId+j+'" style="width:'+grid.target[grid.selId].thWidthArr[j]+'px;"></span></td>';
			}
			trArr.push("<tr>"+tmpTd+"</tr>");
		}
		$(grid.target[grid.selId].dTable).append(trArr.join(''));
	};

	grid.setResizeEvent = function() {
		var this_id = grid.selId;

		//カラムのリサイズ
		if (grid.target[this_id].p.resize) {
			$.each(grid.target[this_id].rDivArr, function (i, row) {
				$(row).unbind();
				$(row).mousedown(function(e){
					var mx = e.pageX;
					var pSp = $(this).parent();
					var ws = $(pSp).width();
					var gDivLeft = $(grid.target[this_id].gDiv).offset().left;
					$(grid.target[this_id].cDrag).css("left", e.pageX-gDivLeft+"px").show();
					$(document).on('mousemove', function(e) {
						var wx = ws + e.pageX - mx;
						if (wx > grid.minTdWidth) {
							$(grid.target[this_id].cDrag).offset({left:e.pageX});
						}
					}).one('mouseup', function(e) {
						$(grid.target[this_id].cDrag).hide();
						var wx = ws + e.pageX - mx;
						if (wx > grid.minTdWidth) {
							$(pSp).width(wx);
							$(".resizeClass"+this_id+i).width(wx);
							grid.target[this_id].thWidthArr[i] = wx;
						} else {
							$(pSp).width(grid.minTdWidth);
							$(".resizeClass"+this_id+i).width(grid.minTdWidth);
							grid.target[this_id].thWidthArr[i] = grid.minTdWidth;
						}
						$(document).off('mousemove');
					});
					return false;
				});
			});
		}
		
		//ブラウザがリサイズされたとき
		$( window ).resize(function(){
			$(grid.target[this_id].gDiv).css({"height": grid.target[this_id].p.height, "width": grid.target[this_id].p.width});
			var pH = $(grid.target[this_id].gDiv).height();
			var pW = $(grid.target[this_id].gDiv).width() - 1;

			var mDivWidth = (grid.target[this_id].p.scroll == false) ? pW : pW-grid.scrollSize;
			var sDivHeight = (grid.target[this_id].p.resize == false) ? pH-grid.scPadTop : pH-grid.scrollSize-grid.scPadTop;
			var dDivHeight = (grid.target[this_id].p.resize == false) ? pH-grid.scPadTop : pH-grid.scrollSize-grid.scPadTop;

			$(grid.target[this_id].mDiv).width(mDivWidth).height(pH);
			$(grid.target[this_id].sDiv).height(sDivHeight);
			$(grid.target[this_id].dDiv).height(dDivHeight);
			$(grid.target[this_id].cDrag).height(pH-grid.scrollSize);
		});
		
	};

	grid.setEvent = function() {
		var this_id = grid.selId;

		//縦スクロール制御
		var tableHeight = $(grid.target[this_id].dTable).height();

		$(grid.target[this_id].nDiv).height(tableHeight+grid.tableSpace);
		var nDivHeight = $(grid.target[this_id].nDiv).height();
		var sDivHeight = $(grid.target[this_id].sDiv).height();

		$(grid.target[this_id].sDiv).unbind('scroll').scroll(function () {
			$(grid.target[this_id].dDiv).scrollTop($(this).scrollTop());
			if ($(this).scrollTop()>nDivHeight-sDivHeight-1) {
				grid.nextDataLoad(this_id);
				if (grid.target[this_id].dispRow == grid.target[this_id].p.data.length & grid.target[this_id].p.data.length != 0 ) grid.target[this_id].p.scBottom();
			}
		});

		//クリック制御 ダブルクリック制御
		$(grid.target[this_id].dTable).unbind('click').delegate('tr', 'click', function() {
			if (grid.target[this_id].beforeClickTr) $(grid.target[this_id].beforeClickTr).removeClass('selected');
			$(this).addClass('selected');
			grid.target[this_id].beforeClickTr = $(this);
			grid.target[this_id].selectedTr = $(this);
			grid.target[this_id].p.click(grid.target[this_id].p.data[$(this).index()]);
		}).unbind('dblclick').delegate('tr', 'dblclick', function() {
			grid.target[this_id].p.dblclick(grid.target[this_id].p.data[$(this).index()]);
		});

	};

	grid.nextDataLoad = function(id) {
		grid.selId = id;
		grid.addRow(grid.target[id].dispRow, grid.target[id].p.loadRow);
		grid.setEvent();
	};
	
})(jQuery);
