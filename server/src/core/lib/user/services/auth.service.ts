import ClientError from "@functions/ClientError";
import moment from "moment";
import PocketBase from "pocketbase";
import { v4 } from "uuid";

import { currentSession } from "..";
import { removeSensitiveData, updateNullData } from "../utils/auth";

export const generateOTP = async (pb: PocketBase): Promise<string> =>
  (await pb.collection("users").requestOTP(pb.authStore.record?.email)).otpId;

export const login = async (
  email: string,
  password: string,
): Promise<
  | {
      state: "2fa_required";
      tid: string;
    }
  | { state: "success"; session: string; userData: Record<string, any> }
> => {
  const pb = new PocketBase(process.env.PB_HOST);

  let failed = false;

  await pb
    .collection("users")
    .authWithPassword(email, password)
    .catch(() => {
      failed = true;
    });

  if (pb.authStore.isValid && !failed) {
    const userData = pb.authStore.record;

    if (!userData) {
      throw new ClientError("Invalid credentials", 401);
    }

    removeSensitiveData(userData);

    if (userData.twoFAEnabled) {
      currentSession.token = pb.authStore.token;
      currentSession.tokenExpireAt = moment().add(5, "minutes").toISOString();
      currentSession.tokenId = v4();

      return {
        state: "2fa_required",
        tid: currentSession.tokenId,
      };
    }

    await updateNullData(userData, pb);

    return {
      state: "success",
      session: pb.authStore.token,
      userData,
    };
  } else {
    throw new ClientError("Invalid credentials", 401);
  }
};

export const verifySessionToken = async (
  bearerToken?: string,
): Promise<{
  session: string;
  userData: Record<string, any>;
}> => {
  const pb = new PocketBase(process.env.PB_HOST);

  if (!bearerToken) {
    throw new ClientError("No token provided", 401);
  }

  pb.authStore.save(bearerToken, null);
  await pb
    .collection("users")
    .authRefresh()
    .catch(() => {});

  if (!pb.authStore.isValid) {
    throw new ClientError("Invalid session", 401);
  }

  const userData = pb.authStore.record;

  if (!userData) {
    throw new ClientError("Invalid session", 401);
  }

  removeSensitiveData(userData);
  await updateNullData(userData, pb);

  return {
    session: pb.authStore.token,
    userData,
  };
};
