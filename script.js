// 구형 브라우저 지원을 위한 폴리필
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

// DOM 로드 완료 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // 요일 표시를 위한 배열
    var DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    // DOM 요소 참조
    var dateInfo = document.querySelector('.date-info');
    var meridiemDisplay = document.querySelector('.meridiem');
    var hoursDisplay = document.querySelector('.hours');
    var minutesDisplay = document.querySelector('.minutes');
    var secondsDisplay = document.querySelector('.seconds');
    var rssContent = document.querySelector('.rss-content');
    
    // 전체화면 기능
    var fullscreenBtn = document.querySelector('.fullscreen-btn');

    // RSS 피드 관련 변수
    var newsIndex = 0;
    var newsItems = [];
    var rssUrl = 'https://akngs.github.io/knews-rss/categories/tech.xml';

    // RSS 피드 가져오기
    function fetchRssFeed() {
        try {
            // IE용 XMLHTTP 객체 생성
            var xhr;
            if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } else {
                xhr = new XMLHttpRequest();
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        try {
                            // IE용 XML 파서
                            var xmlDoc;
                            if (window.ActiveXObject) {
                                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                xmlDoc.async = false;
                                xmlDoc.loadXML(xhr.responseText);
                            } else {
                                var parser = new DOMParser();
                                xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                            }

                            // item 태그 찾기
                            var items = xmlDoc.getElementsByTagName("item");
                            newsItems = [];

                            for (var i = 0; i < items.length && i < 10; i++) {
                                var item = items[i];
                                var title = item.getElementsByTagName("title")[0].childNodes[0].nodeValue;
                                var link = item.getElementsByTagName("link")[0].childNodes[0].nodeValue;
                                
                                newsItems.push({
                                    title: title.trim(),
                                    link: link.trim()
                                });
                            }

                            if (newsItems.length > 0) {
                                updateRssContent();
                            }
                        } catch (e) {
                            console.error("XML 파싱 오류:", e);
                        }
                    }
                }
            };

            xhr.open("GET", rssUrl, true);
            xhr.send();
        } catch (e) {
            console.error("XMLHTTP 오류:", e);
        }
    }

    // RSS 내용 업데이트
    function updateRssContent() {
        if (newsItems.length === 0) {
            rssContent.innerHTML = '뉴스를 불러오는 중입니다...';
            return;
        }

        try {
            var item = newsItems[newsIndex];
            rssContent.innerHTML = '<a href="' + item.link + '" target="_blank" style="color: inherit; text-decoration: none;">' + item.title + '</a>';
            newsIndex = (newsIndex + 1) % newsItems.length;
        } catch (error) {
            rssContent.innerHTML = '뉴스를 불러오는 중입니다...';
        }
    }

    // 초기 RSS 피드 로드
    fetchRssFeed();

    // 10초마다 RSS 내용 업데이트
    setInterval(updateRssContent, 10000);

    // 5분마다 RSS 피드 새로 가져오기
    setInterval(fetchRssFeed, 5 * 60 * 1000);

    // 숫자를 두 자리로 포맷팅하는 함수
    function formatNumber(number) {
        return String(number).padStart(2, '0');
    }

    // 시계 업데이트 함수
    function updateClock() {
        var now = new Date();
        
        // Time elements
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var meridiem = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        var displayHours = hours % 12 || 12;
        
        // Update time display
        meridiemDisplay.textContent = meridiem;
        hoursDisplay.textContent = formatNumber(displayHours);
        minutesDisplay.textContent = formatNumber(minutes);
        secondsDisplay.textContent = formatNumber(seconds);
        
        // Update date display
        var months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        var dateInfoText = now.getFullYear() + '년 ' + months[now.getMonth()] + ' ' + now.getDate() + '일 ' + DAYS[now.getDay()];
        dateInfo.textContent = dateInfoText;
    }

    // 초기 시계 업데이트
    updateClock();

    // 1초마다 시계 업데이트
    setInterval(updateClock, 1000);

    // 30분마다 페이지 새로고침
    setInterval(function() {
        window.location.reload();
    }, 30 * 60 * 1000);

    // Fullscreen functionality with fallbacks
    function toggleFullscreen() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // 이벤트 리스너 추가
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        fullscreenBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFullscreen();
            }
        });
    }
} 