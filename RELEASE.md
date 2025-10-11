# Vue Frontend 배포 가이드

Vue.js 프론트엔드를 위한 Docker 기반 CI/CD 배포 가이드입니다.

## 📋 목차

- [개요](#개요)
- [배포 파일 구조](#배포-파일-구조)
- [연습 환경 설정 (개인 서버)](#연습-환경-설정-개인-서버)
- [배포 프로세스](#배포-프로세스)
- [실전 환경 전환 (팀 서버)](#실전-환경-전환-팀-서버)
- [로컬 테스트](#로컬-테스트)
- [트러블슈팅](#트러블슈팅)

---

## 개요

### 배포 전략

- **연습 환경**: `release` 브랜치 → 개인 서버
- **실전 환경**: `main` 브랜치 → 팀 서버 (나중에 전환)

### 기술 스택

- **Frontend**: Vue 3 + Vite + Vuetify
- **Container**: Docker + Nginx
- **CI/CD**: GitHub Actions + Jenkins
- **Port**: 7001 (컨테이너 내부)

---

## 배포 파일 구조

```
front/
├── Dockerfile              # Vue 빌드 + Nginx 서빙
├── nginx.conf              # 컨테이너 내부 Nginx 설정
├── .dockerignore           # Docker 빌드 최적화
├── Jenkinsfile            # Jenkins 배포 파이프라인
├── docker-compose.yml     # 로컬 테스트용
└── README.md              # 이 파일
```

---

## 연습 환경 설정 (개인 서버)

### 1. 사전 요구사항

- ✅ 개인 서버에 Docker 설치됨
- ✅ 개인 서버에 Jenkins 설치됨
- ✅ GitHub Repository 접근 권한

### 2. Jenkins 설정

#### 2.1 Docker 권한 부여

```bash
# Jenkins 사용자를 docker 그룹에 추가
sudo usermod -aG docker jenkins

# Jenkins 재시작
sudo systemctl restart jenkins

# 권한 확인
sudo -u jenkins docker ps
```

#### 2.2 Jenkins Job 생성

1. Jenkins 웹 UI 접속: `http://[개인서버IP]:8080`

2. **New Item** 클릭

3. 설정:
   - **Item name**: `healthyreal-vue-deployment-practice`
   - **Type**: Pipeline
   - **OK** 클릭

4. **Pipeline 설정**:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: GitHub 저장소 URL
   - **Credentials**: GitHub 인증 정보 추가 (Personal Access Token)
   - **Branch Specifier**: `*/release` ⚠️ **연습용**
   - **Script Path**: `front/Jenkinsfile` ⚠️ **중요**

5. **Build Triggers**:
   - ✓ `GitHub hook trigger for GITScm polling`

6. **저장** 클릭

#### 2.3 GitHub Credentials 추가

Jenkins 관리 → Credentials → Global → Add Credentials:

- **Kind**: Username with password
- **Username**: GitHub 아이디
- **Password**: GitHub Personal Access Token
  - Settings → Developer settings → Personal access tokens
  - Scopes: `repo`, `admin:repo_hook`
- **ID**: `github-credentials`
- **Description**: GitHub Access Token

### 3. GitHub Webhook 설정

1. GitHub Repository → **Settings** → **Webhooks**

2. **Add webhook** 클릭

3. 설정:
   - **Payload URL**: `http://[개인서버IP]:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Which events**: `Just the push event`
   - **Active**: ✓

4. **Add webhook** 클릭

5. **Recent Deliveries**에서 응답 확인 (200 OK)

### 4. Docker 네트워크 생성

```bash
docker network create healthyreal-network
```

---

## 배포 프로세스

### 자동 배포 흐름 (연습 환경)

```
개발자 작업
    ↓
develop 브랜치에 push
    ↓
GitHub Actions 자동 실행
    ↓
develop → release PR 자동 생성
    ↓
PR 리뷰 및 승인
    ↓
release 브랜치로 merge
    ↓
Jenkins (개인 서버) webhook 감지
    ↓
front/Jenkinsfile 실행
    ↓
Docker 이미지 빌드 (front/Dockerfile)
    ↓
기존 컨테이너 중지 및 제거
    ↓
새 컨테이너 실행 (7001 포트)
    ↓
헬스 체크 통과
    ↓
✅ 배포 완료
```

### 배포 실행

1. **develop 브랜치에 코드 push**
   ```bash
   git checkout develop
   git add .
   git commit -m "feat: 새 기능 추가"
   git push origin develop
   ```

2. **GitHub Actions가 자동으로 PR 생성**
   - PR 제목: `[Auto-Practice] Deploy from develop to release`
   - 변경사항 요약 자동 생성

3. **PR 리뷰 및 Merge**
   - 팀원이 PR 확인
   - 문제 없으면 `release` 브랜치로 merge

4. **Jenkins 자동 배포**
   - merge 감지 (약 1분 이내)
   - 빌드 자동 시작
   - 5-10분 소요

5. **배포 확인**
   ```bash
   # 컨테이너 상태 확인
   docker ps | grep healthyreal-vue
   
   # 로그 확인
   docker logs -f healthyreal-vue-container
   
   # 헬스 체크
   curl http://localhost:7001/health
   ```

### 수동 배포 (긴급 상황)

```bash
# 1. front 디렉토리로 이동
cd front

# 2. 이미지 빌드
docker build -t healthyreal-vue:manual .

# 3. 기존 컨테이너 중지 및 제거
docker stop healthyreal-vue-container
docker rm healthyreal-vue-container

# 4. 새 컨테이너 실행
docker run -d \
  --name healthyreal-vue-container \
  --network healthyreal-network \
  -p 7001:7001 \
  --restart unless-stopped \
  healthyreal-vue:manual

# 5. 로그 확인
docker logs -f healthyreal-vue-container
```

---

## 실전 환경 전환 (팀 서버)

연습이 끝나고 팀 서버로 전환할 때 수행하는 단계입니다.

### 1. 팀 서버 준비

```bash
# Docker 설치
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Jenkins 설치
# (Jenkins 공식 문서 참고)

# Jenkins 사용자 Docker 권한
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### 2. front/Jenkinsfile 수정

```groovy
// ===== 브랜치 설정 =====
// 연습용 (개인 서버 - 주석 처리)
// checkout scm

// 실전용 (팀 서버 - 주석 해제)
checkout([$class: 'GitSCM', 
    branches: [[name: '*/main']], 
    userRemoteConfigs: scm.userRemoteConfigs
])
```

### 3. .github/workflows/pr-automation.yml 수정

```yaml
# 연습용 (주석 처리)
# base: 'release'

# 실전용 (주석 해제)
base: 'main'
```

그리고 PR 생성 부분도 수정:

```javascript
// 연습용 (주석 처리)
// const { data: pulls } = await github.rest.pulls.list({
//   ...
//   base: 'release',
// });

// 실전용 (주석 해제)
const { data: pulls } = await github.rest.pulls.list({
  owner: context.repo.owner,
  repo: context.repo.repo,
  head: `${context.repo.owner}:develop`,
  base: 'main',
  state: 'open'
});
```

### 4. Jenkins Job 재설정 (팀 서버)

- **Job 이름**: `healthyreal-vue-deployment` (실전용)
- **Branch Specifier**: `*/main`
- **Script Path**: `front/Jenkinsfile`
- **Webhook URL**: 팀 서버 IP로 변경

### 5. 배포 테스트

```bash
# develop → main PR 생성 확인
# Jenkins 빌드 자동 실행 확인
# 컨테이너 정상 배포 확인
```

---

## 로컬 테스트

### Docker로 단독 실행

```bash
cd front

# 빌드
docker build -t healthyreal-vue:test .

# 실행
docker run -p 7001:7001 healthyreal-vue:test

# 브라우저 테스트
# http://localhost:7001
```

### Docker Compose로 실행

```bash
cd front

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 재빌드 및 실행
docker-compose up -d --build
```

### 로컬 개발 서버

```bash
cd front

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# http://localhost:3333
```

---

## 트러블슈팅

### 문제 1: 컨테이너가 시작되지 않음

**증상**: `docker ps`에 컨테이너가 보이지 않음

**해결**:
```bash
# 로그 확인
docker logs healthyreal-vue-container

# 포트 충돌 확인
sudo lsof -i :7001

# 네트워크 확인
docker network ls | grep healthyreal
```

### 문제 2: Jenkins 빌드 실패

**증상**: Jenkins 파이프라인이 실패

**해결**:
```bash
# Jenkins 사용자 Docker 권한 확인
sudo -u jenkins docker ps

# 권한 없으면 추가
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Jenkins Job 설정 확인
# - Script Path: front/Jenkinsfile
# - Branch: */release (연습용)
```

### 문제 3: GitHub Webhook 작동 안 함

**증상**: PR merge 해도 Jenkins 실행 안 됨

**해결**:
1. GitHub Webhook 상태 확인
   - Repository → Settings → Webhooks
   - Recent Deliveries 확인

2. Jenkins 설정 확인
   - Job → Configure → Build Triggers
   - "GitHub hook trigger" 체크 확인

3. 방화벽 확인
   ```bash
   # Jenkins 8080 포트 열림 확인
   sudo ufw status
   sudo ufw allow 8080
   ```

### 문제 4: 빌드 시간이 너무 오래 걸림

**해결**: `.dockerignore` 확인
```bash
# front/.dockerignore에 다음이 포함되어 있는지 확인
node_modules
.git
dist
```

### 문제 5: Script Path 오류

**증상**: `Jenkinsfile not found`

**해결**: Jenkins Job 설정에서 Script Path를 `front/Jenkinsfile`로 정확히 입력

---

## 유용한 명령어

### 컨테이너 관리

```bash
# 상태 확인
docker ps | grep healthyreal-vue

# 로그 확인 (실시간)
docker logs -f healthyreal-vue-container

# 로그 확인 (최근 100줄)
docker logs --tail 100 healthyreal-vue-container

# 컨테이너 접속
docker exec -it healthyreal-vue-container sh

# 컨테이너 중지
docker stop healthyreal-vue-container

# 컨테이너 재시작
docker restart healthyreal-vue-container
```

### Docker 정리

```bash
# 중지된 컨테이너 제거
docker container prune

# 사용하지 않는 이미지 제거
docker image prune -a

# 전체 정리 (주의!)
docker system prune -a
```

### 헬스 체크

```bash
# HTTP 헬스 체크
curl http://localhost:7001/health

# Docker 헬스 상태 확인
docker inspect --format='{{.State.Health.Status}}' healthyreal-vue-container
```

---

## 주의사항

1. **브랜치 관리**
   - 연습: `develop` → `release` → 개인 서버
   - 실전: `develop` → `main` → 팀 서버

2. **파일 위치**
   - 모든 Vue 배포 파일은 `front/` 디렉토리에만 존재
   - back, back-python은 팀원이 별도 관리

3. **Jenkins Script Path**
   - 반드시 `front/Jenkinsfile`로 설정
   - 루트의 Jenkinsfile이 아님!

4. **포트 충돌**
   - 7001 포트가 사용 중이면 배포 실패
   - 다른 프로세스가 사용하지 않는지 확인

5. **빌드 시간**
   - 첫 빌드: 10-15분 (의존성 다운로드)
   - 이후 빌드: 5-10분 (캐시 활용)

---

## 환경별 설정 요약

| 항목 | 연습 환경 (개인 서버) | 실전 환경 (팀 서버) |
|-----|---------------------|-------------------|
| 브랜치 | `release` | `main` |
| Jenkins Job | healthyreal-vue-deployment-practice | healthyreal-vue-deployment |
| Script Path | `front/Jenkinsfile` | `front/Jenkinsfile` |
| Branch Specifier | `*/release` | `*/main` |
| GitHub Actions | develop → release | develop → main |
| 서버 IP | 개인 서버 IP | 팀 서버 IP |

---

## 체크리스트

### 연습 환경 설정 완료 체크리스트

- [ ] Docker 설치 확인 (개인 서버)
- [ ] Jenkins 설치 확인 (개인 서버)
- [ ] Jenkins 사용자 Docker 권한 부여
- [ ] Jenkins Job 생성 (`*/release`, `front/Jenkinsfile`)
- [ ] GitHub Webhook 설정
- [ ] Docker 네트워크 생성
- [ ] 첫 배포 테스트 성공

### 배포 전 체크리스트

- [ ] develop 브랜치에서 로컬 테스트 완료
- [ ] Docker 빌드 로컬 테스트
- [ ] PR 생성 확인
- [ ] PR 리뷰 완료
- [ ] CI 통과

### 배포 후 체크리스트

- [ ] 컨테이너 정상 실행 확인
- [ ] 헬스 체크 통과
- [ ] 로그에 에러 없음
- [ ] 웹 페이지 접속 확인
- [ ] 주요 기능 동작 확인

---

## 추가 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Jenkins 공식 문서](https://www.jenkins.io/doc/)
- [Vue.js 공식 문서](https://vuejs.org/)
- [Vite 공식 문서](https://vitejs.dev/)

---

**버전**: 1.0.0  
**최종 업데이트**: 2024-10-10  
**담당**: zzmnxn
