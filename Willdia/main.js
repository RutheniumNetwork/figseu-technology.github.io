(function() {
    'use strict';
    // 招待を受ける
    function enter(){
        var m = input_invidedURL.val().match(/\/([a-zA-Z0-9]+)\/?$/);
        if(!m) return alert("招待リンクが設定されていません");
        var url = "https://discord.com/api/v9/invites/" + m[1];
        splitLine(input_token.val()).map(function(v,i){
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', url );
            xhr.setRequestHeader( "authorization", v );
            xhr.setRequestHeader( "content-type", "application/json" );
            setTimeout(function(){
                xhr.send();
            },makeTime(i));
        });
    }
    // リアクション認証を突破する
    var xhr_func = {};
    ["PUT","DELETE"].forEach(function(method){
        xhr_func[method] = function(){
            var url = input_PUT_URL.val();
            if(!url) return alert("リクエストURLが設定されていません");
            splitLine(input_token.val()).map(function(v,i){
                var xhr = new XMLHttpRequest();
                xhr.open( method, url );
                xhr.setRequestHeader( "authorization", v );
                xhr.setRequestHeader( "content-type", "application/json" );
                setTimeout(function(){
                    xhr.send();
                },makeTime(i));
            });
        }
    });
    // サーバーから脱退
    function exit(){
        var m = input_url.val().match(/([0-9]+)\/([0-9]+)/);
        if(!m) return;
        var url = "https://discord.com/api/v9/users/@me/guilds/" + m[1];
        splitLine(input_token.val()).map(function(v,i){
            var xhr = new XMLHttpRequest();
            xhr.open( 'DELETE', url );
            xhr.setRequestHeader( "authorization", v );
            setTimeout(function(){
                xhr.send();
            },makeTime(i));
        });
    }
    // 入力中
    function typing(){
        splitLine(input_url.val()).map(function(str,o,a){
            var m = str.match(/([0-9]+)\/([0-9]+)/);
            if(!m) return;
            var room_id = m[2];
            var url = `https://discordapp.com/api/v9/channels/${room_id}/typing`;
            splitLine(input_token.val()).map(function(v,i){
                var xhr = new XMLHttpRequest();
                xhr.open( 'POST', url );
                xhr.setRequestHeader( "authorization", v );
                setTimeout(function(){
                    xhr.send();
                },makeTime(o,i,a.length));
            });
        });
    }
    // 発言
    function say(){
        splitLine(input_url.val()).map(function(str,o,a){
            var m = str.match(/([0-9]+)\/([0-9]+)/);
            if(!m) return;
            var room_id = m[2];
            var url = `https://discordapp.com/api/v9/channels/${room_id}/messages`;
            splitLine(input_token.val()).map(function(v,i){
                var data = {
                    content: input_saying.val() || (i+1) + "体目",
                    tts: false
                };
                if(random_flag()) data.content += String.fromCharCode(Math.random() * Math.pow(2,16));
                var xhr = new XMLHttpRequest();
                xhr.open( 'POST', url );
                xhr.setRequestHeader( "authorization", v );
                xhr.setRequestHeader( "content-type", "application/json" );
                setTimeout(function(){
                    xhr.send(JSON.stringify(data));
                },makeTime(o,i,a.length));
            });
        });
    }
    // DM
    function startDM(){
        btn_startDM.hide();
        btn_stopDM.show();
        var userID = input_userID.val(),
            onloaded = [];
        function getIDdm(token, callback){
            var data = {
                recipient_id: userID
            };
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', "https://canary.discordapp.com/api/v9/users/@me/channels" );
            xhr.setRequestHeader( "authorization", token );
            xhr.setRequestHeader( "content-type", "application/json" );
            xhr.onload = function (e) {
                onloaded.push(token);
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try{
                        callback(JSON.parse(xhr.responseText).id);
                    }
                    catch(err){
                        console.error("Error token : " + token);
                    }
                }
                else console.error("Error token : " + token);
            };
            xhr.send(JSON.stringify(data));
        }
        nowStatus.text("DMのidを取得中...");
        var id_list = {};
        var tokens = splitLine(input_token.val());
        tokens.map(function(v,i){
            g_interval_id.push(setTimeout(function(){
                getIDdm(v, function(id){
                    id_list[v] = id;
                });
            }, makeTime(i)));
        });
        function sendDM(token, id){
            var data = {
                content: input_saying_dm.val(),
                tts: false
            };
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', `https://canary.discordapp.com/api/v9/channels/${id}/messages` );
            xhr.setRequestHeader( "authorization", token );
            xhr.setRequestHeader( "content-type", "application/json" );
            xhr.send(JSON.stringify(data));
        }
        var interval_id = setInterval(function(){ // await
            if(onloaded.length === tokens.length) {
                clearInterval(interval_id);
                main();
            }
        },1000);
        g_interval_id.push(interval_id);
        function main(){
            nowStatus.text("DM送信中...");
            var max = Number(input_num_dm.val());
            makeArray(max).forEach(function(o){
                tokens.filter(function(token){
                    return id_list[token];
                }).map(function(v,i,a){
                    g_interval_id.push(setTimeout(function(){
                        sendDM(v,id_list[v]);
                        if(o === max - 1 && i === a.length - 1){
                            stopDM();
                            nowStatus.text("DMの送信が終了しました。");
                        }
                    },makeTime(i,o,a.length)));
                });
            });
        }
    }
    // stop DM
    function stopDM(){
        btn_startDM.show();
        btn_stopDM.hide();
        while(g_interval_id.length) clearInterval(g_interval_id.pop());
        nowStatus.text("DMの送信を中断しました。");
    }
    var g_avatar;
    // アバターの設定
    function set_avatar(){
        alert("設定するアバター画像を選択してください。");
        getBase64fromFile(function(avatar){
            g_avatar = avatar;
            $("<img>",{src: avatar}).appendTo(view_avatar_elm.empty());
        });
    }
    // プロフィールの更新
    function update_profile(){
        if(!g_avatar) return alert("アバターを設定してください。");
        splitLine(input_token.val()).map(function(v,i){
            var data = {
                //username: input_username.val(),
                //email: null,
                //password: input_pass.val(),
                avatar: g_avatar,
                //discriminator: null,
                //new_password: null
            };
            // if(input_pass_new.val()) data.new_password = input_pass_new.val();
            var xhr = new XMLHttpRequest();
            var url = "https://discordapp.com/api/v9/users/@me";
            xhr.open( 'PATCH', url );
            xhr.setRequestHeader( "authorization", v );
            xhr.setRequestHeader( "content-type", "application/json" );
            setTimeout(function(){
                xhr.send(JSON.stringify(data));
            },makeTime(i));
        });
    }
    // ファイルから画像を取得してBase64化
    function getBase64fromFile(callback){
        var input = document.createElement('input');
        input.type = "file";
        input.addEventListener('change', function(){
            if(!input.files.length) return;
            var file = input.files[0];
            var fr = new FileReader();
            fr.addEventListener('load', function(evt){
                callback(evt.target.result);
            });
            callback();
            fr.readAsDataURL(file);
        });
        input.click();
    }
    function addInput(title, placeholder){
        return $("<input>",{
            placeholder: placeholder
        }).appendTo($("<div>",{text: title + ' '}).appendTo(h));
    }
    function addBtn(title, func){
        return $("<button>",{text:title}).click(func).appendTo(h);
    }
    function addBtnToggle(title){
        var flag = false;
        var elm = addBtn(title,function(){
            flag = !flag;
            check.prop("checked", flag);
            setColor();
        });
        var check = $("<input>",{type:"checkbox"}).prependTo(elm);
        function setColor(){
            elm.css("background-color", flag ? "#FF000B" : "#760008");
        }
        setColor();
        return function(){
            return flag;
        }
    }
    function makeArray(num){ // 0からn-1までの連続した数値の配列を返す
        if(isNaN(num)) return [];
        var ar = [];
        for(var i = 0; i < num; i++) ar.push(i);
        return ar;
    }
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------
    var g_interval_id = [];
    var h = $("<div>").appendTo($("body").css({
        "text-align": "center"
    }));
    
    function addTextarea(placeholder){
        function shape(){
            var text = t.val();
            t.height((text.split('\n').length + 2) + "em");
        }
        var t = $("<textarea>", {
            placeholder: placeholder
        }).appendTo(h).keyup(shape).click(shape).css({
            width: "70%",
            height: "3em"
        });
        return t;
    }
    function splitLine(str){
        return str.split('\n').filter(function(v){
            return v;
        });
    }
    var input_token = addTextarea("Discord Token").change(function(){
        var ar = [];
        input_token.val(splitLine($(this).val()).filter(function(v){
            if(/[^0-9a-zA-Z\.\-_]/.test(v)) return false;
            if(v.length !== 59) return false;
            if(ar.indexOf(v) !== -1) return false;
            ar.push(v);
            return true;
        }).join('\n'));
    });
    var input_time = addInput("送信間隔","[秒]").attr({
        type: "number",
        value: 0.5,
        max: 5,
        min: 0.3,
        step: 0.1,
    });
    function makeTime(a, b = 0, len = 0){
        var n = Number(input_time.val());
        return (a + b * len) * n * 1000;
    }
    h.append("<br><br><br><br>");
    var input_invidedURL = addInput("招待リンク","https://discord.gg/XXXXXXX");
    h.append("<br>");
    addBtn("招待を受ける", enter);
    h.append("<br><br><br><br>");
    var input_PUT_URL = addInput("認証回避用リアクションURL ","https://discord.com/api/v9/channels/XXXXXXXXXXXXXXXXXXX/messages/XXXXXXXXXXXXXXXXXXX/reactions/%E2%9C%85/%40me");
    h.append("<br>");
    addBtn("PUT", xhr_func.PUT);
    addBtn("DELETE", xhr_func.DELETE);
    h.append("<br><br><br><br>");
    //---------------------------------------------------------------------------------
    var input_url = addTextarea("投稿するチャンネル (URL)");
    h.append("<br>");
    addBtn("入力中", typing);
    addBtn("サーバーから脱退", exit);
    h.append("<br><br><br><br>");
    //---------------------------------------------------------------------------------
    var input_saying = addTextarea("送信内容");
    h.append("<br>");
    addBtn("Submit", say);
    h.append("<br><br>");
    var random_flag = addBtnToggle("発言内容の語尾にランダムな文字を追加");
    h.append("<br><br><br><br>");
    //---------------------------------------------------------------------------------
    var input_userID = addInput("userID", "XXXXXXXXXXXXXXXXXX");
    var input_saying_dm = addTextarea("DMで送る内容を入力してください。");
    h.append("<br>");
    
    var input_num_dm = addInput("DMを送る回数").attr({
        type: "number",
        value: 1,
        max: 20,
        min: 1,
        step: 1,
    });
    
    var btn_startDM = addBtn("DM送信開始", startDM);
    var btn_stopDM = addBtn("DM送信停止", stopDM).hide();
    var nowStatus = $("<div>").appendTo(h);
    h.append("<br><br><br><br>");
    //---------------------------------------------------------------------------------
    var input_username = addInput("ユーザーネーム ");
    h.append("<br>");
    //var input_pass = addInput("現在のパスワード");
    // var input_pass_new = addInput("新しいパスワード(省略可)");
    addBtn("アバターの設定", set_avatar);
    h.append("<br><br>");
    var view_avatar_elm = $("<div>").appendTo(h);
    addBtn("プロフィールの更新", update_profile);
    h.append("<br><br>");
    //---------------------------------------------------------------------------------
})();
