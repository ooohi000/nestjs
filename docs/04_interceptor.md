# NestJS Interceptor 

## 인터셉터란?
Interceptor(인터셉터)는 NestJS에서 요청과 응답 흐름을 가로채서 중간에 원하는 작업을 할 수 있게 해주는 기능입니다.

```plaintext
Client  
  ↓
(요청 전)
Interceptor (pre-controller)
  ↓
Pipes → Controller → Service
  ↓
Interceptor (post-controller)
(응답 후)
  ↓
Client
```

## NestJS 요청 생명주기 (Request Lifecycle)
```plaintext
1. Incoming Request
2. Middleware (글로벌 → 모듈)
3. Guards (글로벌 → 컨트롤러 → 라우트)
4. Interceptors (요청 전 - pre-controller)
5. Pipes (글로벌 → 컨트롤러 → 라우트 → 파라미터)
6. Controller → Service
7. Interceptors (응답 후 - post-controller)
8. Exception Filters (라우트 → 컨트롤러 → 글로벌)
9. Server Response
```

## 인터셉터 기본 예제
```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('🔥 요청 전 인터셉터 실행');
    const now = Date.now();

    return next.handle().pipe(
      tap(() => console.log(`✅ 응답 후 인터셉터 실행: ${Date.now() - now}ms`)),
    );
  }
}
```
컨트롤러에 적용:
```ts
@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  @Get()
  getCats() {
    return ['야옹이', '고양이'];
  }
}
```

## tap() vs map() 차이
인터셉터에서 next.handle()은 RxJS Observable을 반환합니다.  
이 안에서 응답을 조작하거나 로깅하려면 tap, map을 사용합니다.
```ts
// tap: 응답을 그대로 두고 로그만 찍기
tap((data) => console.log(data))

// map: 응답을 변형해서 클라이언트에 전달
map((data) => ({ success: true, data }))
```

### tap()
- 응답 데이터를 읽기만 함 (가공 X)
- 로깅, 시간 측정 등 용도로 사용
```ts
return next.handle().pipe(
  tap((data) => console.log('응답:', data))
);
```

### map()
- 응답 데이터를 변형해서 클라이언트에게 전달
```ts
return next.handle().pipe(
  map((data) => ({
    success: true,
    data,
  }))
);
```