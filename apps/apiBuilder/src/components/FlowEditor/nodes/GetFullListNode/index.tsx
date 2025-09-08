import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'

function GetFullListNode() {
  return (
    <NodeColumnWrapper>
      <NodeColumn handle="collection-input" nodeType="getFullList" />
      <NodeColumn handle="filter-input" nodeType="getFullList" />
      <NodeColumn handle="sorter-input" nodeType="getFullList" />
      <NodeColumn
        handle="collection-pick-fields-input"
        nodeType="getFullList"
      />
      <NodeColumn handle="db-operation-output" nodeType="getFullList" />
    </NodeColumnWrapper>
  )
}

export default GetFullListNode
