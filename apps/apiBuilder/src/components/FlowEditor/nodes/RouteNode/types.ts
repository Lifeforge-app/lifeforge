export interface IRouteNodeData {
  parentPath: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}
