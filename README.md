# 디지털 시계 with RSS 피드

Surface RT에 최적화된 디지털 시계 웹 애플리케이션입니다. Internet Explorer를 고려하여 설계되었습니다.

## 주요 기능

- 실시간 디지털 시계 (12시간제)
- 날짜 표시 (년도/월/일/요일)
- 기술 뉴스 RSS 피드 (10초마다 자동 순환)
- 전체화면 모드 지원
- Surface RT의 Internet Explorer 10 완벽 호환

## 기술 스택

- 순수 HTML5/CSS3/JavaScript (IE 호환)
- RSS 피드: IE 레거시 XML 파서 사용
- nginx:alpine 기반 경량 컨테이너
- Docker & Docker Compose

## 최적화 포인트

- IE 레거시 지원을 위한 JavaScript 최적화
  - ActiveXObject 사용으로 XML 파싱
  - 모던 JavaScript 문법 제외
- Surface RT의 ARM 프로세서 고려
  - 경량화된 애니메이션 처리
  - 최소한의 DOM 조작
- 터치스크린 지원
  - 터치 이벤트 최적화
  - 전체화면 버튼 터치 영역 확대

## 실행 방법

```bash
# 도커 컨테이너 실행
docker-compose up -d

# 접속 주소
http://localhost:8888
```

## 시스템 요구사항

- Surface RT
- Internet Explorer
- Docker & Docker Compose

## 주의사항

- Surface RT의 제한된 리소스를 고려하여 RSS 피드 갱신 주기를 5분으로 설정
