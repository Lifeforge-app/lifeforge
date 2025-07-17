import Pocketbase from "pocketbase";

export function removeSensitiveData(userData: Record<string, any>): void {
  for (let key in userData) {
    if (key.includes("webauthn")) {
      delete userData[key];
    }
  }

  userData.hasMasterPassword = Boolean(userData.masterPasswordHash);
  userData.hasJournalMasterPassword = Boolean(
    userData.journalMasterPasswordHash,
  );
  userData.hasAPIKeysMasterPassword = Boolean(
    userData.APIKeysMasterPasswordHash,
  );
  userData.twoFAEnabled = Boolean(userData.twoFASecret);
  delete userData["masterPasswordHash"];
  delete userData["journalMasterPasswordHash"];
  delete userData["APIKeysMasterPasswordHash"];
  delete userData["twoFASecret"];
}

export async function updateNullData(
  userData: Record<string, any>,
  pb: Pocketbase,
) {
  if (!userData.enabledModules) {
    await pb.collection("users").update(userData.id, {
      enabledModules: [],
    });
    userData.enabledModules = [];
  }

  if (!userData.dashboardLayout) {
    await pb.collection("users").update(userData.id, {
      dashboardLayout: {},
    });
    userData.dashboardLayout = {};
  }
}
