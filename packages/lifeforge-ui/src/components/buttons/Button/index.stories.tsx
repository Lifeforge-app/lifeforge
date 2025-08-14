import type { Meta, StoryObj } from '@storybook/react-vite'

import Index from './index'

const meta = {
  component: Index,
  parameters: {
    docs: {
      description: {
        component:
          'A button component for user interactions. Should be used consistently throughout the application. When designing pages, custom defined button should be avoided as much as possible.'
      }
    }
  },
  argTypes: {
    icon: {
      description:
        'The icon to display in the button. Should be a valid icon name from Iconify in the form of `<icon-library>:<icon-name>`.'
    },
    as: {
      table: {
        type: {
          summary: 'React.ElementType'
        },
        defaultValue: {
          summary: 'button'
        }
      },
      description:
        'The HTML element to render as. Can be a string representing HTML tag or a React component.'
    },
    children: {
      control: false,
      description:
        'The content to display inside the button. Can be text or any valid React node.'
    },
    className: {
      description:
        "The class name to apply to the button. Can be used to customize the button's appearance. If it doesn't work, try putting an exclamation mark at the end (applicable for valid Tailwind CSS classes)."
    },
    disabled: {
      description:
        'Indicates whether the button is disabled. When true, user interactions are not allowed.'
    },
    iconClassName: {
      description:
        "The class name to apply to the icon. Can be used to customize the icon's appearance. If it doesn't work, try putting an exclamation mark at the end (applicable for valid Tailwind CSS classes)."
    },
    iconPosition: {
      table: {
        type: {
          summary: '"start" | "end"'
        },
        defaultValue: {
          summary: '"start"'
        }
      },
      description: 'The position of the icon within the button.'
    },
    isRed: {
      table: {
        type: {
          summary: 'boolean'
        },
        defaultValue: {
          summary: 'false'
        }
      },
      description: 'Indicates whether the button has a red background.'
    },
    loading: {
      table: {
        type: {
          summary: 'boolean'
        },
        defaultValue: {
          summary: 'false'
        }
      },
      description:
        'Indicates whether the button is in a loading state. When true, a spinner icon is displayed and user interactions are not allowed.'
    },
    namespace: {
      table: {
        defaultValue: {
          summary: 'common.buttons'
        }
      },
      description:
        'The i18n namespace to use for the button content translation. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details on internationalization.'
    },
    onClick: {
      description: 'Callback function to handle button click events.'
    },
    tProps: {
      description:
        'Additional properties to pass to the translation function. Used for dynamic translations. See the [i18n documentation](https://docs.lifeforge.melvinchia.dev) for more details on internationalization.'
    },
    variant: {
      table: {
        type: {
          summary: '"primary" | "secondary" | "tertiary" | "plain"'
        },
        defaultValue: {
          summary: 'primary'
        }
      },
      description:
        'The visual style variant of the button. Can be one of "primary", "secondary", "tertiary", or "plain".'
    }
  }
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const PrimaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Button',
    tProps: {},
    iconPosition: 'start',
    variant: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'A primary button variant. Suitable for main actions.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const SecondaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Secondary',
    tProps: {},
    variant: 'secondary'
  },
  parameters: {
    docs: {
      description: {
        story:
          'A secondary button variant. Suitable for less prominent actions.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const TertiaryVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Tertiary',
    tProps: {},
    variant: 'tertiary'
  },
  parameters: {
    docs: {
      description: {
        story: 'A tertiary button variant. Suitable for less prominent actions.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const PlaintVariant: Story = {
  args: {
    as: 'button',
    icon: 'tabler:cube',
    children: 'Plain Button',
    tProps: {},
    variant: 'plain'
  },
  parameters: {
    docs: {
      description: {
        story:
          'A plain button variant. Suitable for actions without emphasis, or button with icon only.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const IconAtEnd: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Proceed',
    tProps: {},
    iconPosition: 'end',
    loading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'A button with the icon positioned at the end.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const Disabled: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Submit',
    tProps: {},
    loading: false,
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'A disabled button. Indicates an action that is not available. User input is disabled.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const Loading: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrow-right',
    children: 'Loading',
    tProps: {},
    iconPosition: 'end',
    loading: true,
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story:
          'A loading button. Indicates an action that is in progress. User input is disabled.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const IconsOnly: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrows-exchange',
    children: '',
    tProps: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'A button that displays only an icon.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const IconsOnlyWithNoBg: Story = {
  args: {
    as: 'button',
    icon: 'tabler:arrows-exchange',
    children: '',
    tProps: {},
    variant: 'plain'
  },
  parameters: {
    docs: {
      description: {
        story: 'A button that displays only an icon, with no background.'
      }
    }
  },
  render: props => <Index {...props} />
}

export const RedButton: Story = {
  args: {
    as: 'button',
    icon: 'tabler:trash',
    children: 'Delete',
    tProps: {},
    variant: 'primary',
    isRed: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'A red button variant. Suitable for destructive actions like deleting an item.'
      }
    }
  },
  render: props => <Index {...props} />
}
