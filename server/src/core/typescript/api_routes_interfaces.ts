interface IRouteDocs {
  summary: string;
  description: string;
  access: "public" | "protected" | "private";
  params: {
    name: string;
    type: string;
    required: boolean | string;
    options?: string[];
    must_exist?: boolean;
    description: string;
  }[];
  query: {
    name: string;
    type: string;
    required: boolean | string;
    options?: string[];
    description: string;
  }[];
  body: {
    name: string;
    type: string;
    required: boolean | string;
    options?: string[];
    description: string;
  }[];
  response: {
    status: number;
    description: string;
    body: string;
  };
}

interface IRoute {
  method: string;
  path: string;
  description?: string;
  docs: IRouteDocs | null;
}

interface IRoutes {
  topLevel: IRoute[];
  use: {
    path: string;
    children: IRoutes | IRoute[];
  }[];
}

export { IRoute, IRouteDocs, IRoutes };
