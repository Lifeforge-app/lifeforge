import type { MDXComponents } from 'mdx/types'
import Zoom from 'react-medium-image-zoom'
import { Link } from 'react-router'

import { Bordered, Box, Flex, Text } from '@lifeforge/ui'

import Code from './Code'

export const components: MDXComponents = {
  em(properties) {
    return <i {...properties} />
  },
  h6(properties) {
    return (
      <Text
        as="h6"
        color="custom-500"
        size={{ base: 'base', sm: 'lg' }}
        weight="medium"
        {...properties}
      />
    )
  },
  h1(properties) {
    return <Text as="h1" my="sm" size="4xl" weight="bold" {...properties} />
  },
  h2(properties) {
    return (
      <Text
        {...properties}
        as="h2"
        mt={{ base: 'xl', sm: '2xl' }}
        size={{ base: '2xl', sm: '3xl' }}
        weight="semibold"
      />
    )
  },
  h3(properties) {
    return (
      <Text
        {...properties}
        as="h3"
        mt="2xl"
        size={{ base: 'xl', sm: '2xl' }}
        weight="semibold"
      />
    )
  },
  h4(properties) {
    return (
      <Text
        {...properties}
        as="h4"
        mt="xl"
        size={{ base: 'lg', sm: 'xl' }}
        weight="semibold"
      />
    )
  },
  p(properties) {
    return (
      <Text
        {...properties}
        as="p"
        color={{ base: 'bg-600', dark: 'bg-400' }}
        mt="lg"
      />
    )
  },
  hr(properties) {
    return (
      <Bordered
        {...properties}
        as="hr"
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        borderSide="top"
        borderWidth="1.5px"
        mt={{ base: 'xl', sm: '2xl' }}
      />
    )
  },
  a(properties) {
    return (
      <Text asChild color="custom-500" decoration="underline" weight="medium">
        <Link to={properties.href || ''}>{properties.children}</Link>
      </Text>
    )
  },
  ul(properties) {
    return (
      <Box
        {...properties}
        as="ul"
        mt="md"
        pl="lg"
        style={{ listStyleType: 'disc' }}
      />
    )
  },
  ol(properties) {
    return (
      <Box
        {...properties}
        as="ol"
        mt="md"
        pl="lg"
        style={{ listStyleType: 'decimal' }}
      />
    )
  },
  li(properties) {
    return (
      <Text
        as="li"
        color={{ base: 'bg-600', dark: 'bg-400' }}
        py="xs"
        {...properties}
      />
    )
  },
  strong(properties) {
    return (
      <Text
        {...properties}
        as="strong"
        color={{ base: 'bg-800', dark: 'bg-100' }}
        weight="semibold"
      />
    )
  },
  code(properties) {
    if (properties.className) {
      return (
        <Code language={properties.className.replace('language-', '')}>
          {properties.children as string}
        </Code>
      )
    }

    return <code>{properties.children}</code>
  },
  table(properties) {
    return (
      <Bordered
        {...properties}
        as="table"
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        borderSide="all"
        borderWidth="1.5px"
        mt="lg"
        style={{ borderCollapse: 'collapse' }}
        width="100%"
      />
    )
  },
  th(properties) {
    return (
      <Bordered
        asChild
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        borderSide="all"
        borderWidth="1.5px"
      >
        <Text {...properties} align="left" as="th" px="md" py="sm" />
      </Bordered>
    )
  },
  td(properties) {
    return (
      <Bordered
        asChild
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        borderSide="all"
        borderWidth="1.5px"
      >
        <Text {...properties} align="left" as="td" px="md" py="sm" />
      </Bordered>
    )
  },
  img(properties) {
    return (
      <Zoom zoomImg={properties.src}>
        <Flex centered pb="md" pt="sm" width="100%">
          <Box as="img" {...properties} alt="" r="lg" width={{ sm: '90%' }} />
        </Flex>
      </Zoom>
    )
  },
  blockquote(properties) {
    return (
      <Bordered
        {...properties}
        as="blockquote"
        borderColor={{ base: 'bg-200', dark: 'bg-800' }}
        borderSide="left"
        borderWidth="4px"
        my="md"
        pl="md"
        style={{ fontStyle: 'italic' }}
      />
    )
  }
}
