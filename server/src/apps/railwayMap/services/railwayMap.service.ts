import ClientError from "@functions/ClientError";
import PocketBase from "pocketbase";
import { RailwayMapSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

import dijkstraWithTransfers from "../utils/pathFinding";

export const getLines = (
  pb: PocketBase,
): Promise<WithPB<RailwayMapSchemas.ILine>[]> =>
  pb
    .collection("railway_map__lines")
    .getFullList<WithPB<RailwayMapSchemas.ILine>>();

export const getStations = (
  pb: PocketBase,
): Promise<WithPB<RailwayMapSchemas.IStation>[]> =>
  pb
    .collection("railway_map__stations")
    .getFullList<WithPB<RailwayMapSchemas.IStation>>();

export const getShortestPath = async (
  pb: PocketBase,
  start: string,
  end: string,
): Promise<WithPB<RailwayMapSchemas.IStation>[]> => {
  const allStations = await pb
    .collection("railway_map__stations")
    .getFullList<WithPB<RailwayMapSchemas.IStation>>();

  if (
    ![start, end].every((station) => allStations.some((s) => s.id === station))
  ) {
    throw new ClientError("Invalid start or end station");
  }

  const graphWithWeight = allStations.reduce<
    Record<string, Record<string, number>>
  >((acc, station) => {
    if (!station.distances) return acc;
    acc[station.name] = Object.fromEntries(
      Object.entries(station.distances).map(([name, distance]) => [
        name,
        distance,
      ]),
    ) as Record<string, number>;
    return acc;
  }, {});

  const lines = allStations.reduce<Record<string, string[]>>((acc, station) => {
    acc[station.name] = station.lines ?? [];
    return acc;
  }, {});

  const path = dijkstraWithTransfers(
    graphWithWeight,
    lines,
    allStations.find((s) => s.id === start)?.name ?? "",
    allStations.find((s) => s.id === end)?.name ?? "",
  );

  if (!path) {
    throw new Error("No path found");
  }

  return path
    .map((station) => allStations.find((s) => s.name === station))
    .filter((s) => !!s);
};
