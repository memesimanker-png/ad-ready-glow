const LINKVERTISE_USER_ID = 405401;

export function generateLinkvertiseUrl(targetUrl: string): string {
  const random = Math.random() * 1000;
  const base64Target = btoa(targetUrl);
  return `https://link-to.net/${LINKVERTISE_USER_ID}/${random}/dynamic?r=${base64Target}`;
}
