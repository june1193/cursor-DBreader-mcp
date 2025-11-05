Cursor가 MCP를 통해 DB Reader API 서버(Spring Boot)에 프록시 호출하여 DB 스키마를 읽을 수 있도록 하는 목적.

DB Reader API 깃 링크: []<br><br>


**신규 프로젝트에 적용하는 방법**

프로젝트 경로안에 .cursor\mcp.json 생성

<mcp.json>

```json
{
  "mcpServers": {
    "DB Reader": {
      "command": "node",
      "args": ["C:\\tools\\mcp\\server.mjs"],
      "env": {
        "DBREADER_URL": "http://localhost:8080"
      }
    }
  }
}
```

args는 현 레파지토리를 클론한 경로를 입력한다.<br>
DBREADER_URL에는 DB Reader API 서버의 포트를 입력한다(기본값은 8080포트)

실행 순서
1) DB Reader API 서버 실행
2) Cursor 재시작
3) Settings → Tools & MCP → DB Reader → Test connection
4) Connected 표시 확인<br><br><br>



***운영 및 배포 가이드***<br><br>
.cursor/ 폴더와 C:\tools\mcp는 개발 환경 전용이므로 배포 산출물에는 제외하는 것을 권장
