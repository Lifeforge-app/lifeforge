import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'

function ServiceNode() {
  return (
    <NodeColumnWrapper>
      <NodeColumn nodeType="service" handle="controller-input" />
      <NodeColumn nodeType="service" handle="action-input" />
    </NodeColumnWrapper>
  )
}

export default ServiceNode
