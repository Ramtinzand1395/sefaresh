import type { NextConfig } from "next";
import type { IncomingMessage, ServerResponse } from "node:http";
import helmet from "helmet";

type SecurityHeader = {
  key: string;
  value: string;
};

const isDevelopment = process.env.NODE_ENV === "development";

function getHelmetHeaders(): SecurityHeader[] {
  const headers = new Map<string, string>();
  const response = {
    setHeader(name: string, value: number | string | readonly string[]) {
      headers.set(
        name,
        Array.isArray(value) ? value.join(", ") : String(value),
      );

      return this;
    },
    removeHeader(name: string) {
      headers.delete(name);
    },
  } as unknown as ServerResponse;

  let helmetError: unknown;

  helmet({
    contentSecurityPolicy: {
      directives: {
        "connect-src": ["'self'", ...(isDevelopment ? ["ws:", "http:"] : [])],
        "img-src": ["'self'", "data:", "blob:"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          ...(isDevelopment ? ["'unsafe-eval'"] : []),
        ],
        "upgrade-insecure-requests": isDevelopment ? null : [],
      },
    },
    strictTransportSecurity: isDevelopment ? false : undefined,
  })(
    {} as IncomingMessage,
    response,
    (error) => {
      helmetError = error;
    },
  );

  if (helmetError) {
    throw helmetError;
  }

  return Array.from(headers, ([key, value]) => ({ key, value }));
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: getHelmetHeaders(),
      },
    ];
  },
};

export default nextConfig;
