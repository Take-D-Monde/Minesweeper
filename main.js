var difficulty;
var min_point_count = 0;
var max_point_count;
var min_bomb_count;
var max_bomb_count;
var exist_bomb = [];
var min_bomb_count;
var max_bomb_count;
var bomb_line;
var bomb_index;
var is_clicked = [];
var field_line;
var field_index;
var count_bomb = 0;
var is_game_clear;
var message_cleared = 'CLEARED!!';
var message_game_over = 'GAME OVER';
var is_game_start = true;
var line_top;
var line_bottom;
var index_left;
var index_right;
var count_is_not_clicked = 0;
var is_game_over;

$(document).ready(function(){
	if(is_game_start){		
		createGameField();
		is_game_start = false;	
	}
});

var createGameField = function createGameField() {
	//ゲームクリア・オーバーを解除
	is_game_over = false;
	is_game_clear = false;
	//爆弾の最小値を設定
	min_bomb_count = 1;
	//ゲーム開始時、難易度を「普通」に設定
	if(is_game_start){
		$("#normal").prop('checked','checked');
	}
	difficulty = $('input[name=difficulty]:checked').val();
	switch(difficulty){
		case 'easy':
			max_point_count = 5;
			max_bomb_count = 6;
			break;
		case 'normal':
			max_point_count = 8;
			max_bomb_count = 21;
			break;
		case 'hard':
			max_point_count = 10;
			max_bomb_count = 50;
			break;
		default:
			max_point_count = 8;
			max_bomb_count = 21;
			break;
	}
	//ゲームフィールドを初期化
	for(var i = min_point_count; i <= max_point_count; i++){
		$('#game_field').append('<tr class=line' + i + '>');
			for(var j = 0; j <= max_point_count; j++){
				$('.line' + i).append('<td class=cell' + j + '></td>');
			}
		$('#game_field').append('</tr>');
	}
	//爆弾を置く場所を初期化
	for(var i = min_point_count; i <= max_point_count; i++){
		for(var j = min_point_count; j <= max_point_count; j++){
			exist_bomb[i] = [];
			exist_bomb[i][j] = false;
		}
	}
	//爆弾を配置
	while (min_bomb_count <= max_bomb_count){
		bomb_line = Math.floor(Math.random () * 10) + 1;
		bomb_index = Math.floor(Math.random () * 10) + 1;
		if(bomb_line <= max_point_count && bomb_index <= max_point_count){
			if(exist_bomb[bomb_line][bomb_index] !== true){
				exist_bomb[bomb_line][bomb_index] = true;
				min_bomb_count++
			}
		}
	}
	//クリック位置を初期化
	for(var i = min_point_count; i <= max_point_count; i++){
		for(var j = min_point_count; j <= max_point_count; j++){
			is_clicked[i] = [];
			is_clicked[i][j] = false;
		}
	}
}

//隣に爆弾があるか確認
var checkBomb = function checkBomb(index_left, index_right, line_top, line_bottom) {
	//上隣
	if(line_top !== false){
		//下隣
		if(exist_bomb[line_top][field_index] === true){
			count_bomb += 1;
		}
	}
	//右斜上隣
	if(index_right !== false && line_top !== false){
		//右斜下隣
		if(exist_bomb[line_top][index_right] === true){
			count_bomb += 1;
		}
	}
	//右隣
	if(index_right !== false){
		if(exist_bomb[field_line][index_right] === true){
			count_bomb += 1;
		}
	}
	//右斜下隣
	if(index_right !== false && line_bottom !== false){
		//右斜下隣
		if(exist_bomb[line_bottom][index_right] === true){
			count_bomb += 1;
		}
	}
	//下隣
	if(line_bottom !== false){
		//下隣
		if(exist_bomb[line_bottom][field_index] === true){
			count_bomb += 1;
		}
	}
	//左斜下隣
	if(index_left !== false && line_bottom !== false){
		//右斜下隣
		if(exist_bomb[line_bottom][index_left] === true){
			count_bomb += 1;
		}
	}
	//左隣
	if(index_left !== false){
		if(exist_bomb[field_line][index_left] === true){
			count_bomb += 1;
		}
	}
	//右斜上隣
	if(index_left !== false && line_top !== false){
		//右斜下隣
		if(exist_bomb[line_top][index_left] === true){
			count_bomb += 1;
		}
	}		
	if(0 < count_bomb){
		$(".line" + field_line).find(".cell" + field_index).html(count_bomb);
	}else{
		//クリックしたマス
		$(".line" + field_line).find(".cell" + field_index).css("background-color","lime");
	}
	count_bomb = 0;
}

/*
 * 爆弾が置かれていない位置が残っているか判定
 * 残っていなければクリア
 */
var isGameClear = function isGameClear() {
	for(var i = min_point_count; i <= max_point_count; i++){
		for(var j = min_point_count; j <= max_point_count; j++){
			if(exist_bomb[i][j] !== true){
				if(is_clicked[i][j] !== true){
					count_is_not_clicked += 1;
				}
			}else{
				continue;
			}
		}
	}
	if(0 < count_is_not_clicked){
		is_game_clear = false;
	}else{
		is_game_clear = true;
	}
	count_is_not_clicked = 0;
	return is_game_clear;
}

/*
 * ゲームオーバー時に爆弾の位置をすべて表示する
 */
var openBomb = function openBomb(is_game_clear = null) {
	//フィールド 縦列
	for(var i = min_point_count; i <= max_point_count; i++){
		//フィールド 横列
		for(var j = 0; j <= max_point_count; j++){
			if(exist_bomb[i][j] !== true){
				continue;
			}else{
				if(is_game_clear !== true){
					$(".line" + i).find(".cell" + j).css("background-color","red");
				}else{
					$(".line" + i).find(".cell" + j).css("background-color","gray");
				}
			}
		}
	}
}

$(function(){
	//ゲームを最初からやり直す
	$(".restart_button").on("click", function(){
		$("#game_field").empty();
		createGameField();
	});
	//タグをクリックする処理
	$(document).on("click", "td", function(){
		//縦
		field_line = $(this).closest('tr').index();
		//横
		field_index = this.cellIndex;
		if(is_game_over !== true && is_game_clear !== true　&& is_clicked[field_line][field_index] !== true){
			//クリックされた場所を保存
			is_clicked[field_line][field_index] = true;
			//ゲームオーバー判定
			if(exist_bomb[field_line][field_index] === true){
				openBomb(false);
				//キーボード操作などにより、オーバーレイが多重起動するのを防止する
				$(this).blur();	//ボタンからフォーカスを外す
				if($("#modal-overlay")[0]) return false;　//新しくモーダルウィンドウを起動しない (防止策)

				//オーバーレイを出現させる
				$("body").append('<div id="modal-overlay"></div>');
				$("#modal-overlay").fadeIn("slow");

				//コンテンツをセンタリングする
				centeringModalSyncer(message_game_over) ;

				//コンテンツをフェードインする
				$("#game_over_message").fadeIn("slow");
				
				//[#game_over_message]と[#modal-overlay]をフェードアウトした後に…
				$("#game_over_message,#modal-overlay").delay(1000).fadeOut("slow", function(){
					//[#modal-overlay]を削除する
					$('#modal-overlay').delay(1000).remove();
				});
				is_game_over = true;
			}else{
				//左上角
				if(field_index === min_point_count && field_line === min_point_count){
					index_right = field_index + 1;
					line_bottom = field_line + 1;
					checkBomb(false, index_right, false, line_bottom);
				}
				//右上角
				if(field_index === max_point_count && field_line === min_point_count){
					index_left = field_index - 1;
					line_bottom = field_line + 1;
					checkBomb(index_left, false, false, line_bottom);
				}
				//左下角
				if(field_index === min_point_count && field_line === max_point_count){
					index_right = field_index + 1;
					line_top = field_line - 1;
					checkBomb(false, index_right, line_top, false);
				}
				//右下角
				if(field_index === max_point_count && field_line === max_point_count){
					index_left = field_index - 1;
					line_top = field_line - 1;
					checkBomb(index_left, false, line_top, false);
				}
				//最上段で角でない
				if(field_index > min_point_count && field_index < max_point_count && field_line === min_point_count){
					index_left = field_index - 1;
					index_right = field_index + 1;
					line_bottom = field_line + 1;
					checkBomb(index_left, index_right, false, line_bottom);
				}
				//右列で角でない
				if(field_line > min_point_count && field_line < max_point_count && field_index === max_point_count){
					index_left = field_index - 1;
					line_top = field_line - 1;
					line_bottom = field_line + 1;
					checkBomb(index_left, false, line_top, line_bottom);
				}
				//下列で角でない
				if(field_index > min_point_count && field_index < max_point_count && field_line === max_point_count){
					index_left = field_index - 1;
					index_right = field_index + 1;
					line_top = field_line - 1;
					checkBomb(index_left, index_right, line_top, false);
				}		
				//左列で角でない
				if(field_line > min_point_count && field_line < max_point_count && field_index === min_point_count){
					index_right = field_index + 1;
					line_top = field_line - 1;
					line_bottom = field_line + 1;
					checkBomb(false, index_right, line_top, line_bottom);
				}
				//角・端でない
				if((field_line > min_point_count && field_line < max_point_count) 
					&& (field_index > min_point_count && field_index < max_point_count)){
					index_left = field_index - 1;
					index_right = field_index + 1;
					line_top = field_line - 1;
					line_bottom = field_line + 1;
					checkBomb(index_left, index_right, line_top, line_bottom);
				}

				//ゲームクリア判定
				if(isGameClear()){
					openBomb(true);
					//キーボード操作などにより、オーバーレイが多重起動するのを防止する
					$(this).blur();	//ボタンからフォーカスを外す
					if($("#modal-overlay")[0]) return false;　//新しくモーダルウィンドウを起動しない (防止策)

					//オーバーレイを出現させる
					$("body").append('<div id="modal-overlay"></div>');
					$("#modal-overlay").fadeIn("slow");

					//コンテンツをセンタリングする
					centeringModalSyncer(message_cleared);

					//コンテンツをフェードインする
					$("#game_clear_message").fadeIn("slow");
					
					//[#game_clear_message]と[#modal-overlay]をフェードアウトした後に…
					$("#game_clear_message,#modal-overlay").delay(1000).fadeOut("slow", function(){
						//[#modal-overlay]を削除する
						$('#modal-overlay').delay(1000).remove();
					});
				}
			}
		}
	});

	//リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
	$(window).resize(centeringModalSyncer);

	//センタリングを実行する関数
	function centeringModalSyncer(modal_sort = null){
		if(modal_sort === message_cleared){
			//画面(ウィンドウ)の幅、高さを取得
			var w = $(window).width();
			var h = $(window).height();
			var cw = $("#game_clear_message").outerWidth();
			var ch = $("#game_clear_message").outerHeight();
			$("#game_clear_message").css({"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"});
		}else if(modal_sort === message_game_over){
			//画面(ウィンドウ)の幅、高さを取得
			var w = $(window).width();
			var h = $(window).height();
			var cw = $("#game_over_message").outerWidth();
			var ch = $("#game_over_message").outerHeight();
			//センタリングを実行する
			$("#game_over_message").css({"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"});
		}
	}
})