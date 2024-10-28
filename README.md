# hululug-server

'후루룩' backend

## 폴더 구조

```
src/
├── auth/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   ├── guards/
│   └── pipes/
├── config/
├── database/
├── modules/
│   ├── user/
│   ├── post/
│   │   └── comment/
│   ├── tag/
│   └── event/
├── utils/
├── app.module.ts
└── main.ts
```

## NestJS 네이밍 규칙

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
