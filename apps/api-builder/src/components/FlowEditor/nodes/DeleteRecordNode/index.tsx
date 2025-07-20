import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'

function DeleteRecordNode() {
  return (
    <NodeColumnWrapper>
      <NodeColumn nodeType="deleteRecord" handle="collection-input" />
      <NodeColumn nodeType="deleteRecord" handle="id-input" />
      <NodeColumn nodeType="deleteRecord" handle="db-operation-output" />
    </NodeColumnWrapper>
  )
}

export default DeleteRecordNode
