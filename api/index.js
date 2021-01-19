export default async function handle(req, res) {
  res.json({ up: true, region: process.env.VERCEL_REGION })
}
