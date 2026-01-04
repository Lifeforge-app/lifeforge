import { Card, ModuleHeader } from 'lifeforge-ui'
import { Link } from 'shared'

function EntryList() {
  return (
    <>
      <ModuleHeader />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(id => (
          <Card key={id} isInteractive as={Link} to={`${id}`}>
            <h2>Entry Item {id}</h2>
          </Card>
        ))}
      </div>
    </>
  )
}

export default EntryList
