import OrdinaryColumn from '../../components/OrdinaryColumn'
import AvatarColumn from './components/AvatarColumn'

function PersonalInfoTab() {
  return (
    <>
      <AvatarColumn />
      <OrdinaryColumn
        icon="tabler:user"
        id="username"
        title="username"
        type="text"
      />
      <OrdinaryColumn
        icon="tabler:user-screen"
        id="name"
        title="display Name"
        type="text"
      />
      <OrdinaryColumn icon="tabler:mail" id="email" title="email" type="text" />
      <OrdinaryColumn
        icon="tabler:cake"
        id="dateOfBirth"
        title="date Of Birth"
        type="datetime"
      />
    </>
  )
}

export default PersonalInfoTab
