# 🔧 NestJS 미들웨어, 예외 필터, 파이프 정리

NestJS는 요청-응답 흐름을 구성할 때 다양한 단계에서 **전처리, 검증, 에러 처리** 등을 할 수 있도록  
**미들웨어(Middleware)**, **예외 필터(Exception Filter)**, **파이프(Pipe)** 같은 기능을 제공합니다.    

---

## ✅ 1. 미들웨어 (Middleware)

### 개념
- 요청(Request)이 컨트롤러에 도달하기 전에 실행되는 함수  
- Express 미들웨어와 거의 동일한 개념  
- 주로 로깅, 인증 처리, request 수정 등에 사용  

### 작동 흐름
```text
Client → Middleware → Controller → Service → Response
```

### 주요 특징
• @Module에서 전역 등록 가능  
• 특정 라우트에만 선택적으로 등록 가능  
• next()를 호출해야 다음 단계로 진행됨  

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.url}`);
    next(); // 다음으로 넘김
  }
}
```
```ts
@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // 모든 라우트에 적용
  }
}
```

## ✅ 2. 예외 필터 (Exception Filter)

### 개념
• NestJS의 에러 핸들링을 커스터마이징할 수 있는 기능  
• 예외 발생 시 응답 포맷을 통일하거나, 로깅, 트래킹에 유용  

### 주요 특징
• @Catch() 데코레이터로 특정 예외만 필터링 가능  
• @UseFilters()로 함수/컨트롤러 단위 적용 또는 app.useGlobalFilters()로 전역 등록 가능  
• Nest 기본 예외(HttpException)는 내부적으로 처리되지만 커스터마이징을 통해 더 많은 제어가 가능  

```ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof error === 'string' ? { error } : { ...error }),
    });
  }
}
```
```ts
// 전역 등록 (main.ts)
app.useGlobalFilters(new HttpExceptionFilter());
```

## 3. 파이프 (Pipe)

### 개념
• 요청 데이터의 변환 또는 유효성 검증에 사용되는 함수  
• param, query, body 등에 적용 가능  
• 예외 발생 시 자동으로 예외 필터 흐름으로 연결됨  

### 주요 기능
• 타입 변환 (예: 문자열 → 숫자)  
• DTO 검증 (class-validator와 함께 사용)  
• 커스텀 파이프도 작성 가능  

```ts
@Get(':id')
getCat(@Param('id', ParseIntPipe) id: number) {
  console.log(typeof id); // number
  return `Cat ID: ${id}`;
}
```