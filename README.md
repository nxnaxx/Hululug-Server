# 🍜 후루룩 - 나만의 라면 레시피 공유 앱

</br>
<div align="center">
   <img width="160" src="https://github.com/user-attachments/assets/ed14a8fd-3df3-4dd6-a0ad-7008d80bf461" alt="후루룩 로고">
</div></br>
<div align="center">
  <p>후루룩은 <strong>라면을 좋아하는 모든 사람들을 위한 공간</strong>입니다.</p>
  <p>나만의 레시피를 공유하고 다른 사람들의 창의적인 레시피를 구경해보세요!</p>
</div>

## 목차

- [스크린샷](#스크린샷)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [코딩 컨벤션](#코딩-컨벤션)
  - [NestJS 네이밍 규칙](#nestjs-네이밍-규칙)
  - [커밋 메시지 규칙](#커밋-메시지-규칙)
  - [브랜치 전략](#브랜치-전략)
- [프로젝트 설치 및 실행](#프로젝트-설치-및-실행)
  - [설치](#설치)
  - [환경 변수 설정](#환경-변수-설정)
  - [실행](#실행)
- [팀원-소개](#팀원-소개)
- [프로젝트-관리](#프로젝트-관리)

</br>

## 스크린샷

<img src="https://github.com/user-attachments/assets/493e9bd1-a2cf-4562-8ec8-e35796219a68" alt="후루룩 로고"/>

</br></br>

## 주요 기능

🍜 **레시피 공유**</br>
자신만의 특별한 라면 레시피를 공유하기
</br>

💬 **커뮤니티 활동**</br>
다른 사용자와 댓글로 소통하고 피드백 주고받기
</br>

🧡 **좋아요 및 북마크**</br>
마음에 드는 레시피는 '좋아요'로 응원하고, 계속 보고 싶은 레시피는 북마크로 저장하기
</br>

🔍 **레시피 검색**</br>
라면 이름으로 원하는 레시피를 쉽게 찾기
</br>

🥇 **라면 월드컵**</br>
라면 이상형 월드컵으로 가장 좋아하는 라면을 선택하고 순위 확인하기
</br></br>

## 기술 스택

**BackEnd**

<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">

**Authentication**

JWT, OAuth

**Deployment and Cloud**

AWS S3, AWS CloudFront, Railway

**Code Quality Management**

ESLint, Prettier

</br>

## 프로젝트 구조

```
src/
├── @types/                   # 타입 정의
├── auth/                     # 인증 관련 모듈
├── common/
│   ├── decorators/           # 커스텀 데코레이터
│   ├── filters/              # 예외 필터
│   ├── interceptors/         # 인터셉터
│   ├── guards/               # 인증, 인가 가드
│   └── pipes/                # 파이프
├── config/                   # 환경 설정
├── database/                 # 데이터베이스 설정
├── modules/
│   ├── aws/                  # AWS 관련(S3) 모듈
│   ├── comments/             # 댓글 모듈
│   ├── events/               # 이벤트 모듈
│   ├── recipes/              # 레시피 모듈
│   ├── tags/                 # 태그 모듈
│   ├── users/                # 유저 모듈
├── utils/                    # 유틸리티 함수
├── app.module.ts
└── main.ts
```

## 코딩 컨벤션

### NestJS 네이밍 규칙

1. 파일명은 .으로 연결합니다. 모듈이 둘 이상의 단어로 구성되어 있으면 -(하이픈)으로 연결합니다.

2. 클래스명은 PascalCase를 사용합니다.

3. 같은 디렉터리에 있는 클래스는 index.ts를 통해 import하는 것을 권장합니다.

   ```tsx
   // user/index.ts
   export * from './user.service';
   export * from './user.controller';
   export * from './user.dto';

   // 다른 파일
   import { UserService, UserController, UserDto } from './user';
   ```

4. 인터페이스는 Series 인터페이스를 정의하고 하위 인터페이스/클래스를 만듭니다.
   ```tsx
   interface Series {}
   interface BookSeries extends Series {}
   class MovieSeries extends Series {}
   ```
   </br>

### 커밋 메시지 규칙

```
<type>(<scope>): <subject>

1. 커밋 메시지 제목은 영어, 50자 이내로 작성합니다.
2. 명령형, 현재 시제를 사용합니다.
3. 첫 글자를 대문자로 쓰지 않습니다. (feat: add ~)
4. 마침표(.) 및 특수 문자를 사용하지 않습니다.
```

| type     | 설명                   | type  | 설명                          |
| :------- | :--------------------- | :---- | :---------------------------- |
| feat     | 기능 구현              | perf  | 성능 개선                     |
| fix      | 버그 수정              | test  | 테스트 추가/수정              |
| docs     | 문서 작업              | chore | 기능, 버그와 관련 없는 잡일   |
| style    | 코드 스타일, 포맷 변경 | build | 빌드 시스템, 외부 종속성 변경 |
| refactor | 리팩터링               |

</br>

### 브랜치 전략

[branch]

- main: 프로덕션 배포
- develop: 개발 통합
- feature: 기능 개발
- hotfix: 긴급 버그 수정(배포 이후)

작업 전, ISSUE를 생성하고 github project에 추가합니다.</br>
기능별로 feature branch를 분기하여 작업합니다. 브랜치명은 기능명으로 짓습니다.</br>
작업이 완료되면 PR 생성 후, develop에 병합합니다. (PR 템플릿을 사용하여 작업 내용을 상세히 기술합니다)

</br>

## 프로젝트 설치 및 실행

### 설치

저장소 복제 후, 프로젝트 폴더로 이동하여 의존성을 설치합니다.

```bash
> git clone https://github.com/nxnaxx/hululug-server.git
> yarn install
```

### 환경 변수 설정

root directory에 `.env`파일을 생성하고 아래와 같이 작성합니다. \*는 필수값

```
PORT={포트 번호}
FRONTEND_URL={프론트엔드 URL}*
LOCAL_URL={프론트엔드 로컬 URL}
DATABASE_URL={MongoDB 데이터베이스 URL}*
JWT_SECRET={JWT 시크릿 키}*
KAKAO_REST_API_KEY={카카오 REST API 키}*
KAKAO_REDIRECT_URI={카카오 리디렉트 URI}*
AWS_S3_BUCKET_NAME={AWS S3 버킷명}*
AWS_S3_ACCESS_KEY={AWS S3 액세스 키}*
AWS_S3_SECRET_ACCESS_KEY={AWS S3 시크릿 액세스 키}*
AWS_REGION={AWS S3 버킷 리전}*
AWS_CLOUDFRONT={AWS CloudFront 도메인}*
```

### 실행

```bash
# 개발 모드로 실행
yarn start:dev

# 프로덕션 모드로 실행
yarn start:prod
```

</br>

## 팀원 소개

|                [김도연](https://github.com/nxnaxx)                 |                [윤석준](https://github.com/Pa55er)                 |                [김민석](https://github.com/se0kcess)                 |                [유성민](https://github.com/ysmuei)                 |
| :----------------------------------------------------------------: | :----------------------------------------------------------------: | :------------------------------------------------------------------: | :----------------------------------------------------------------: |
| <img src="https://github.com/nxnaxx.png" alt="김도연" width="150"> | <img src="https://github.com/Pa55er.png" alt="윤석준" width="150"> | <img src="https://github.com/se0kcess.png" alt="김민석" width="150"> | <img src="https://github.com/ysmuei.png" alt="유성민" width="150"> |
|                          Design, Backend                           |                              Backend                               |                               Frontend                               |                              Frontend                              |

</br>

## 프로젝트 관리

**기획서 및 디자인**

<a href="https://www.figma.com/design/8nDuzTlsqahg1VkcVcUmAq/3%EC%B0%A8_1%ED%8C%80_%ED%9B%84%EB%A3%A8%EB%A3%A9?node-id=0-1&t=oblsKi9YgrJqnoYs-1"><img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"></a>
<a href="https://docs.google.com/spreadsheets/d/12QLEggNgLdVe_FJCSRhtx_yub9eFzBtK1iBqvNvFWFM/edit?usp=sharing"><img src="https://img.shields.io/badge/wbs-525DDC?style=for-the-badge&logo=wbs&logoColor=white"></a>

**API 문서**

(추가 예정)

<a href=""><img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white"></a>
