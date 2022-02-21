let strW = [
    '목마른 사람이 우물 판다', '물이 깊어야 고기가 모인다', '개구리 올챙이 적 생각 못 한다',
    '미운 자식 떡 하나 더 준다', '가랑잎이 솔잎더러 바스락거린다고 한다', '첫술에 배부를까',
    '소 잃고 외양간 고치기', '가루는 칠수록 고와지고, 말은 할수록 거칠어진다',
    '세 살 버릇 여든 간다', '우물 안 개구리', '비는 데는 무쇠도 녹는다', '어물전 망신은 꼴뚜기가 시킨다'
];

let strWords = [];
let score = 0;
let strText = [];
let strText_Next = [];
let count = 0;
let cnt = 0;
let last = 5;

let start_time; // 입력 시작 시간
let end_time;  // 입력 끝난 시간
let elapsedTime;  // 입력 끝난 시간 - 입력 시작 시간, // 딜레이 시간
let taja_count = 0;  // 입력한 타자수를 저장

let len = 0; // 입력한 글자수
let acc = 0; // 정확도 계산에 필요한 변수
let spd = 0; // 타자 속도
let current = 0; // 현재 위치
let time = 0; // 문장을 입력하는데 걸린 시간
let timer = 0; // 타이머가 작동 중인지 아닌지 확인하는 변수
let accuracy = 0; // 정확도 

let spdArr = []; // 타자 속도 배열
let accArr = []; //  정확도 배열
let avg_spd = 0; // 평균 타자 속도
let avg_acc = 0; // 평균 정확도

// const size = strWords.length / strWords[0].length;  // 배열에 저장된 행을 확인
const strInput = document.querySelector('.str-input');
const strDisplay = document.querySelector('.str-display');
const tajaDisplay = document.querySelector('.taja_speed');
const scoreDisplay = document.querySelector('.str_score');
const strNextDisplay = document.querySelector('.str-Next');
const accuracyDisplay = document.querySelector('.taja_accuracy');

init();

function init() {
    getStrWords();
    strInput.addEventListener('input', checkMatch);
    strInput.addEventListener('input', checkAccuracy);
}


/* 문장 불러오기 */
function getStrWords() {
    for(i=0; i<strW.length; i++)
        strWords[i] = strW[i];
}


/* 현재속도 측정 */
function Speed() {
    // 현재속도 (타수-백스페이스 *2) / 경과시간(초) * 60초
    // 한컴타자는 백스페이스 * +3
    time += 0.01;
    spd = Math.floor(acc*60*1.8/time); 
    tajaDisplay.innerText = spd;
}

function getStrWords() {
    for(i=0; i<strW.length; i++)
        strWords[i] = strW[i];

    for(i=0; i<5; i++) {
        k = 0;

        const randomIndex = Math.floor(Math.random() * strWords.length);
        strText[i] = strWords[randomIndex];
        // (아마도) 이전 문장과 겹치지 않게 하는 코드
        // let randomIndex = Math.floor(Math.random() * strWords.length);
        // while (i > 0 && strText[i-1] == strWords[randomIndex]) {
        //   randomIndex = Math.floor(Math.random() * strWords.length);
        // }
        // strText[i] = strWords[randomIndex];

        console.log("디스플레이:" + strText[i])
    }

    for(i=0; i<4; i++) {
        strText_Next[i] = strText[i + 1]
        console.log("다음문장:" + strText[i + 1])
    }
    strText_Next[4] = "다음 문장이 없습니다."
}

function gettext(strInput)
{
	let len = parseInt(strInput).length; //입력받은 글자수를 확인
	let onebyte = 0;
	let twobyte = 0;

	for (i=0; i<len; i++) //for문을 사용하여 카운트를 샘
	{
		if (strInput[i] < 0) twobyte++;  // 2바이트 한글
		else onebyte++;           // 1바이트 영문
	}

	return onebyte+(twobyte / 2);
}

function checkAccuracy() {
  var result = "";
  acc = 0;
  len = strInput.value.length;
  // 타이머 시작
  if(!timer) {
    if(window.event.isComposing) {
      setTimer = setInterval(Speed, 10);
      timer = 1;
    }
  }

 if(len > 1 && count > 0) {
   // 정확도 계산
    for(i=0; i<len; i++) {
      if(strInput.value.substring(i,i+1) == strText[current].substring(i, i+1)) {
        acc++;
      }
    }

    // 오타 표시
    for(i=0; i<strText[current].length; i++) {
      if(strInput.value.substring(i, i+1) != strText[current].substring(i, i+1)
      && i < len-1) {
        result += "<font color=#c85448>" + strText[current].substring(i,i+1) + "</font>";
      } else {
        result += strText[current].substring(i, i+1);
      }
    }

    // 정확도 출력
    accuracy = Math.floor(acc/len*100);
    accuracyDisplay.innerText = accuracy;

    // 오타 표시 출력
    strDisplay.innerHTML = result;

    // 정확도에 따라 글자색이 바뀌는 부분
    if(Math.floor(acc/len*100 == 100)) {
      accuracyDisplay.style.color = 'black';
    } else {
      accuracyDisplay.style.color = '#c85448';
    }

    // 글자 수가 0일 때 타이머, 타자 속도, 정확도 초기화
  } else if(len == 0 && count > 0) {
    if(timer) {
      clearInterval(setTimer);
      timer = 0;
    }
    time = 0;
    tajaDisplay.innerText = 0;
    accuracyDisplay.innerText = 0;
    strDisplay.innerHTML = strText[current];
  }
}

function tag(){
  let progress = document.querySelector('.progressTag')
  let interval = 1
  let updatesPerSecond = 1000 / 60
  let end = progress.max * (cnt/last)
  console.log(cnt);

  function animator () {
    progress.value = progress.value + interval
    if ( progress.value + interval < end){
      setTimeout(animator, updatesPerSecond);
    } else { 
      progress.value = end
    }
  }

  setTimeout(() => {
    animator()
  }, updatesPerSecond)
}

function checkMatch() {
    user = [strW];
    sum = 0;
    avg = 0;

    // 처음 화면에서 엔터를 눌렀을 때
    if(count == 0 && window.event.keyCode == 13) {
      strDisplay.innerText = strText[count];
      setTimeout(() => strInput.value = "", 20) // strInput.value = ""; // input 창 초기화
      score = score + 1;
      scoreDisplay.innerText = score;
      strNextDisplay.innerText = 'Next 문장:　' +  strText_Next[count];
      count++;
      strInput.readOnly = false;

      // tag()
    }
    // 주어진 문장의 길이보다 입력한 문장의 길이가 더 길 때 
    else if(len >= strText[current].length) {
        // 엔터를 누르면
        if(window.event.keyCode == 13) {
          strDisplay.innerText = strText[count];
          // 타이머 초기화
          if(timer) {
              clearInterval(setTimer);
              timer = 0;
          }
          // 현재 위치를 1 증가시키고 배열에 타자 속도와 정확도를 저장
          if(count != 0) {
            current++;
            spdArr[0] = 0;
            accArr[0] = 0;
            spdArr[current] = spd;
            accArr[current] = accuracy;
          }
          // 시간, 정확도 변수, 타자 속도, 정확도 초기화
          time = 0;
          acc = 0;
          spd = 0;
          accuracy = 0;

          if(count < 4) strNextDisplay.innerText = 'Next 문장:　' +  strText_Next[count];
          else strNextDisplay.innerText = strText_Next[count];

          // while(strInput.value.length === strDisplay.innerText.length) {
          //     taja_count = 0;

          //     timestamp = new Date().getTime();  // 현재 시간
          //     taja_count = gettext(user);

          //     time = elapsedTime - timestamp;

          //     if(taja_count == 0) break; //count가 0이면 정지

          //     n = parseFloat(60) / (time / 1000);
          //     tajaDisplay = parseInt(n) * taja_count;

          // }

          setTimeout(() => strInput.value = "", 20) // strInput.value = ""; // input 창 초기화
          score = score + 1;
          scoreDisplay.innerText = score;
          cnt++;

          tag()
          if(score === 6) {
              strInput.value = ""
              setTimeout(() => alert('타자 검사가 종료되었습니다.'), 20)
              strDisplay.innerText = "타자 검사가 종료되었습니다.";
              strNextDisplay.innerText = "";
              scoreDisplay.innerText = 5;

              for(k=1; k<6; k++) {
                avg_acc += accArr[k];
                avg_spd += spdArr[k];
              }
              if(avg_acc > 0) {
                avg_acc = Math.floor(avg_acc/5);
              } else {
                avg_acc = 0;
              }
              if(avg_spd > 0) {
                avg_spd = Math.floor(avg_spd/5);
              } else {
                avg_spd = 0;
              }
              tajaDisplay.innerText = "평균 " + avg_spd;
              accuracyDisplay.innerText = "평균 " + avg_acc;
              if(avg_acc == 100) {
                accuracyDisplay.style.color = 'black';
              } else {
                accuracyDisplay.style.color = '#c85448';
              }

              // 타자 검사가 종료되었으므로 입력창에 입력하지 못하도록 설정
              strInput.placeholder = "";
              strInput.disabled = true;
          }
          count++;
        }
    }
}
