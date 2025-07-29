import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import Index from './index'

const meta = {
    component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        name: 'name',
        icon: 'tabler:cube',
        setIcon: () => {},
        namespace: 'namespace'
    },
    render: args => {
        const [icon, setIcon] = useState(args.icon)

        return (
            <Index {...args} disabled={false} icon={icon} setIcon={setIcon} />
        )
    }
}
