import nacl from "tweetnacl";
import bs58 from "bs58";

export function utf8Bytes(s: string) {
  return new TextEncoder().encode(s);
}

export function verifySolanaDetachedSignature(params: {
  message: string;         // exact JSON string the wallet signed
  signatureBase58: string; // base58 signature
  publicKeyBase58: string; // wallet address
}) {
  const msgBytes = utf8Bytes(params.message);
  const sigBytes = bs58.decode(params.signatureBase58);
  const pubBytes = bs58.decode(params.publicKeyBase58);
  return nacl.sign.detached.verify(msgBytes, sigBytes, pubBytes);
}
