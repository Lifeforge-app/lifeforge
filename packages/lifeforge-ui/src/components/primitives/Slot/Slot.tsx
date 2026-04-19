import { clsx } from 'clsx'
import {
  type CSSProperties,
  Children,
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  isValidElement
} from 'react'

interface SlotProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  ref?: Ref<unknown>
  [key: string]: unknown
}

export function Slot({ children, className, style, ref, ...rest }: SlotProps) {
  const child = Children.only(children)

  if (!isValidElement(child)) {
    return null
  }

  const childProps = child.props as Record<string, unknown>

  const mergedProps: Record<string, unknown> = {
    ...rest,
    className: clsx(className, childProps.className as string),
    style: { ...style, ...(childProps.style as CSSProperties) }
  }

  if (ref) {
    mergedProps.ref = ref
  }

  return cloneElement(
    child as ReactElement<Record<string, unknown>>,
    mergedProps
  )
}
