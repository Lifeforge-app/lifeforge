import moment from "moment";
import PocketBase from "pocketbase";
import { TodoListCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getEntryById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<TodoListCollectionsSchemas.IEntry>> =>
  pb
    .collection("todo_list__entries")
    .getOne<WithPB<TodoListCollectionsSchemas.IEntry>>(id);

export const getAllEntries = async (
  pb: PocketBase,
  statusFilter: string,
  tag?: string,
  list?: string,
  priority?: string,
): Promise<WithPB<TodoListCollectionsSchemas.IEntry>[]> => {
  const filters = {
    all: "done = false",
    today: `done = false && due_date >= "${moment()
      .startOf("day")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")}" && due_date <= "${moment()
      .endOf("day")
      .utc()
      .add(1, "second")
      .format("YYYY-MM-DD HH:mm:ss")}"`,
    scheduled: `done = false && due_date != "" && due_date >= "${moment()
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")}"`,
    overdue: `done = false && due_date != "" && due_date < "${moment()
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")}"`,
    completed: "done = true",
  };

  let finalFilter = filters[statusFilter as keyof typeof filters];

  if (tag) finalFilter += ` && tags ~ "${tag}"`;
  if (list) finalFilter += ` && list = "${list}"`;
  if (priority) finalFilter += ` && priority = "${priority}"`;

  return await pb
    .collection("todo_list__entries")
    .getFullList<WithPB<TodoListCollectionsSchemas.IEntry>>({
      filter: finalFilter,
      sort: "-created",
    });
};

export const getStatusCounter = async (
  pb: PocketBase,
): Promise<TodoListCollectionsSchemas.ITodoListStatusCounter> => {
  const filters = {
    all: "done = false",
    today: `done = false && due_date >= "${moment()
      .startOf("day")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")}" && due_date <= "${moment()
      .endOf("day")
      .utc()
      .add(1, "second")
      .format("YYYY-MM-DD HH:mm:ss")}"`,
    scheduled: `done = false && due_date != "" && due_date >= "${moment()
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")}"`,
    overdue: `done = false && due_date != "" && due_date < "${moment()
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")}"`,
    completed: "done = true",
  };

  const counters: TodoListCollectionsSchemas.ITodoListStatusCounter = {
    all: 0,
    today: 0,
    scheduled: 0,
    overdue: 0,
    completed: 0,
  };

  for (const type of Object.keys(filters) as (keyof typeof filters)[]) {
    const { totalItems } = await pb
      .collection("todo_list__entries")
      .getList(1, 1, {
        filter: filters[type],
      });

    counters[type] = totalItems;
  }

  return counters;
};

export const createEntry = async (
  pb: PocketBase,
  data: Omit<
    TodoListCollectionsSchemas.IEntry,
    "completed_at" | "done" | "due_date_has_time"
  > & {
    due_date_has_time?: boolean;
  },
): Promise<WithPB<TodoListCollectionsSchemas.IEntry>> => {
  if (data.due_date && !data.due_date_has_time) {
    data.due_date = moment(data.due_date).endOf("day").toISOString();
  }

  delete data.due_date_has_time;

  return await pb
    .collection("todo_list__entries")
    .create<WithPB<TodoListCollectionsSchemas.IEntry>>(data);
};

export const updateEntry = async (
  pb: PocketBase,
  id: string,
  data: Omit<
    TodoListCollectionsSchemas.IEntry,
    "completed_at" | "done" | "due_date_has_time"
  > & {
    due_date_has_time?: boolean;
  },
): Promise<WithPB<TodoListCollectionsSchemas.IEntry>> => {
  if (data.due_date && !data.due_date_has_time) {
    data.due_date = moment(data.due_date).endOf("day").toISOString();
  }

  delete data.due_date_has_time;

  return await pb.collection("todo_list__entries").update(id, data);
};

export const deleteEntry = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("todo_list__entries").delete(id);
};

export const toggleEntry = async (
  pb: PocketBase,
  id: string,
): Promise<WithPB<TodoListCollectionsSchemas.IEntry>> => {
  const entry = await pb
    .collection("todo_list__entries")
    .getOne<WithPB<TodoListCollectionsSchemas.IEntry>>(id);

  return await pb
    .collection("todo_list__entries")
    .update<WithPB<TodoListCollectionsSchemas.IEntry>>(id, {
      done: !entry.done,
      completed_at: entry.done
        ? null
        : moment().utc().format("YYYY-MM-DD HH:mm:ss"),
    });
};
