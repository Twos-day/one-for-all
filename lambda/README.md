## AWS 환경에 맞는 패키지 설치

### 1. Dockerfile 설치

```bash
npm run docker-build
```

### 2. 컨테이너 실행

```bash
npm run docker-run

exit
```

### 3. 컨테이너에서 node_modules폴더 로컬로 이동

```bash
mkdir nodejs #nodejs 파일 실행

npm run docker-cp #터미널 실행시 관리자 권한필요
```

### 4. node.js 폴더 zip으로 압축

```bash
zip -r nodejs
```
