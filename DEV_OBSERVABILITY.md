# Vue Dev Observability & Deployment Notes

## 개요
- `docker-compose.yml`에 Promtail 및 NGINX Prometheus Exporter가 포함되어 Vue 개발 서버에서 메인 Loki/Prometheus로 바로 데이터를 보낼 수 있습니다.
- Jenkins `Jenkinsfile.dev` 파이프라인은 `dev` 브랜치 커밋 시 개발 서버에 자동 배포하고, 배포 이후 헬스체크/메트릭/로그 송신 여부를 확인합니다.

## 필수 환경 값
| 항목 | 비고 |
| --- | --- |
| `LOKI_ENDPOINT` | 메인 서버 Loki HTTP push URL. Jenkins 파이프라인 파라미터 또는 `docker-compose` 실행 시 환경변수로 전달 |
| `SPRING_API_BASE_URL` | Vue에서 호출할 Spring Dev 서버 주소 (`http://<host>:<port>`). Jenkins/`.env`로 주입 |
| `FLASK_API_BASE_URL` | Vue에서 호출할 Flask Dev 서버 주소. 필요 시만 설정 |

## Prometheus 스크랩 정보
- 엔드포인트: `http://<DEV_SERVER_HOST>:9113/metrics`
- 대상: `nginx/nginx-prometheus-exporter`
- 내부적으로 `http://vue-dev/status` stub_status에서 NGINX 메트릭을 수집

## Loki/Promtail 로그 흐름
1. NGINX 컨테이너가 `/var/log/nginx/*.log`에 접근/에러 로그를 남김 (볼륨 `vue_nginx_logs`)
2. `vue-promtail` 컨테이너가 동일 볼륨을 읽어 라벨(`job=vue-nginx`, `env=dev` 등)과 함께 Loki로 전송
3. Grafana에서 `env="dev"` 조건으로 필터링하여 지민님 Vue Dev 로그 확인 가능

## 헬스체크 & 라우팅
- `/healthz` : Jenkins 및 Docker healthcheck가 확인하는 엔드포인트 (`curl http://<DEV_HOST>:7001/healthz`)
- `/status` : NGINX stub_status. Prometheus exporter만 접근 가능하도록  허용.

## Jenkins 파이프라인 사용법
1. 멀티-브랜치 파이프라인 또는 파라미터화된 파이프라인에서 `Jenkinsfile.dev` 선택
2. 파라미터
   - `DEV_SERVER_HOST` : Vue 개발 서버 IP/호스트
   - `DEV_SERVER_USER` : SSH 사용자 (기본 `ubuntu`)
   - `LOKI_ENDPOINT` : 메인 Loki URL (예: `http://10.0.0.10:3100/loki/api/v1/push`)
   - `SPRING_API_BASE_URL` : Spring Dev API 엔드포인트 (예: `http://spring-dev.internal:7002`)
   - `FLASK_API_BASE_URL` : Flask Dev API 엔드포인트 (예: `http://flask-dev.internal:5000`)
3. Jenkins에 SSH 자격증명(`admin`) 등록 필요
4. 실행 흐름
   - dev 브랜치 체크아웃
   - 원격 서버 repo 동기화 → `docker-compose build` + `up -d`
   - `curl`로 헬스체크/메트릭 확인, Promtail 로그 tail 출력

## Prometheus 설정 메모
- 메인 서버 `prometheus.yml`에 다음 scrape config 추가
  ```yaml
  - job_name: 'vue-dev-nginx'
    scrape_interval: 15s
    static_configs:
      - targets: ['<DEV_SERVER_HOST>:9113']
        labels:
          service: 'vue-dev'
          env: 'dev'
  ```
- Grafana에서 `job="vue-dev-nginx"` 또는 `service="vue-dev"`로 필터하면 메인 서버에서 Vue Dev 지표 확인 가능

## 로컬/개발 환경 변수 주입 예시
```powershell
# Windows PowerShell
$env:SPRING_API_BASE_URL = "http://spring-dev.example.com:7002"
$env:FLASK_API_BASE_URL = "http://flask-dev.example.com:5000"
$env:LOKI_ENDPOINT = "http://13.124.109.82/loki/api/v1/push"
docker compose up -d
```

```bash
# Linux / macOS
SPRING_API_BASE_URL="http://spring-dev.example.com:7002" \
FLASK_API_BASE_URL="http://flask-dev.example.com:5000" \
LOKI_ENDPOINT="http://13.124.109.82/loki/api/v1/push" \
docker compose up -d
```

