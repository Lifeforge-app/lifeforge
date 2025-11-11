import { GoBackButton } from 'lifeforge-ui'
import { useNavigate, useParams } from 'shared'

function EntryDetails() {
  const navigate = useNavigate()

  const { id } = useParams()

  return (
    <>
      <GoBackButton onClick={() => navigate(-1)} />
      <div className="flex-center">
        <h1>Entry Details - {id}</h1>
      </div>
    </>
  )
}

export default EntryDetails
