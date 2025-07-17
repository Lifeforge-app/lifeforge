import ClientError from "@functions/ClientError";
import { decrypt, decrypt2, encrypt, encrypt2 } from "@functions/encryption";
import moment from "moment";
import PocketBase from "pocketbase";
import speakeasy from "speakeasy";
import { v4 } from "uuid";

import { currentSession } from "..";
import { removeSensitiveData, updateNullData } from "../utils/auth";

export let challenge = v4();

setTimeout(
  () => {
    challenge = v4();
  },
  1000 * 60 * 5,
);

let tempCode = "";

export const getChallenge = () => challenge;

export const requestOTP = async (
  pb: PocketBase,
  email: string,
): Promise<string> => {
  const otp = await pb
    .collection("users")
    .requestOTP(email as string)
    .catch(() => null);

  if (!otp) {
    throw new Error("Failed to request OTP");
  }

  currentSession.tokenId = v4();
  currentSession.otpId = otp.otpId;
  currentSession.tokenExpireAt = moment().add(5, "minutes").toISOString();

  return currentSession.tokenId;
};

export const generateAuthenticatorLink = async (
  pb: PocketBase,
  bearerToken: string,
): Promise<string> => {
  const { email } = pb.authStore.record!;

  tempCode = speakeasy.generateSecret({
    name: email,
    length: 32,
    issuer: "Lifeforge.",
  }).base32;

  return encrypt2(
    encrypt2(
      `otpauth://totp/${email}?secret=${tempCode}&issuer=Lifeforge.`,
      challenge,
    ),
    bearerToken,
  );
};

export const verifyAndEnable2FA = async (
  pb: PocketBase,
  bearerToken: string,
  otp: string,
): Promise<void> => {
  const decryptedOTP = decrypt2(decrypt2(otp, bearerToken), challenge);

  const verified = speakeasy.totp.verify({
    secret: tempCode,
    encoding: "base32",
    token: decryptedOTP,
  });

  if (!verified) {
    throw new ClientError("Invalid OTP", 401);
  }

  await pb.collection("users").update(pb.authStore.record!.id, {
    twoFASecret: encrypt(
      Buffer.from(tempCode),
      process.env.MASTER_KEY!,
    ).toString("base64"),
  });
};

export const disable2FA = async (pb: PocketBase): Promise<void> => {
  await pb.collection("users").update(pb.authStore.record!.id, {
    twoFASecret: null,
  });
};

export const verifyAppOTP = async (
  pb: PocketBase,
  otp: string,
): Promise<boolean> => {
  const encryptedSecret = pb.authStore.record?.twoFASecret;

  if (!encryptedSecret) {
    return false;
  }

  const secret = decrypt(
    Buffer.from(encryptedSecret, "base64"),
    process.env.MASTER_KEY!,
  );

  const verified = speakeasy.totp.verify({
    secret: secret.toString(),
    encoding: "base32",
    token: otp,
  });

  if (!verified) {
    return false;
  }

  return true;
};

const verifyEmailOTP = async (
  pb: PocketBase,
  otp: string,
): Promise<boolean> => {
  if (!currentSession.otpId) {
    return false;
  }

  const authData = await pb
    .collection("users")
    .authWithOTP(currentSession.otpId, otp)
    .catch(() => null);

  if (!authData || !pb.authStore.isValid) {
    console.error("Invalid OTP");
    return false;
  }

  return true;
};

export const verify2FA = async (
  otp: string,
  tid: string,
  type: "email" | "app",
): Promise<{
  session: string;
  userData: Record<string, any>;
}> => {
  const pb = new PocketBase(process.env.PB_HOST);

  if (tid !== currentSession.tokenId) {
    throw new ClientError("Invalid token ID", 401);
  }

  if (moment().isAfter(moment(currentSession.tokenExpireAt))) {
    throw new ClientError("Token expired", 401);
  }

  const currentSessionToken = currentSession.token;

  if (!currentSessionToken) {
    throw new ClientError("No session token found", 401);
  }

  pb.authStore.save(currentSessionToken, null);
  await pb
    .collection("users")
    .authRefresh()
    .catch(() => {});

  if (!pb.authStore.isValid || !pb.authStore.record) {
    throw new ClientError("Invalid session", 401);
  }

  let verified = false;

  if (type === "app") {
    verified = await verifyAppOTP(pb, otp);
  } else if (type === "email") {
    verified = await verifyEmailOTP(pb, otp);
  }

  if (!verified) {
    throw new ClientError("Invalid OTP", 401);
  }

  const userData = pb.authStore.record;

  removeSensitiveData(userData);

  await updateNullData(userData, pb);

  return {
    session: pb.authStore.token,
    userData,
  };
};
