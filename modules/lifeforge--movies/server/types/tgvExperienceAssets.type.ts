export interface TGVExperienceAssets {
  success: boolean;
  results: Results;
}

export interface Results {
  contentblock: ResultsContentblock;
}

export interface ResultsContentblock {
  recid:      string;
  itemkey:    string;
  parentkey:  string;
  name:       string;
  status:     number;
  pubdateutc: string;
  extdata:    ContentblockExtdata;
  assets:     Asset[];
}

export interface Asset {
  assetkey:    string;
  folderkey:   Folderkey;
  priority:    number;
  status:      number;
  description: Description;
  extdata:     AssetExtdata;
}

export enum Description {
  Empty = "",
  IndulgeBedCinemaLogo = "Indulge Bed Cinema Logo",
}

export interface AssetExtdata {
  fileinfo: Fileinfo;
}

export interface Fileinfo {
  contenttype: Contenttype;
  filepath:    string;
  fileurl:     string;
}

export enum Contenttype {
  ImageJPEG = "image/jpeg",
  ImagePNG = "image/png",
  ImageSVGXML = "image/svg+xml",
}

export enum Folderkey {
  SeatingExperience = "seating.experience",
}

export interface ContentblockExtdata {
  folderkey:    Folderkey;
  contentblock: ExtdataContentblock;
}

export interface ExtdataContentblock {
  seating: Seating[];
}

export interface Seating {
  key:            string;
  logo:           string;
  content:        Content[];
  preview:        Preview[];
  subject:        string;
  previewDesktop: Preview[];
}

export interface Content {
  type:     ContentType;
  items?:   Item[];
  divider:  boolean;
  subject:  string;
  text?:    string;
  heading?: string;
}

export interface Item {
  assetkey:    string;
  description: string;
}

export enum ContentType {
  Grid = "grid",
  Text = "text",
}

export interface Preview {
  type:        PreviewType;
  actionparam: string;
}

export enum PreviewType {
  Image = "image",
  Youtube = "youtube",
}
