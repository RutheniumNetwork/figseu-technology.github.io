const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);

const canvas = $('#canvascontainer').append(renderer.domElement);
let distance = 4;
let started = false;
let percent = 0;
camera.position.set(0, 5, distance);
camera.rotation.x -= 0.75;
let scoreSubmitted = false;
let level = 1;
let star = 0;
let wave = 0;
let wave_t = 0;
let wave_th = 0;
let wave_f = 0;
let wave_fi = 0;
let wave_s = 0;
let wave_se = 0;
let userAgent = window.navigator.userAgent.toLowerCase();
wave = $.cookie('t_wave');
wave_t = $.cookie('t_wave_t');
wave_th = $.cookie('t_wave_th');
wave_f = $.cookie('t_wave_f');
wave_fi = $.cookie('t_wave_fi');
wave_s = $.cookie('t_wave_s');
wave_se = $.cookie('t_wave_se');
let url = location.href;
let fgnc = url.substr( 53 );
if (fgnc == 4) {
   level = 1;
} else if (fgnc == 5) {
   level = 2;
} else if (fgnc == 6) {
   level = 3;
} else if (fgnc == 19) {
   level = 4;
} else if (fgnc == 8) {
   level = 5;
} else if (fgnc == 60) {
   level = 6;
}
let data;
let reqId;
$.getJSON('two_levels.json', d => {
  data = d;
  loadLevel(level);
  $('#play').show();
  $('#play').click(start);
  $('#next').hide();
  $('#score').hide();
  $('#level-d').html('ボーナスステージ');
  $('#level').html('　');
  $('#stars').html('　');
  $('#Waves').html('☆ × ？');

  // ブラウザ判定

  if(userAgent.indexOf('msie') != -1 ||
     userAgent.indexOf('trident') != -1) {
     $('#play').hide();
     $('#next').hide();
     $('#score').hide();
     $('#level-d').html('E R R O R !');
     $('#level').html('お使いの ブラウザ または アプリ は対応していません');
     $('#stars').html('ERROR 000');
  } else if (userAgent.indexOf('edge') != -1 || userAgent.indexOf("edga") !== -1 || userAgent.indexOf("edgios") !== -1) {
     $('#level-d').html('⌥⌥データ取得中⌥⌥');
  } else if (userAgent.indexOf("ucbrowser") !== -1) {
     $('#play').hide();
     $('#next').hide();
     $('#score').hide();
     $('#level-d').html('E R R O R !');
     $('#level').html('お使いの ブラウザ または アプリ は対応していません');
     $('#stars').html('ERROR 404');
  } else if(userAgent.indexOf('chrome') != -1) {
     $('#level-d').html('⌥データ取得中⌥');
  } else if(userAgent.indexOf('safari') != -1) {
     $('#level-d').html('⌥データ取得中⌥');
  } else if(userAgent.indexOf('firefox') != -1) {
     $('#play').hide();
     $('#next').hide();
     $('#score').hide();
     $('#level-d').html('E R R O R !');
     $('#level').html('お使いの ブラウザ または アプリ は対応していません');
     $('#stars').html('ERROR 810');
  } else if(userAgent.indexOf('opera') != -1) {
     $('#play').hide();
     $('#next').hide();
     $('#score').hide();
     $('#level-d').html('E R R O R !');
     $('#level').html('お使いの ブラウザ または アプリ は対応していません');
     $('#stars').html('ERROR 721');
  } else {
     $('#play').hide();
     $('#next').hide();
     $('#score').hide();
     $('#level-d').html('E R R O R !');
     $('#level').html('お使いの ブラウザ または アプリ は対応していません');
     $('#stars').html('ERROR 666');
  }

  $('#level-d').html('ボーナス ステージ');
  reqId = requestAnimationFrame(render);
  console.clear();
  console.log(
    "最終ステージ - The END　～遊んでくれてありがとう～"
  );
});

//start function
function start(e) {
  e.preventDefault();
  if (!started) {
    started = true;
    ball.speed.z = -0.15;
    $('#main').fadeOut(300);
    $('#name').hide();
    if (userAgent.indexOf('edge') != -1 || userAgent.indexOf("edga") !== -1 || userAgent.indexOf("edgios") !== -1) {
    $('#jump').get(0).play();
    $('#gem').get(0).play();
    $('#speeddown').get(0).play();
    } else if (userAgent.indexOf('chrome') != -1) {
    $('#jump').get(0).play();
    $('#gem').get(0).play();
    $('#speeddown').get(0).play();
    } else if (userAgent.indexOf('safari') != -1) {
       
    }
    $('#jump').each(function(){
       this.pause(); // Stop playing
       this.currentTime = 0; // Reset time
    });
    $('#gem').each(function(){
       this.pause(); // Stop playing
       this.currentTime = 0; // Reset time
    });
    $('#speeddown').each(function(){
       this.pause(); // Stop playing
       this.currentTime = 0; // Reset time
    });
    if (typeof wave == 'undefined') {
        wave = 0;
        $.cookie('t_wave', wave, { expires: 30, domain:'figseu-technology.github.io'});
     }
     if (typeof wave_t == 'undefined') {
        wave_t = 0;
        $.cookie('t_wave_t', wave_t, { expires: 30, domain:'figseu-technology.github.io'});
     }
     if (typeof wave_th == 'undefined') {
        wave_th = 0;
        $.cookie('t_wave_th', wave_th, { expires: 30, domain:'figseu-technology.github.io'});
     }
     if (typeof wave_f == 'undefined') {
        wave_f = 0;
        $.cookie('t_wave_f', wave_f, { expires: 30, domain:'figseu-technology.github.io'});
     }
     if (typeof wave_fi == 'undefined') {
        wave_fi = 0;
        $.cookie('t_wave_fi', wave_fi, { expires: 30, domain:'figseu-technology.github.io'});
     }
     if (typeof wave_s == 'undefined') {
        wave_s = 0;
        $.cookie('t_wave_s', wave_s, { expires: 30, domain:'figseu-technology.github.io'});
     }
     if (typeof wave_se == 'undefined') {
        wave_se = 0;
        $.cookie('t_wave_se', wave_se, { expires: 30, domain:'figseu-technology.github.io'});
     }
    if (level == 1) {
        $('#kimetu').get(0).play();
        wave++;
            } else if (level == 2) {
            $('#touhou').get(0).play();
            wave_t++;
            } else if (level == 3) {
            $('#cloud').get(0).play();
            wave_th++;
            } else if (level == 4) {
            $('#piknik').get(0).play();
            wave_f++;
            } else if (level == 5) {
            $('#moon').get(0).play();
            wave_fi++;
            } else if (level == 6) {
            $('#last_battle').get(0).play();
            wave_s++;
            } else {
            $('#cloud').get(0).play();
            }
    reset();
    world.forEach(v => {
      if (v instanceof Bouncer) {
        v.mesh.position.y = 0;
      }
    });
    world.forEach(v => {
      if (v instanceof Downobstacle) {
        v.mesh.position.y = 0.4;
        v.line.position.y = 0.4;
      }
    });
    world.forEach(v => {
      if (v instanceof Upobstacle) {
        v.mesh.position.y = 0;
        v.line.position.y = 0;
      }
    });
    world.forEach(v => {
      if (v instanceof Mysterybox) {
        v.mesh.position.y = 1.1;
      }
    });
    world.forEach(v => {
      if (v instanceof Gem) {
        v.mesh.position.y = 1.1;
      }
    });
    world.forEach(v => {
      if (v instanceof Deltemat) {
        v.mesh.position.y = 0;
        v.line.position.y = 0;
      }
    });
    $('#main').css('pointer-events', 'none');
  }
}
function reset() {
  ball.landed = true;
  ball.tmpZ = 0;
  camera.position.set(0, 5, distance);
  ball.mesh.position.set(0, 0.6, 0);
  ball.speed.y = 0;
  ball.count2Lose = 0;
}

function nextLevel() {
  percent = 0;
  star = 0;
  while (
    (selectedObject = scene.getObjectByName('level component')) !== undefined
  ) {
    scene.remove(selectedObject);
  }
  world.length = 0;
  level++;
  loadLevel(level);
  reset();
  $('#score').hide();
  $('#level').show();
  $('#stars').show();
  $('#prev').show();
  $('#retry').hide();
  $('#play').show();
  $('#PresentCode').hide();
  if (level == 5) {
    $('#next').hide();
  }
  if (level == 1) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('霧の洞窟');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave'));
        } else if (level == 2) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('幻想郷');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_t'));
        } else if (level == 3) {
         $('#level-d').html('チュートリアルステージ');
         $('#level').html('Cloud');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_th'));
        } else if (level == 4) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('ピクニック');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_f'));
        } else if (level == 5) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('月下の舞');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_fi'));
        } else if (level == 6) {
         $('#level-d').html('Designed by 星空めたる');
         $('#level').html('■■■■ ■■■■■■');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_s'));
        } else {
            $('#level-d').html('開発中');
            $('#level').html('Level ' + level);
            $('#stars').html('');
           }
}

function prevLevel() {
  percent = 0;
  star = 0;
  while (
    (selectedObject = scene.getObjectByName('level component')) != undefined
  ) {
    scene.remove(selectedObject);
  }
  world.length = 0;
  level--;
  loadLevel(level);
  reset();
  $('#score').hide();
  $('#level').show();
  $('#stars').show();
  $('#next').show();
  $('#retry').hide();
  $('#play').show();
  $('#PresentCode').hide();
  if (level == 1) {
    $('#prev').hide();
  }
  if (level == 1) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('霧の洞窟');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave'));
        } else if (level == 2) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('幻想郷');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_t'));
        } else if (level == 3) {
         $('#level-d').html('チュートリアルステージ');
         $('#level').html('Cloud');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_th'));
        } else if (level == 4) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('ピクニック');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_f'));
        } else if (level == 5) {
         $('#level-d').html('ボーナスステージ');
         $('#level').html('月下の舞');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_fi'));
        } else if (level == 6) {
         $('#level-d').html('Designed by 星空めたる');
         $('#level').html('Last Battle');
         $('#stars').html('☆☆');
         $('#Waves').html('☆ × ' + $.cookie('t_wave_s'));
        } else {
            $('#level-d').html('開発中');
            $('#level').html('Level ' + level);
            $('#stars').html('');
           }
}

const light = new THREE.HemisphereLight(0xeeeeee, 0x777777);
scene.add(light);
const world = [];
function loadLevel(level) {
  const index = level - 1;
  renderer.setClearColor(parseInt(data[index].background));
  ball.mesh.material.color.setHex(parseInt(data[index].ball));
  scene.fog = new THREE.Fog(parseInt(data[index].background), 10, 30);
  for (var i in data[index].data) {
    for (var j in data[index].data[i]) {
      switch (data[index].data[i][j]) {
        case 1:
          world.push(new Mat(j - 2, -i, data[index].mat));
          break;
        case 2:
          world.push(new Bouncer(j - 2, -i, data[index].bouncer));
          break;
        case 3:
          world.push(new Obstacle(j - 2, -i, data[index].obstacle));
          break;
        case 4:
          world.push(new Obstacle(j - 2, -i, data[index].obstacle));
          world.push(new Dreamcube(j - 2, -i, data[index].obstacle));
          break;
        case 5:
          world.push(new Mat(j - 2, -i, data[index].mat));
          world.push(new Skyobstacle(j - 2, -i, data[index].obstacle));
          break;
        case 6:
          world.push(new Mat(j - 2, -i, data[index].mat));
          world.push(new Trskyobstacle(j - 2, -i, data[index].obstacle));
          break;
        case 7:
          world.push(new Mat(j - 2, -i, data[index].mat));
          world.push(new Mysterybox(j - 2, -i, data[index].bouncer));
          break;
        case 8:
          world.push(new Mat(j - 2, -i, data[index].mat));
          world.push(new Gem(j - 2, -i, data[index].bouncer));
          break;
        case 9:
          world.push(new Goal(j - 2, -i, data[index].obstacle));
          break;
        case 10:
          world.push(new Speedup(j - 2, -i, data[index].mat));
          break;
        case 11:
          world.push(new Speednormal(j - 2, -i, data[index].mat));
          break;
        case 12:
          world.push(new Speeddown(j - 2, -i, data[index].mat));
          break;
        case 13:
          world.push(new Back(j - 2, -i, data[index].mat));
          break;
        case 14:
          world.push(new Holemat(j - 2, -i, data[index].mat));
          world.push(new Hole(j - 2, -i, data[index].bouncer));
          break;
        case 15:
          world.push(new Fastbouncer(j - 2, -i, data[index].bouncer));
          break;
        case 16:
          world.push(new Highobstacle(j - 2, -i, data[index].obstacle));
          break;
        case 17:
          world.push(new Tower(j - 2, -i, data[index].obstacle));
          break;
        case 18:
          world.push(new Upobstacle(j - 2, -i, data[index].obstacle));
          break;
        case 19:
          world.push(new Downobstacle(j - 2, -i, data[index].mat));
          break;
        case 20:
          world.push(new Deltemat(j - 2, -i, data[index].mat));
          break;
        case 21:
          world.push(new Worpmat(j - 2, -i, data[index].mat));
      }
    }
  }
}

var ball = new Ball();

keystate = [];
//Loop function
function render() {
  renderer.render(scene, camera);
  ball.update();
  percent = Math.ceil(
    Math.abs(ball.mesh.position.z) / data[level - 1].data.length * 100
  );
  percent = percent > 100 ? 100 : percent;
  $('#percent').html(percent + '%');
  if (keystate[37]) ball.mesh.position.x -= 0.15;
  if (keystate[39]) ball.mesh.position.x += 0.15;
  reqId = requestAnimationFrame(render);
};

//controls

function gameover() {
  if (star == 1) {
     if (level == 1) {
     wave = 0;
     } else if (level == 2) {
     wave_t = 0;
     } else if (level == 3) {
     wave_th = 0;
     } else if (level == 4) {
     wave_f = 0;
     } else if (level == 5) {
     wave_fi = 0;
     } else if (level == 6) {
     wave_s = 0;
     } else if (level == 7) {
     wave_se = 0;
     }
  }
  $.cookie('t_wave', wave, { expires: 400, domain:'figseu-technology.github.io'});
  $.cookie('t_wave_t', wave_t, { expires: 400, domain:'figseu-technology.github.io'});
  $.cookie('t_wave_th', wave_th, { expires: 400, domain:'figseu-technology.github.io'});
  $.cookie('t_wave_f', wave_f, { expires: 400, domain:'figseu-technology.github.io'});
  $.cookie('t_wave_fi', wave_fi, { expires: 400, domain:'figseu-technology.github.io'});
  $.cookie('t_wave_s', wave_s, { expires: 400, domain:'figseu-technology.github.io'});
  $.cookie('t_wave_se', wave_se, { expires: 400, domain:'figseu-technology.github.io'});
  started = false;
  ball.speed.z = 0;
  $('#main').fadeIn(500);
  $('#retry').hide();
  $('#play').show();
  $('#play').click(start);
  $('#level').show();
  $('#stars').show();
  $('#score').show();
  $('#score').html($('#percent').html());
  $('#main').css('pointer-events', 'auto');
  if (level == 1) {
         $('#Waves').html('☆ × ' + $.cookie('t_wave'));
        if (star == 2) {
             $('#level-d').html('帰らずの洞穴');
      }
      $('#kimetu').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     } else if (level == 2) {
         $('#Waves').html('☆ × ' + $.cookie('t_wave_t'));
         if (star == 2) {
             $('#level-d').html('夢の世界が集う場所');
      }
      $('#touhou').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     } else if (level == 3) {
         $('#Waves').html('☆ × ' + $.cookie('t_wave_th'));
         if (star == 2) {
             $('#level-d').html('空に浮かぶ宮殿');
      }
      $('#cloud').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     } else if (level == 4) {
         $('#Waves').html('☆ × ' + $.cookie('t_wave_f'));
         if (star == 2) {
             $('#level-d').html('君に恋をした日');
      }
      $('#piknik').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     } else if (level == 5) {
         $('#Waves').html('☆ × ' + $.cookie('t_wave_fi'));
         if (star == 2) {
             $('#level-d').html('月の光に掲げる');
      }
      $('#moon').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     } else if (level == 6) {
         $('#Waves').html('☆ × ' + $.cookie('t_wave_s'));
         if (star == 2) {
             $('#level-d').html('正しき者に勝利あり');
      }
      $('#last_battle').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     } else {
      $('#cloud').each(function(){
    this.pause(); // Stop playing
    this.currentTime = 0; // Reset time
});
     }
}
