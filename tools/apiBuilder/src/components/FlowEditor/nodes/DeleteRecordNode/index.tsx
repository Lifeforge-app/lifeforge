import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'

function DeleteRecordNode() {
  return (
    <NodeColumnWrapper>
      <NodeColumn handle="collection-input" nodeType="deleteRecord" />
      <NodeColumn handle="id-input" nodeType="deleteRecord" />
      <NodeColumn handle="db-operation-output" nodeType="deleteRecord" />
    </NodeColumnWrapper>
  )
}

export default DeleteRecordNode
