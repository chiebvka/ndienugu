import { headers } from "next/headers";

export async function getIp(): Promise<string> {
    try {
      const headersList = await headers();
      const forwardedFor = headersList.get("x-forwarded-for");
      const realIp = headersList.get("x-real-ip");
      const cfConnectingIp = headersList.get("cf-connecting-ip");
      
      if (forwardedFor) return forwardedFor.split(',')[0].trim();
      if (realIp) return realIp;
      if (cfConnectingIp) return cfConnectingIp;
      
      return '127.0.0.1';
    } catch (error) {
      console.warn("Error getting IP:", error);
      return "127.0.0.1";
    }
}

export async function rateLimitByIp(limit: number, window: number) {
    const ip = getIp();
    // return rateLimitByKey(`ip_${ip}`, limit, window);
}



  