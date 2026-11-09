export function skipPaywallFromEnv() {
  return (
    process.env.NEXT_PUBLIC_SKIP_PAYWALL === "1" ||
    process.env.SKIP_PAYWALL === "1"
  );
}

export function wantsSkipPaywall() {
  if (skipPaywallFromEnv()) return true;
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("reels") === "1";
}

export function allowSkipPaywall(request: Request) {
  if (skipPaywallFromEnv()) return true;
  const host = request.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}
