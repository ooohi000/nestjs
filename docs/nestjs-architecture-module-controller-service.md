✅ NestJS 구조 정리 - 2025.07.06 (일)

[Client 요청]<br>
↓<br>
[Controller] → 요청 받음 (Route handler)<br>
↓<br>
[Service] → 핵심 비즈니스 로직 처리<br>
↓<br>
[Repository/DB/외부 API] → 실제 데이터 처리<br>
↑<br>
[Module] → 위 모든 것들을 등록하고 연결해줌<br><br>

✅ **각 요소 설명**<br><br>
📦 *Module*<br>
• Nest의 구성 단위이자 ‘상점’ 같은 곳.<br>
• Controller와 Service를 등록해서 Nest가 의존성을 주입할 수 있게 함.<br>
• 다른 모듈을 import해서 재사용 가능.<br>
```ts
@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
```
<br>

🧑‍💼 *Controller*<br>
• 말 그대로 요청(Request)의 입구.<br>
• 유저가 요청(예: /user/1)을 보냈을 때, 해당 요청을 처리할 메서드가 존재.<br>
• 비즈니스 로직은 하지 않음, 대부분은 Service에 위임함.<br>
```ts
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(id); // 서비스 호출
  }
}
```
<br>

🛠️ *Service*<br>
• 실제 로직이 들어가는 핵심.<br>
• 예를 들어 DB 조회, 계산, 검증, 외부 API 호출 등.<br>
• Controller는 Service를 불러만 주면 됨.<br>
```ts
@Injectable()
export class UserService {
  findOne(id: string) {
    return { id, name: '홍길동' };
  }
}
```