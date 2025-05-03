import { headers } from "next/headers";

export async function getIp() {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const cfConnectingIp = headersList.get("cf-connecting-ip");
    
    return forwardedFor?.split(',')[0].trim() || 
           realIp || 
           cfConnectingIp || 
           '127.0.0.1';
  } catch (error) {
    return "127.0.0.1";
  }
}