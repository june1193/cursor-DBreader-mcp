// Minimal MCP wrapper that proxies to the Spring DB Reader HTTP server
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const baseUrl = process.env.DBREADER_URL ?? "http://localhost:8080";

const server = new Server(
  { name: "dbreader-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Advertise available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "listTables",
        description: "현재 DB의 모든 테이블명을 배열로 반환합니다.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
      },
      {
        name: "getColumns",
        description: "특정 테이블의 컬럼 정보를 반환합니다.",
        inputSchema: {
          type: "object",
          properties: { table: { type: "string", minLength: 1 } },
          required: ["table"],
          additionalProperties: false,
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  if (name === "listTables") {
    const res = await fetch(`${baseUrl}/listTables`);
    if (!res.ok) {
      return { isError: true, content: [{ type: "text", text: `listTables failed: ${res.status} ${await res.text()}` }] };
    }
    const json = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(json) }] };
  }

  if (name === "getColumns") {
    const input = request.params.arguments ?? {};
    const table = typeof input.table === "string" ? input.table : "";
    if (!table) {
      return { isError: true, content: [{ type: "text", text: "'table' is required" }] };
    }
    const res = await fetch(`${baseUrl}/getColumns?table=${encodeURIComponent(table)}`);
    if (!res.ok) {
      return { isError: true, content: [{ type: "text", text: `getColumns failed: ${res.status} ${await res.text()}` }] };
    }
    const json = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(json) }] };
  }

  return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);





