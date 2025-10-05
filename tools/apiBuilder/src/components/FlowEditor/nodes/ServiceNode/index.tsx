import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'

function ServiceNode() {
  return (
    <NodeColumnWrapper>
      <NodeColumn handle="controller-input" nodeType="service" />
      <NodeColumn handle="action-input" nodeType="service" />
    </NodeColumnWrapper>
  )
}

export default ServiceNode
