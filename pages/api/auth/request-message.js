import Moralis from "moralis";

const config = {
  domain: process.env.APP_DOMAIN,
  statement: "Please sign this message to confirm your identity.",
  uri: process.env.NEXTAUTH_URL,
  timeout: 60,
  expirationTime: new Date("2023/07/16 22:55").toISOString(),
  notBefore: new Date("2022/07/16 22:54").toISOString(),
};

export default async function handler(req, res) {
  const { address, chain, network } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  try {
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      network,
      ...config,
    });

    console.log({ message })

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error });
    console.error(error);
  }
}
