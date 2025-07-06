# 📦 NestJS 모듈의 캡슐화와 exports
NestJS는 **모듈 단위로 캡슐화**된 구조를 가지고 있습니다.<br>
즉, 하나의 모듈 내부에 있는 서비스나 프로바이더, 컨트롤러는 **외부에서 바로 접근할 수 없습니다.**<br>
다른 모듈에서 사용하려면 반드시 **의도적으로 외부에 공개(export)** 해야 합니다.<br>

---

## ✅ 캡슐화란?
- 캡슐화는 **내부 구현을 숨기고 필요한 것만 외부에 노출**하는 개념압나다.<br>
- NestJS에서는 각 모듈이 하나의 **작은 캡슐**처럼 동작합니다.<br>
- 기본적으로 모듈 안에 있는 서비스, 프로바이더, 컨트롤러는 **외부에서 사용할 수 없습니다.**<br>

---

## ✅ exports가 필요한 이유
예를 들어 `UserService`가 `UserModule` 안에 있다고 할 때,<br>
다른 모듈(예: `AppModule`)에서 이 서비스를 사용하고 싶다면<br>
단순히 `UserModule`을 `imports`에 추가하는 것만으로는 부족해요.<br>
`UserService`를 **exports에 등록해야** 외부 모듈에서도 사용할 수 있습니다.<br>
```ts 
// user.module.ts
@Module({
  providers: [UserService],
  exports: [UserService], // 👈 외부 공개
})
export class UserModule {}
```
<br>
```ts 
// app.module.ts
@Module({
  imports: [UserModule], // 👈 이제 UserService를 사용할 수 있음
})
export class AppModule {}
```
