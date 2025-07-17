import PocketBase from "pocketbase";
import { MoviesSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const updateTicket = (
  pb: PocketBase,
  ticketData: Pick<
    MoviesSchemas.IEntry,
    "ticket_number" | "theatre_number" | "theatre_seat" | "theatre_showtime"
  > & {
    entry_id: string;
    theatre_location: {
      displayName: {
        text: string;
        languageCode: string;
      };
      location: {
        latitude: number;
        longitude: number;
      };
    };
  },
): Promise<WithPB<MoviesSchemas.IEntry>> => {
  (ticketData as any).theatre_location =
    ticketData.theatre_location.displayName.text;

  return pb
    .collection("movies__entries")
    .update<WithPB<MoviesSchemas.IEntry>>(ticketData.entry_id, ticketData);
};

export const clearTicket = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb
    .collection("movies__entries")
    .update<WithPB<MoviesSchemas.IEntry>>(id, {
      ticket_number: "",
      theatre_location: "",
      theatre_number: "",
      theatre_seat: "",
      theatre_showtime: "",
    });
};
