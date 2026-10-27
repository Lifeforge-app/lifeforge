export type EndpointRoot_OutputOK = "Get ready to forge your life!";

export type EndpointLocalesListLanguages_OutputOK = {
  name: string;
  alternative?: string[];
  icon: string;
  displayName: string;
}[];

export type EndpointLocalesListUnsupportedModules_OutputOK = string[];

export type EndpointUserExists_OutputOK = boolean;

export type EndpointUserSettingsDeleteAvatar_OutputNO_CONTENT = void;

export type EndpointUserSettingsUpdatePassword_OutputNO_CONTENT = void;

export type EndpointUserSettingsUpdateProfile_OutputNO_CONTENT = void;

export type EndpointUserPersonalizationDeleteBgImage_OutputNO_CONTENT = void;

export type EndpointUserPersonalizationUpdatePersonalization_OutputNO_CONTENT = void;

export type EndpointFontsCustomList_OutputOK = {
  id: string;
  displayName: string;
  family: string;
  weight: number;
  created: string;
  updated: string;
  file: {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    thumbs: {
      size: string;
      key: string;
      width: number;
      height: number;
    }[];
  } | null;
}[];

export type EndpointFontsCustomRemove_OutputNO_CONTENT = void;

export type EndpointFontsPinsList_OutputOK = string[];

export type EndpointFontsPinsToggle_OutputNO_CONTENT = void;

export type EndpointApiKeysEntriesGet_OutputOK = string | null;

export type EndpointApiKeysEntriesList_OutputOK = {
  id: string;
  keyId: string;
  name: string;
  icon: string;
  key: string;
  exposable: boolean;
  created: string;
  updated: string;
}[];

export type EndpointApiKeysEntriesCheckKeys_OutputOK = boolean;

export type EndpointApiKeysEntriesRemove_OutputNO_CONTENT = void;

export type EndpointAuth_2FaDisable_OutputNO_CONTENT = void;

export type EndpointAuth_2FaEnable_OutputNO_CONTENT = void;

export type EndpointAuthLogin_OutputOK =
  | {
      accessToken: string;
    }
  | {
      state: "2fa_required";
      tid: string;
    };

export type EndpointAuthLogout_OutputOK = boolean;

export type EndpointAuthOauthVerify_OutputOK =
  | {
      accessToken: string;
    }
  | {
      state: "2fa_required";
      tid: string;
    };

export type EndpointAuthOauthProvidersListEnabled_OutputOK = {
  provider: string;
  icon: string;
  name: string;
}[];

export type EndpointAuthOauthProvidersListOptions_OutputOK = {
  id: string | null;
  provider: string;
  configured: boolean;
  enabled: boolean;
  icon: string;
  name: string;
  updated: string | null;
}[];

export type EndpointAuthOauthProvidersRemove_OutputNO_CONTENT = void;

export type EndpointAuthOauthProvidersToggle_OutputNO_CONTENT = void;

export type EndpointAuthOauthProvidersUpsert_OutputNO_CONTENT = void;

export type EndpointAuthQrLoginStatus_OutputOK =
  | {
      status: "pending";
      expiresAt: string;
    }
  | {
      status: "approved";
      accessToken: string;
    }
  | {
      status: "expired";
    }
  | {
      status: "not_found";
    };

export type EndpointLocationsSearch_OutputOK = {
  name: string;
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
}[];

export type EndpointModulesCheckModuleAvailability_OutputOK = boolean;

export type EndpointModulesList_OutputOK = {
  name: string;
  id: string;
  remoteId: string;
  displayName: string;
  version: string;
  description: string;
  author: string;
  icon: string;
  category: string;
}[];

export type EndpointModulesWidgets_OutputOK = {
  id: string;
  icon: string;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  moduleName: string;
  componentName: string;
}[];

export type EndpointModulesCategoriesAiTranslate_OutputOK = {
  [k: string]: string;
} | null;

export type EndpointAiImageGenerationGenerateImage_OutputOK = string;

export type EndpointPing_OutputOK = string;

export type EndpointEncryptionPublicKey_OutputOK = string;

export interface Contract {
  "": EndpointRoot;
  locales: {
    listLanguages: EndpointLocalesListLanguages;
    getLocale: EndpointLocalesGetLocale;
    listUnsupportedModules: EndpointLocalesListUnsupportedModules;
  };
  user: {
    exists: EndpointUserExists;
    auth: {
      createFirstUser: EndpointUserAuthCreateFirstUser;
    };
    me: EndpointUserMe;
    settings: {
      deleteAvatar: EndpointUserSettingsDeleteAvatar;
      updateAvatar: EndpointUserSettingsUpdateAvatar;
      updatePassword: EndpointUserSettingsUpdatePassword;
      updateProfile: EndpointUserSettingsUpdateProfile;
    };
    personalization: {
      deleteBgImage: EndpointUserPersonalizationDeleteBgImage;
      updateBgImage: EndpointUserPersonalizationUpdateBgImage;
      updatePersonalization: EndpointUserPersonalizationUpdatePersonalization;
    };
  };
  fonts: {
    google: {
      get: EndpointFontsGoogleGet;
      list: EndpointFontsGoogleList;
    };
    custom: {
      get: EndpointFontsCustomGet;
      list: EndpointFontsCustomList;
      remove: EndpointFontsCustomRemove;
      upload: EndpointFontsCustomUpload;
    };
    pins: {
      list: EndpointFontsPinsList;
      toggle: EndpointFontsPinsToggle;
    };
  };
  apiKeys: {
    entries: {
      get: EndpointApiKeysEntriesGet;
      list: EndpointApiKeysEntriesList;
      checkKeys: EndpointApiKeysEntriesCheckKeys;
      create: EndpointApiKeysEntriesCreate;
      update: EndpointApiKeysEntriesUpdate;
      remove: EndpointApiKeysEntriesRemove;
    };
  };
  auth: {
    "2fa": {
      disable: EndpointAuth_2FaDisable;
      enable: EndpointAuth_2FaEnable;
      generate: EndpointAuth_2FaGenerate;
      verify: EndpointAuth_2FaVerify;
    };
    login: EndpointAuthLogin;
    logout: EndpointAuthLogout;
    oauth: {
      authorize: EndpointAuthOauthAuthorize;
      verify: EndpointAuthOauthVerify;
      providers: {
        listEnabled: EndpointAuthOauthProvidersListEnabled;
        listOptions: EndpointAuthOauthProvidersListOptions;
        remove: EndpointAuthOauthProvidersRemove;
        toggle: EndpointAuthOauthProvidersToggle;
        upsert: EndpointAuthOauthProvidersUpsert;
      };
    };
    qrLogin: {
      approve: EndpointAuthQrLoginApprove;
      claim: EndpointAuthQrLoginClaim;
      register: EndpointAuthQrLoginRegister;
      status: EndpointAuthQrLoginStatus;
    };
    refresh: EndpointAuthRefresh;
  };
  pixabay: {
    searchImages: EndpointPixabaySearchImages;
  };
  locations: {
    search: EndpointLocationsSearch;
  };
  modules: {
    checkModuleAvailability: EndpointModulesCheckModuleAvailability;
    list: EndpointModulesList;
    manifest: EndpointModulesManifest;
    widgets: EndpointModulesWidgets;
    categories: {
      aiTranslate: EndpointModulesCategoriesAiTranslate;
      list: EndpointModulesCategoriesList;
      update: EndpointModulesCategoriesUpdate;
    };
  };
  ai: {
    imageGeneration: {
      generateImage: EndpointAiImageGenerationGenerateImage;
    };
  };
  files: {
    get: EndpointFilesGet;
  };
  ping: EndpointPing;
  status: EndpointStatus;
  corsAnywhere: EndpointCorsAnywhere;
  encryptionPublicKey: EndpointEncryptionPublicKey;
}

export interface EndpointRoot {
  method: "get";
  input: {};
  output: {
    OK: EndpointRoot_OutputOK;
  };
  media: null;
}

export interface EndpointLocalesListLanguages {
  method: "get";
  input: {};
  output: {
    OK: EndpointLocalesListLanguages_OutputOK;
  };
  media: null;
}

export interface EndpointLocalesGetLocale {
  method: "get";
  input: {
    query?: EndpointLocalesGetLocale_InputQuery;
  };
  output: {
    OK: EndpointLocalesGetLocale_OutputOK;
  };
  media: null;
}

export interface EndpointLocalesGetLocale_InputQuery {
  lang: string;
  namespace: "apps" | "common";
  subnamespace: string;
}

export interface EndpointLocalesGetLocale_OutputOK {
  [k: string]: unknown;
}

export interface EndpointLocalesListUnsupportedModules {
  method: "get";
  input: {};
  output: {
    OK: EndpointLocalesListUnsupportedModules_OutputOK;
  };
  media: null;
}

export interface EndpointUserExists {
  method: "get";
  input: {};
  output: {
    OK: EndpointUserExists_OutputOK;
  };
  media: null;
}

export interface EndpointUserAuthCreateFirstUser {
  method: "post";
  input: {
    body?: EndpointUserAuthCreateFirstUser_InputBody;
  };
  output: {
    CREATED: EndpointUserAuthCreateFirstUser_OutputCREATED;
  };
  media: null;
}

export interface EndpointUserAuthCreateFirstUser_InputBody {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface EndpointUserAuthCreateFirstUser_OutputCREATED {
  state: "success";
}

export interface EndpointUserMe {
  method: "get";
  input: {};
  output: {
    OK: EndpointUserMe_OutputOK;
  };
  media: null;
}

export interface EndpointUserMe_OutputOK {
  userData: {
    id: string;
    email: string;
    emailVisibility: boolean;
    verified: boolean;
    username: string;
    name: string | null;
    dateOfBirth: string | null;
    theme: "system" | "light" | "dark";
    color: string | null;
    bgTemp: string | null;
    backdropFilters:
      | (
          | (string | number | boolean | null)
          | {
              [k: string]: unknown;
            }
          | unknown[]
        )
      | null;
    fontFamily: string | null;
    dashboardLayout:
      | (
          | (string | number | boolean | null)
          | {
              [k: string]: unknown;
            }
          | unknown[]
        )
      | null;
    fontScale: number;
    borderRadiusMultiplier: number;
    bordered: boolean;
    language: string;
    avatar: {
      key: string;
      originalName: string;
      mimeType: string;
      size: number;
      thumbs: {
        size: string;
        key: string;
        width: number;
        height: number;
      }[];
    } | null;
    bgImage: {
      key: string;
      originalName: string;
      mimeType: string;
      size: number;
      thumbs: {
        size: string;
        key: string;
        width: number;
        height: number;
      }[];
    } | null;
    twoFAEnabled: boolean;
    hasAPIKeysMasterPassword: boolean;
  };
}

export interface EndpointUserSettingsDeleteAvatar {
  method: "post";
  input: {};
  output: {
    NO_CONTENT: EndpointUserSettingsDeleteAvatar_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointUserSettingsUpdateAvatar {
  method: "post";
  input: {};
  output: {
    OK: EndpointUserSettingsUpdateAvatar_OutputOK;
  };
  media: {file: {optional: false}};
}

export interface EndpointUserSettingsUpdateAvatar_OutputOK {
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  thumbs: {
    size: string;
    key: string;
    width: number;
    height: number;
  }[];
}

export interface EndpointUserSettingsUpdatePassword {
  method: "post";
  input: {
    body?: EndpointUserSettingsUpdatePassword_InputBody;
  };
  output: {
    NO_CONTENT: EndpointUserSettingsUpdatePassword_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointUserSettingsUpdatePassword_InputBody {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface EndpointUserSettingsUpdateProfile {
  method: "post";
  input: {
    body?: EndpointUserSettingsUpdateProfile_InputBody;
  };
  output: {
    NO_CONTENT: EndpointUserSettingsUpdateProfile_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointUserSettingsUpdateProfile_InputBody {
  data: {
    username?: string;
    email?: string;
    name?: string;
    dateOfBirth?: string;
  };
}

export interface EndpointUserPersonalizationDeleteBgImage {
  method: "post";
  input: {};
  output: {
    NO_CONTENT: EndpointUserPersonalizationDeleteBgImage_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointUserPersonalizationUpdateBgImage {
  method: "post";
  input: {};
  output: {
    OK: EndpointUserPersonalizationUpdateBgImage_OutputOK;
  };
  media: {file: {optional: false}};
}

export interface EndpointUserPersonalizationUpdateBgImage_OutputOK {
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  thumbs: {
    size: string;
    key: string;
    width: number;
    height: number;
  }[];
}

export interface EndpointUserPersonalizationUpdatePersonalization {
  method: "post";
  input: {
    body?: EndpointUserPersonalizationUpdatePersonalization_InputBody;
  };
  output: {
    NO_CONTENT: EndpointUserPersonalizationUpdatePersonalization_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointUserPersonalizationUpdatePersonalization_InputBody {
  data: {
    fontFamily?: string;
    theme?: string;
    color?: string;
    bgTemp?: string;
    language?: string;
    fontScale?: number;
    borderRadiusMultiplier?: number;
    bordered?: boolean;
    dashboardLayout?: {
      [k: string]: unknown;
    };
    backdropFilters?: {
      [k: string]: unknown;
    };
  };
}

export interface EndpointFontsGoogleGet {
  method: "get";
  input: {
    query?: EndpointFontsGoogleGet_InputQuery;
  };
  output: {
    OK: EndpointFontsGoogleGet_OutputOK;
  };
  media: null;
}

export interface EndpointFontsGoogleGet_InputQuery {
  family: string;
}

export interface EndpointFontsGoogleGet_OutputOK {
  enabled: boolean;
  items?: {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: {
      "100"?: string;
      "200"?: string;
      "300"?: string;
      "500"?: string;
      "600"?: string;
      "700"?: string;
      "800"?: string;
      "900"?: string;
      regular?: string;
      italic?: string;
      "100italic"?: string;
      "200italic"?: string;
      "300italic"?: string;
      "500italic"?: string;
      "600italic"?: string;
      "700italic"?: string;
      "800italic"?: string;
      "900italic"?: string;
    };
    category: "display" | "handwriting" | "monospace" | "sans-serif" | "serif";
    kind: "webfonts#webfont";
    menu: string;
    colorCapabilities?: ("COLRv0" | "COLRv1" | "SVG")[];
  }[];
}

export interface EndpointFontsGoogleList {
  method: "get";
  input: {};
  output: {
    OK: EndpointFontsGoogleList_OutputOK;
  };
  media: null;
}

export interface EndpointFontsGoogleList_OutputOK {
  enabled: boolean;
  items: {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: {
      "100"?: string;
      "200"?: string;
      "300"?: string;
      "500"?: string;
      "600"?: string;
      "700"?: string;
      "800"?: string;
      "900"?: string;
      regular?: string;
      italic?: string;
      "100italic"?: string;
      "200italic"?: string;
      "300italic"?: string;
      "500italic"?: string;
      "600italic"?: string;
      "700italic"?: string;
      "800italic"?: string;
      "900italic"?: string;
    };
    category: "display" | "handwriting" | "monospace" | "sans-serif" | "serif";
    kind: "webfonts#webfont";
    menu: string;
    colorCapabilities?: ("COLRv0" | "COLRv1" | "SVG")[];
  }[];
}

export interface EndpointFontsCustomGet {
  method: "get";
  input: {
    query?: EndpointFontsCustomGet_InputQuery;
  };
  output: {
    OK: EndpointFontsCustomGet_OutputOK;
  };
  media: null;
}

export interface EndpointFontsCustomGet_InputQuery {
  id: string;
}

export interface EndpointFontsCustomGet_OutputOK {
  id: string;
  displayName: string;
  family: string;
  weight: number;
  created: string;
  updated: string;
  file: {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    thumbs: {
      size: string;
      key: string;
      width: number;
      height: number;
    }[];
  } | null;
}

export interface EndpointFontsCustomList {
  method: "get";
  input: {};
  output: {
    OK: EndpointFontsCustomList_OutputOK;
  };
  media: null;
}

export interface EndpointFontsCustomRemove {
  method: "post";
  input: {
    query?: EndpointFontsCustomRemove_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointFontsCustomRemove_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointFontsCustomRemove_InputQuery {
  id: string;
}

export interface EndpointFontsCustomUpload {
  method: "post";
  input: {
    query?: EndpointFontsCustomUpload_InputQuery;
    body?: EndpointFontsCustomUpload_InputBody;
  };
  output: {
    OK: EndpointFontsCustomUpload_OutputOK;
  };
  media: {file: {optional: false}};
}

export interface EndpointFontsCustomUpload_InputQuery {
  id?: string;
}

export interface EndpointFontsCustomUpload_InputBody {
  displayName: string;
  family: string;
  weight: number;
}

export interface EndpointFontsCustomUpload_OutputOK {
  id: string;
  displayName: string;
  family: string;
  weight: number;
  created: string;
  updated: string;
  file: {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    thumbs: {
      size: string;
      key: string;
      width: number;
      height: number;
    }[];
  } | null;
}

export interface EndpointFontsPinsList {
  method: "get";
  input: {};
  output: {
    OK: EndpointFontsPinsList_OutputOK;
  };
  media: null;
}

export interface EndpointFontsPinsToggle {
  method: "post";
  input: {
    body?: EndpointFontsPinsToggle_InputBody;
  };
  output: {
    NO_CONTENT: EndpointFontsPinsToggle_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointFontsPinsToggle_InputBody {
  family: string;
}

export interface EndpointApiKeysEntriesGet {
  method: "get";
  input: {
    query?: EndpointApiKeysEntriesGet_InputQuery;
  };
  output: {
    OK: EndpointApiKeysEntriesGet_OutputOK;
  };
  media: null;
}

export interface EndpointApiKeysEntriesGet_InputQuery {
  keyId: string;
}

export interface EndpointApiKeysEntriesList {
  method: "get";
  input: {};
  output: {
    OK: EndpointApiKeysEntriesList_OutputOK;
  };
  media: null;
}

export interface EndpointApiKeysEntriesCheckKeys {
  method: "get";
  input: {
    query?: EndpointApiKeysEntriesCheckKeys_InputQuery;
  };
  output: {
    OK: EndpointApiKeysEntriesCheckKeys_OutputOK;
  };
  media: null;
}

export interface EndpointApiKeysEntriesCheckKeys_InputQuery {
  keys: string;
}

export interface EndpointApiKeysEntriesCreate {
  method: "post";
  input: {
    body?: EndpointApiKeysEntriesCreate_InputBody;
  };
  output: {
    CREATED: EndpointApiKeysEntriesCreate_OutputCREATED;
  };
  media: null;
}

export interface EndpointApiKeysEntriesCreate_InputBody {
  keyId: string;
  name: string;
  icon: string;
  key: string;
  exposable: boolean;
}

export interface EndpointApiKeysEntriesCreate_OutputCREATED {
  id: string;
  keyId: string;
  name: string;
  icon: string;
  key: string;
  exposable: boolean;
  created: string;
  updated: string;
}

export interface EndpointApiKeysEntriesUpdate {
  method: "post";
  input: {
    query?: EndpointApiKeysEntriesUpdate_InputQuery;
    body?: EndpointApiKeysEntriesUpdate_InputBody;
  };
  output: {
    OK: EndpointApiKeysEntriesUpdate_OutputOK;
  };
  media: null;
}

export interface EndpointApiKeysEntriesUpdate_InputQuery {
  id: string;
}

export interface EndpointApiKeysEntriesUpdate_InputBody {
  keyId: string;
  name: string;
  icon: string;
  key: string;
  exposable: boolean;
  overrideKey: boolean;
}

export interface EndpointApiKeysEntriesUpdate_OutputOK {
  id: string;
  keyId: string;
  name: string;
  icon: string;
  key: string;
  exposable: boolean;
  created: string;
  updated: string;
}

export interface EndpointApiKeysEntriesRemove {
  method: "post";
  input: {
    query?: EndpointApiKeysEntriesRemove_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointApiKeysEntriesRemove_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointApiKeysEntriesRemove_InputQuery {
  id: string;
}

export interface EndpointAuth_2FaDisable {
  method: "post";
  input: {};
  output: {
    NO_CONTENT: EndpointAuth_2FaDisable_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointAuth_2FaEnable {
  method: "post";
  input: {
    body?: EndpointAuth_2FaEnable_InputBody;
  };
  output: {
    NO_CONTENT: EndpointAuth_2FaEnable_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointAuth_2FaEnable_InputBody {
  otp: string;
  tid: string;
}

export interface EndpointAuth_2FaGenerate {
  method: "post";
  input: {};
  output: {
    OK: EndpointAuth_2FaGenerate_OutputOK;
  };
  media: null;
}

export interface EndpointAuth_2FaGenerate_OutputOK {
  tid: string;
  link: string;
}

export interface EndpointAuth_2FaVerify {
  method: "post";
  input: {
    body?: EndpointAuth_2FaVerify_InputBody;
  };
  output: {
    OK: EndpointAuth_2FaVerify_OutputOK;
  };
  media: null;
}

export interface EndpointAuth_2FaVerify_InputBody {
  otp: string;
  tid: string;
}

export interface EndpointAuth_2FaVerify_OutputOK {
  accessToken: string;
}

export interface EndpointAuthLogin {
  method: "post";
  input: {
    body?: EndpointAuthLogin_InputBody;
  };
  output: {
    OK: EndpointAuthLogin_OutputOK;
  };
  media: null;
}

export interface EndpointAuthLogin_InputBody {
  emailOrUsername: string;
  password: string;
}

export interface EndpointAuthLogout {
  method: "post";
  input: {};
  output: {
    OK: EndpointAuthLogout_OutputOK;
  };
  media: null;
}

export interface EndpointAuthOauthAuthorize {
  method: "get";
  input: {
    query?: EndpointAuthOauthAuthorize_InputQuery;
  };
  output: {
    OK: EndpointAuthOauthAuthorize_OutputOK;
  };
  media: null;
}

export interface EndpointAuthOauthAuthorize_InputQuery {
  provider: string;
}

export interface EndpointAuthOauthAuthorize_OutputOK {
  url: string;
  state: string;
}

export interface EndpointAuthOauthVerify {
  method: "post";
  input: {
    body?: EndpointAuthOauthVerify_InputBody;
  };
  output: {
    OK: EndpointAuthOauthVerify_OutputOK;
  };
  media: null;
}

export interface EndpointAuthOauthVerify_InputBody {
  provider: string;
  code: string;
  state: string;
}

export interface EndpointAuthOauthProvidersListEnabled {
  method: "get";
  input: {};
  output: {
    OK: EndpointAuthOauthProvidersListEnabled_OutputOK;
  };
  media: null;
}

export interface EndpointAuthOauthProvidersListOptions {
  method: "get";
  input: {};
  output: {
    OK: EndpointAuthOauthProvidersListOptions_OutputOK;
  };
  media: null;
}

export interface EndpointAuthOauthProvidersRemove {
  method: "post";
  input: {
    query?: EndpointAuthOauthProvidersRemove_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointAuthOauthProvidersRemove_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointAuthOauthProvidersRemove_InputQuery {
  id: string;
}

export interface EndpointAuthOauthProvidersToggle {
  method: "post";
  input: {
    query?: EndpointAuthOauthProvidersToggle_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointAuthOauthProvidersToggle_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointAuthOauthProvidersToggle_InputQuery {
  id: string;
}

export interface EndpointAuthOauthProvidersUpsert {
  method: "post";
  input: {
    query?: EndpointAuthOauthProvidersUpsert_InputQuery;
    body?: EndpointAuthOauthProvidersUpsert_InputBody;
  };
  output: {
    NO_CONTENT: EndpointAuthOauthProvidersUpsert_OutputNO_CONTENT;
  };
  media: null;
}

export interface EndpointAuthOauthProvidersUpsert_InputQuery {
  provider: string;
}

export interface EndpointAuthOauthProvidersUpsert_InputBody {
  clientId: string;
  clientSecret: string;
}

export interface EndpointAuthQrLoginApprove {
  method: "post";
  input: {
    body?: EndpointAuthQrLoginApprove_InputBody;
  };
  output: {
    OK: EndpointAuthQrLoginApprove_OutputOK;
  };
  media: null;
}

export interface EndpointAuthQrLoginApprove_InputBody {
  sessionId: string;
}

export interface EndpointAuthQrLoginApprove_OutputOK {
  browserInfo: string;
}

export interface EndpointAuthQrLoginClaim {
  method: "post";
  input: {
    body?: EndpointAuthQrLoginClaim_InputBody;
  };
  output: {
    OK: EndpointAuthQrLoginClaim_OutputOK;
  };
  media: null;
}

export interface EndpointAuthQrLoginClaim_InputBody {
  sessionId: string;
}

export interface EndpointAuthQrLoginClaim_OutputOK {
  accessToken: string;
}

export interface EndpointAuthQrLoginRegister {
  method: "post";
  input: {
    body?: EndpointAuthQrLoginRegister_InputBody;
  };
  output: {
    CREATED: EndpointAuthQrLoginRegister_OutputCREATED;
  };
  media: null;
}

export interface EndpointAuthQrLoginRegister_InputBody {
  browserInfo: string;
}

export interface EndpointAuthQrLoginRegister_OutputCREATED {
  sessionId: string;
  expiresAt: string;
}

export interface EndpointAuthQrLoginStatus {
  method: "get";
  input: {
    query?: EndpointAuthQrLoginStatus_InputQuery;
  };
  output: {
    OK: EndpointAuthQrLoginStatus_OutputOK;
  };
  media: null;
}

export interface EndpointAuthQrLoginStatus_InputQuery {
  sessionId: string;
}

export interface EndpointAuthRefresh {
  method: "post";
  input: {};
  output: {
    OK: EndpointAuthRefresh_OutputOK;
  };
  media: null;
}

export interface EndpointAuthRefresh_OutputOK {
  accessToken: string;
}

export interface EndpointPixabaySearchImages {
  method: "get";
  input: {
    query?: EndpointPixabaySearchImages_InputQuery;
  };
  output: {
    OK: EndpointPixabaySearchImages_OutputOK;
  };
  media: null;
}

export interface EndpointPixabaySearchImages_InputQuery {
  q: string;
  page: string;
  type: "all" | "photo" | "illustration" | "vector";
  category?:
    | "backgrounds"
    | "fashion"
    | "nature"
    | "science"
    | "education"
    | "feelings"
    | "health"
    | "people"
    | "religion"
    | "places"
    | "animals"
    | "industry"
    | "computer"
    | "food"
    | "sports"
    | "transportation"
    | "travel"
    | "buildings"
    | "business"
    | "music";
  colors?:
    | (
        | "grayscale"
        | "transparent"
        | "red"
        | "orange"
        | "yellow"
        | "green"
        | "turquoise"
        | "blue"
        | "lilac"
        | "pink"
        | "white"
        | "gray"
        | "black"
        | "brown"
      )
    | null;
  editors_choice: "true" | "false";
}

export interface EndpointPixabaySearchImages_OutputOK {
  total: number;
  hits: {
    id: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    imageURL: string;
  }[];
}

export interface EndpointLocationsSearch {
  method: "get";
  input: {
    query?: EndpointLocationsSearch_InputQuery;
  };
  output: {
    OK: EndpointLocationsSearch_OutputOK;
  };
  media: null;
}

export interface EndpointLocationsSearch_InputQuery {
  q: string;
}

export interface EndpointModulesCheckModuleAvailability {
  method: "get";
  input: {
    query?: EndpointModulesCheckModuleAvailability_InputQuery;
  };
  output: {
    OK: EndpointModulesCheckModuleAvailability_OutputOK;
  };
  media: null;
}

export interface EndpointModulesCheckModuleAvailability_InputQuery {
  id: string;
}

export interface EndpointModulesList {
  method: "get";
  input: {};
  output: {
    OK: EndpointModulesList_OutputOK;
  };
  media: null;
}

export interface EndpointModulesManifest {
  method: "get";
  input: {};
  output: {
    OK: EndpointModulesManifest_OutputOK;
  };
  media: null;
}

export interface EndpointModulesManifest_OutputOK {
  modules: {
    name: string;
    id: string;
    remoteId: string;
    displayName: string;
    icon: string;
    category: string;
    remoteEntryUrl: string;
    APIKeyAccess?: {
      [k: string]: {
        usage: string;
        required: boolean;
      };
    };
    hasProvider: boolean;
    hidden?: boolean;
    subsection?: {
      label: string;
      icon: string;
      path: string;
    }[];
  }[];
}

export interface EndpointModulesWidgets {
  method: "get";
  input: {};
  output: {
    OK: EndpointModulesWidgets_OutputOK;
  };
  media: null;
}

export interface EndpointModulesCategoriesAiTranslate {
  method: "post";
  input: {
    body?: EndpointModulesCategoriesAiTranslate_InputBody;
  };
  output: {
    OK: EndpointModulesCategoriesAiTranslate_OutputOK;
  };
  media: null;
}

export interface EndpointModulesCategoriesAiTranslate_InputBody {
  key: string;
  languages: string[];
}

export interface EndpointModulesCategoriesList {
  method: "get";
  input: {};
  output: {
    OK: EndpointModulesCategoriesList_OutputOK;
  };
  media: null;
}

export interface EndpointModulesCategoriesList_OutputOK {
  [k: string]: {
    [k: string]: string;
  };
}

export interface EndpointModulesCategoriesUpdate {
  method: "post";
  input: {
    body?: EndpointModulesCategoriesUpdate_InputBody;
  };
  output: {
    OK: EndpointModulesCategoriesUpdate_OutputOK;
  };
  media: null;
}

export interface EndpointModulesCategoriesUpdate_InputBody {
  data: {
    [k: string]: {
      [k: string]: string;
    };
  };
}

export interface EndpointModulesCategoriesUpdate_OutputOK {
  success: boolean;
}

export interface EndpointAiImageGenerationGenerateImage {
  method: "post";
  input: {
    body?: EndpointAiImageGenerationGenerateImage_InputBody;
  };
  output: {
    OK: EndpointAiImageGenerationGenerateImage_OutputOK;
  };
  media: null;
}

export interface EndpointAiImageGenerationGenerateImage_InputBody {
  prompt: string;
}

export interface EndpointFilesGet {
  method: "get";
  input: {
    query?: EndpointFilesGet_InputQuery;
  };
  output: any;
  media: null;
}

export interface EndpointFilesGet_InputQuery {
  key: string;
  thumb?: string;
  download?: string;
}

export interface EndpointPing {
  method: "post";
  input: {
    body?: EndpointPing_InputBody;
  };
  output: {
    OK: EndpointPing_OutputOK;
  };
  media: null;
}

export interface EndpointPing_InputBody {
  timestamp: number;
}

export interface EndpointStatus {
  method: "get";
  input: {};
  output: {
    OK: EndpointStatus_OutputOK;
  };
  media: null;
}

export interface EndpointStatus_OutputOK {
  environment: string;
}

export interface EndpointCorsAnywhere {
  method: "get";
  input: {
    query?: EndpointCorsAnywhere_InputQuery;
  };
  output: {
    OK: EndpointCorsAnywhere_OutputOK;
  };
  media: null;
}

export interface EndpointCorsAnywhere_InputQuery {
  url: string;
}

export interface EndpointCorsAnywhere_OutputOK {
  [k: string]: unknown;
}

export interface EndpointEncryptionPublicKey {
  method: "get";
  input: {};
  output: {
    OK: EndpointEncryptionPublicKey_OutputOK;
  };
  media: null;
}
