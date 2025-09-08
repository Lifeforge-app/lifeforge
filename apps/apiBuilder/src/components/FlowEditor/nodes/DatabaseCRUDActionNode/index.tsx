import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'

function DatabaseCRUDActionNode() {
  return (
    <NodeColumnWrapper>
      <NodeColumn handle="db-operation-input" nodeType="databaseCRUDAction" />
      <NodeColumn handle="action-output" nodeType="databaseCRUDAction" />
    </NodeColumnWrapper>
  )
}

export default DatabaseCRUDActionNode
