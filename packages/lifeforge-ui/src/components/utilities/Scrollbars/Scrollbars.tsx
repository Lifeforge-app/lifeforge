/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import css from 'dom-css'
// @ts-ignore
import PropTypes from 'prop-types'
import raf, { cancel as caf } from 'raf'
import {
  type CSSProperties,
  Component,
  type ReactElement,
  type ReactNode,
  type UIEvent,
  cloneElement,
  createElement
} from 'react'

import {
  renderThumbHorizontalDefault,
  renderThumbVerticalDefault,
  renderTrackHorizontalDefault,
  renderTrackVerticalDefault,
  renderViewDefault
} from './defaultRenderElements'
import {
  containerStyleAutoHeight,
  containerStyleDefault,
  disableSelectStyle,
  disableSelectStyleReset,
  thumbHorizontalStyleDefault,
  thumbVerticalStyleDefault,
  trackHorizontalStyleDefault,
  trackVerticalStyleDefault,
  viewStyleAutoHeight,
  viewStyleDefault,
  viewStyleUniversalInitial
} from './styles'
import getInnerHeight from './utils/getInnerHeight'
import getInnerWidth from './utils/getInnerWidth'
import getScrollbarWidth from './utils/getScrollbarWidth'
import isString from './utils/isString'
import returnFalse from './utils/returnFalse'

interface ScrollValues {
  left: number
  top: number
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
  scrollHeight: number
  clientWidth: number
  clientHeight: number
}

interface RenderElementProps {
  style?: CSSProperties
  [key: string]: unknown
}

type RenderFunction = (props: RenderElementProps) => ReactElement

export interface ScrollbarsProps {
  onScroll?: (event: UIEvent<HTMLElement>) => void
  onScrollFrame?: (values: ScrollValues) => void
  onScrollStart?: () => void
  onScrollStop?: () => void
  onUpdate?: (values: ScrollValues) => void
  renderView?: RenderFunction
  renderTrackHorizontal?: RenderFunction
  renderTrackVertical?: RenderFunction
  renderThumbHorizontal?: RenderFunction
  renderThumbVertical?: RenderFunction
  tagName?: string
  thumbSize?: number
  thumbMinSize?: number
  hideTracksWhenNotNeeded?: boolean
  autoHide?: boolean
  autoHideTimeout?: number
  autoHideDuration?: number
  autoHeight?: boolean
  autoHeightMin?: number | string
  autoHeightMax?: number | string
  universal?: boolean
  style?: CSSProperties
  children?: ReactNode
  [key: string]: unknown
}

interface ScrollbarsState {
  didMountUniversal: boolean
}

export default class Scrollbars extends Component<
  ScrollbarsProps,
  ScrollbarsState
> {
  private container: HTMLElement | null = null
  private view: HTMLElement | null = null
  private trackHorizontal: HTMLElement | null = null
  private trackVertical: HTMLElement | null = null
  private thumbHorizontal: HTMLElement | null = null
  private thumbVertical: HTMLElement | null = null
  private requestFrame?: number
  private hideTracksTimeout?: ReturnType<typeof setTimeout>
  private detectScrollingInterval?: ReturnType<typeof setInterval>
  private dragging: boolean = false
  private scrolling: boolean = false
  private trackMouseOver: boolean = false
  private prevPageX: number = 0
  private prevPageY: number = 0
  private viewScrollLeft: number = 0
  private viewScrollTop: number = 0
  private lastViewScrollLeft: number = 0
  private lastViewScrollTop: number = 0

  constructor(props: ScrollbarsProps, ...rest: any[]) {
    // @ts-expect-error - React allows rest parameters in constructors
    super(props, ...rest)

    this.getScrollLeft = this.getScrollLeft.bind(this)
    this.getScrollTop = this.getScrollTop.bind(this)
    this.getScrollWidth = this.getScrollWidth.bind(this)
    this.getScrollHeight = this.getScrollHeight.bind(this)
    this.getClientWidth = this.getClientWidth.bind(this)
    this.getClientHeight = this.getClientHeight.bind(this)
    this.getValues = this.getValues.bind(this)
    this.getThumbHorizontalWidth = this.getThumbHorizontalWidth.bind(this)
    this.getThumbVerticalHeight = this.getThumbVerticalHeight.bind(this)
    this.getScrollLeftForOffset = this.getScrollLeftForOffset.bind(this)
    this.getScrollTopForOffset = this.getScrollTopForOffset.bind(this)

    this.scrollLeft = this.scrollLeft.bind(this)
    this.scrollTop = this.scrollTop.bind(this)
    this.scrollToLeft = this.scrollToLeft.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.scrollToRight = this.scrollToRight.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)

    this.handleTrackMouseEnter = this.handleTrackMouseEnter.bind(this)
    this.handleTrackMouseLeave = this.handleTrackMouseLeave.bind(this)
    this.handleHorizontalTrackMouseDown =
      this.handleHorizontalTrackMouseDown.bind(this)
    this.handleVerticalTrackMouseDown =
      this.handleVerticalTrackMouseDown.bind(this)
    this.handleHorizontalThumbMouseDown =
      this.handleHorizontalThumbMouseDown.bind(this)
    this.handleVerticalThumbMouseDown =
      this.handleVerticalThumbMouseDown.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)

    this.state = {
      didMountUniversal: false
    }
  }

  componentDidMount() {
    this.addListeners()
    this.update()
    this.componentDidMountUniversal()
  }

  componentDidMountUniversal(): void {
    const { universal } = this.props

    if (!universal) return
    this.setState({ didMountUniversal: true })
  }

  componentDidUpdate(): void {
    this.update()
  }

  componentWillUnmount(): void {
    this.removeListeners()
    if (this.requestFrame !== undefined) caf(this.requestFrame)
    clearTimeout(this.hideTracksTimeout)
    clearInterval(this.detectScrollingInterval)
  }

  getScrollLeft(): number {
    if (!this.view) return 0

    return this.view.scrollLeft
  }

  getScrollTop(): number {
    if (!this.view) return 0

    return this.view.scrollTop
  }

  getScrollWidth(): number {
    if (!this.view) return 0

    return this.view.scrollWidth
  }

  getScrollHeight(): number {
    if (!this.view) return 0

    return this.view.scrollHeight
  }

  getClientWidth(): number {
    if (!this.view) return 0

    return this.view.clientWidth
  }

  getClientHeight(): number {
    if (!this.view) return 0

    return this.view.clientHeight
  }

  getValues(): ScrollValues {
    const {
      scrollLeft = 0,
      scrollTop = 0,
      scrollWidth = 0,
      scrollHeight = 0,
      clientWidth = 0,
      clientHeight = 0
    } = this.view || {}

    return {
      left: scrollLeft / (scrollWidth - clientWidth) || 0,
      top: scrollTop / (scrollHeight - clientHeight) || 0,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight
    }
  }

  getThumbHorizontalWidth(): number {
    const { thumbSize, thumbMinSize = 30 } = this.props

    const { scrollWidth, clientWidth } = this.view!

    const trackWidth = getInnerWidth(this.trackHorizontal!)

    const width = Math.ceil((clientWidth / scrollWidth) * trackWidth)

    if (trackWidth === width) return 0
    if (thumbSize) return thumbSize

    return Math.max(width, thumbMinSize)
  }

  getThumbVerticalHeight(): number {
    const { thumbSize, thumbMinSize = 30 } = this.props

    const { scrollHeight, clientHeight } = this.view!

    const trackHeight = getInnerHeight(this.trackVertical!)

    const height = Math.ceil((clientHeight / scrollHeight) * trackHeight)

    if (trackHeight === height) return 0
    if (thumbSize) return thumbSize

    return Math.max(height, thumbMinSize)
  }

  getScrollLeftForOffset(offset: number): number {
    const { scrollWidth, clientWidth } = this.view!

    const trackWidth = getInnerWidth(this.trackHorizontal!)

    const thumbWidth = this.getThumbHorizontalWidth()

    return (offset / (trackWidth - thumbWidth)) * (scrollWidth - clientWidth)
  }

  getScrollTopForOffset(offset: number): number {
    const { scrollHeight, clientHeight } = this.view!

    const trackHeight = getInnerHeight(this.trackVertical!)

    const thumbHeight = this.getThumbVerticalHeight()

    return (
      (offset / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight)
    )
  }

  scrollLeft(left: number = 0): void {
    if (!this.view) return
    this.view.scrollLeft = left
  }

  scrollTop(top: number = 0): void {
    if (!this.view) return
    this.view.scrollTop = top
  }

  scrollToLeft(): void {
    if (!this.view) return
    this.view.scrollLeft = 0
  }

  scrollToTop(): void {
    if (!this.view) return
    this.view.scrollTop = 0
  }

  scrollToRight(): void {
    if (!this.view) return
    this.view.scrollLeft = this.view.scrollWidth
  }

  scrollToBottom(): void {
    if (!this.view) return
    this.view.scrollTop = this.view.scrollHeight
  }

  addListeners(): void {
    /* istanbul ignore if */
    if (typeof document === 'undefined' || !this.view) return

    const {
      view,
      trackHorizontal,
      trackVertical,
      thumbHorizontal,
      thumbVertical
    } = this

    view.addEventListener('scroll', this.handleScroll)
    if (!getScrollbarWidth()) return
    trackHorizontal?.addEventListener('mouseenter', this.handleTrackMouseEnter)
    trackHorizontal?.addEventListener('mouseleave', this.handleTrackMouseLeave)
    trackHorizontal?.addEventListener(
      'mousedown',
      this.handleHorizontalTrackMouseDown
    )
    trackVertical?.addEventListener('mouseenter', this.handleTrackMouseEnter)
    trackVertical?.addEventListener('mouseleave', this.handleTrackMouseLeave)
    trackVertical?.addEventListener(
      'mousedown',
      this.handleVerticalTrackMouseDown
    )
    thumbHorizontal?.addEventListener(
      'mousedown',
      this.handleHorizontalThumbMouseDown
    )
    thumbVertical?.addEventListener(
      'mousedown',
      this.handleVerticalThumbMouseDown
    )
    window.addEventListener('resize', this.handleWindowResize)
  }

  removeListeners(): void {
    /* istanbul ignore if */
    if (typeof document === 'undefined' || !this.view) return

    const {
      view,
      trackHorizontal,
      trackVertical,
      thumbHorizontal,
      thumbVertical
    } = this

    view.removeEventListener('scroll', this.handleScroll)
    if (!getScrollbarWidth()) return
    trackHorizontal?.removeEventListener(
      'mouseenter',
      this.handleTrackMouseEnter
    )
    trackHorizontal?.removeEventListener(
      'mouseleave',
      this.handleTrackMouseLeave
    )
    trackHorizontal?.removeEventListener(
      'mousedown',
      this.handleHorizontalTrackMouseDown
    )
    trackVertical?.removeEventListener('mouseenter', this.handleTrackMouseEnter)
    trackVertical?.removeEventListener('mouseleave', this.handleTrackMouseLeave)
    trackVertical?.removeEventListener(
      'mousedown',
      this.handleVerticalTrackMouseDown
    )
    thumbHorizontal?.removeEventListener(
      'mousedown',
      this.handleHorizontalThumbMouseDown
    )
    thumbVertical?.removeEventListener(
      'mousedown',
      this.handleVerticalThumbMouseDown
    )
    window.removeEventListener('resize', this.handleWindowResize)
    // Possibly setup by `handleDragStart`
    this.teardownDragging()
  }

  handleScroll(event: Event): void {
    const { onScroll, onScrollFrame } = this.props

    if (onScroll) onScroll(event as unknown as UIEvent<HTMLElement>)
    this.update((values: ScrollValues) => {
      const { scrollLeft, scrollTop } = values

      this.viewScrollLeft = scrollLeft
      this.viewScrollTop = scrollTop
      if (onScrollFrame) onScrollFrame(values)
    })
    this.detectScrolling()
  }

  handleScrollStart(): void {
    const { onScrollStart } = this.props

    if (onScrollStart) onScrollStart()
    this.handleScrollStartAutoHide()
  }

  handleScrollStartAutoHide(): void {
    const { autoHide } = this.props

    if (!autoHide) return
    this.showTracks()
  }

  handleScrollStop(): void {
    const { onScrollStop } = this.props

    if (onScrollStop) onScrollStop()
    this.handleScrollStopAutoHide()
  }

  handleScrollStopAutoHide(): void {
    const { autoHide } = this.props

    if (!autoHide) return
    this.hideTracks()
  }

  handleWindowResize(): void {
    this.update()
  }

  handleHorizontalTrackMouseDown(event: MouseEvent): void {
    event.preventDefault()

    const { target, clientX } = event

    const { left: targetLeft } = (target as HTMLElement).getBoundingClientRect()

    const thumbWidth = this.getThumbHorizontalWidth()

    const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2

    this.view!.scrollLeft = this.getScrollLeftForOffset(offset)
  }

  handleVerticalTrackMouseDown(event: MouseEvent): void {
    event.preventDefault()

    const { target, clientY } = event

    const { top: targetTop } = (target as HTMLElement).getBoundingClientRect()

    const thumbHeight = this.getThumbVerticalHeight()

    const offset = Math.abs(targetTop - clientY) - thumbHeight / 2

    this.view!.scrollTop = this.getScrollTopForOffset(offset)
  }

  handleHorizontalThumbMouseDown(event: MouseEvent): void {
    event.preventDefault()
    this.handleDragStart(event)

    const { target, clientX } = event

    const { offsetWidth } = target as HTMLElement

    const { left } = (target as HTMLElement).getBoundingClientRect()

    this.prevPageX = offsetWidth - (clientX - left)
  }

  handleVerticalThumbMouseDown(event: MouseEvent): void {
    event.preventDefault()
    this.handleDragStart(event)

    const { target, clientY } = event

    const { offsetHeight } = target as HTMLElement

    const { top } = (target as HTMLElement).getBoundingClientRect()

    this.prevPageY = offsetHeight - (clientY - top)
  }

  setupDragging(): void {
    css(document.body, disableSelectStyle)
    document.addEventListener('mousemove', this.handleDrag)
    document.addEventListener('mouseup', this.handleDragEnd)
    document.onselectstart = returnFalse
  }

  teardownDragging(): void {
    css(document.body, disableSelectStyleReset)
    document.removeEventListener('mousemove', this.handleDrag)
    document.removeEventListener('mouseup', this.handleDragEnd)
    document.onselectstart = null
  }

  handleDragStart(event: MouseEvent): void {
    this.dragging = true
    event.stopImmediatePropagation()
    this.setupDragging()
  }

  handleDrag(event: MouseEvent): boolean {
    if (this.prevPageX) {
      const { clientX } = event

      const { left: trackLeft } = this.trackHorizontal!.getBoundingClientRect()

      const thumbWidth = this.getThumbHorizontalWidth()

      const clickPosition = thumbWidth - this.prevPageX

      const offset = -trackLeft + clientX - clickPosition

      this.view!.scrollLeft = this.getScrollLeftForOffset(offset)
    }

    if (this.prevPageY) {
      const { clientY } = event

      const { top: trackTop } = this.trackVertical!.getBoundingClientRect()

      const thumbHeight = this.getThumbVerticalHeight()

      const clickPosition = thumbHeight - this.prevPageY

      const offset = -trackTop + clientY - clickPosition

      this.view!.scrollTop = this.getScrollTopForOffset(offset)
    }

    return false
  }

  handleDragEnd(): void {
    this.dragging = false
    this.prevPageX = this.prevPageY = 0
    this.teardownDragging()
    this.handleDragEndAutoHide()
  }

  handleDragEndAutoHide(): void {
    const { autoHide } = this.props

    if (!autoHide) return
    this.hideTracks()
  }

  handleTrackMouseEnter(): void {
    this.trackMouseOver = true
    this.handleTrackMouseEnterAutoHide()
  }

  handleTrackMouseEnterAutoHide(): void {
    const { autoHide } = this.props

    if (!autoHide) return
    this.showTracks()
  }

  handleTrackMouseLeave(): void {
    this.trackMouseOver = false
    this.handleTrackMouseLeaveAutoHide()
  }

  handleTrackMouseLeaveAutoHide(): void {
    const { autoHide } = this.props

    if (!autoHide) return
    this.hideTracks()
  }

  showTracks(): void {
    clearTimeout(this.hideTracksTimeout)
    if (this.trackHorizontal) css(this.trackHorizontal, { opacity: 1 })
    if (this.trackVertical) css(this.trackVertical, { opacity: 1 })
  }

  hideTracks(): void {
    if (this.dragging) return
    if (this.scrolling) return
    if (this.trackMouseOver) return

    const { autoHideTimeout = 1000 } = this.props

    clearTimeout(this.hideTracksTimeout)
    this.hideTracksTimeout = setTimeout(() => {
      if (this.trackHorizontal) css(this.trackHorizontal, { opacity: 0 })
      if (this.trackVertical) css(this.trackVertical, { opacity: 0 })
    }, autoHideTimeout)
  }

  detectScrolling() {
    if (this.scrolling) return
    this.scrolling = true
    this.handleScrollStart()
    this.detectScrollingInterval = setInterval(() => {
      if (
        this.lastViewScrollLeft === this.viewScrollLeft &&
        this.lastViewScrollTop === this.viewScrollTop
      ) {
        clearInterval(this.detectScrollingInterval)
        this.scrolling = false
        this.handleScrollStop()
      }
      this.lastViewScrollLeft = this.viewScrollLeft
      this.lastViewScrollTop = this.viewScrollTop
    }, 100)
  }

  raf(callback: () => void): void {
    if (this.requestFrame) raf.cancel(this.requestFrame)
    this.requestFrame = raf(() => {
      this.requestFrame = undefined
      callback()
    })
  }

  update(callback?: (values: ScrollValues) => void): void {
    this.raf(() => this._update(callback))
  }

  _update(callback?: (values: ScrollValues) => void): void {
    const { onUpdate, hideTracksWhenNotNeeded } = this.props

    const values = this.getValues()

    if (
      this.trackHorizontal &&
      this.trackVertical &&
      this.thumbHorizontal &&
      this.thumbVertical
    ) {
      const { scrollLeft, clientWidth, scrollWidth } = values

      const trackHorizontalWidth = getInnerWidth(this.trackHorizontal)

      const thumbHorizontalWidth = this.getThumbHorizontalWidth()

      const thumbHorizontalX =
        (scrollLeft / (scrollWidth - clientWidth)) *
        (trackHorizontalWidth - thumbHorizontalWidth)

      const thumbHorizontalStyle = {
        width: thumbHorizontalWidth,
        transform: `translateX(${thumbHorizontalX}px)`
      }

      const { scrollTop, clientHeight, scrollHeight } = values

      const trackVerticalHeight = getInnerHeight(this.trackVertical)

      const thumbVerticalHeight = this.getThumbVerticalHeight()

      const thumbVerticalY =
        (scrollTop / (scrollHeight - clientHeight)) *
        (trackVerticalHeight - thumbVerticalHeight)

      const thumbVerticalStyle = {
        height: thumbVerticalHeight,
        transform: `translateY(${thumbVerticalY}px)`
      }

      if (hideTracksWhenNotNeeded) {
        const trackHorizontalStyle = {
          visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
        }

        const trackVerticalStyle = {
          visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
        }

        css(this.trackHorizontal, trackHorizontalStyle)
        css(this.trackVertical, trackVerticalStyle)
      }
      css(this.thumbHorizontal, thumbHorizontalStyle)
      css(this.thumbVertical, thumbVerticalStyle)
    }
    if (onUpdate) onUpdate(values)
    if (typeof callback !== 'function') return
    callback(values)
  }

  render(): ReactElement {
    const scrollbarWidth = getScrollbarWidth()

    const {
      onScroll: _onScroll,
      onScrollFrame: _onScrollFrame,
      onScrollStart: _onScrollStart,
      onScrollStop: _onScrollStop,
      onUpdate: _onUpdate,
      renderView = renderViewDefault,
      renderTrackHorizontal = renderTrackHorizontalDefault,
      renderTrackVertical = renderTrackVerticalDefault,
      renderThumbHorizontal = renderThumbHorizontalDefault,
      renderThumbVertical = renderThumbVerticalDefault,
      tagName = 'div',
      hideTracksWhenNotNeeded: _hideTracksWhenNotNeeded,
      autoHide,
      autoHideTimeout: _autoHideTimeout,
      autoHideDuration,
      thumbSize: _thumbSize,
      thumbMinSize: _thumbMinSize,
      universal,
      autoHeight,
      autoHeightMin = 0,
      autoHeightMax = 200,
      style,
      children,
      ...props
    } = this.props

    const { didMountUniversal } = this.state

    const containerStyle = {
      ...containerStyleDefault,
      ...(autoHeight && {
        ...containerStyleAutoHeight,
        minHeight: autoHeightMin,
        maxHeight: autoHeightMax
      }),
      ...style
    }

    const viewStyle = {
      ...viewStyleDefault,
      // Hide scrollbars by setting a negative margin
      marginRight: scrollbarWidth ? -scrollbarWidth : 0,
      marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
      ...(autoHeight && {
        ...viewStyleAutoHeight,
        // Add scrollbarWidth to autoHeight in order to compensate negative margins
        minHeight: isString(autoHeightMin)
          ? `calc(${autoHeightMin} + ${scrollbarWidth}px)`
          : autoHeightMin + scrollbarWidth,
        maxHeight: isString(autoHeightMax)
          ? `calc(${autoHeightMax} + ${scrollbarWidth}px)`
          : autoHeightMax + scrollbarWidth
      }),
      // Override min/max height for initial universal rendering
      ...(autoHeight &&
        universal &&
        !didMountUniversal && {
          minHeight: autoHeightMin,
          maxHeight: autoHeightMax
        }),
      // Override
      ...(universal && !didMountUniversal && viewStyleUniversalInitial)
    }

    const trackAutoHeightStyle = {
      transition: `opacity ${autoHideDuration}ms`,
      opacity: 0
    }

    const trackHorizontalStyle = {
      ...trackHorizontalStyleDefault,
      ...(autoHide && trackAutoHeightStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: 'none'
      })
    }

    const trackVerticalStyle = {
      ...trackVerticalStyleDefault,
      ...(autoHide && trackAutoHeightStyle),
      ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
        display: 'none'
      })
    }

    return createElement(
      tagName,
      {
        ...props,
        style: containerStyle,
        ref: (ref: Element | null) => {
          this.container = ref as HTMLElement | null
        }
      },
      [
        cloneElement(
          renderView({ style: viewStyle }),
          {
            key: 'view',
            ref: (ref: Element | null) => {
              this.view = ref as HTMLElement | null
            }
          } as any,
          children
        ),
        cloneElement(
          renderTrackHorizontal({ style: trackHorizontalStyle }),
          {
            key: 'trackHorizontal',
            ref: (ref: Element | null) => {
              this.trackHorizontal = ref as HTMLElement | null
            }
          } as any,
          cloneElement(
            renderThumbHorizontal({ style: thumbHorizontalStyleDefault }),
            {
              ref: (ref: Element | null) => {
                this.thumbHorizontal = ref as HTMLElement | null
              }
            } as any
          )
        ),
        cloneElement(
          renderTrackVertical({ style: trackVerticalStyle }),
          {
            key: 'trackVertical',
            ref: (ref: Element | null) => {
              this.trackVertical = ref as HTMLElement | null
            }
          } as any,
          cloneElement(
            renderThumbVertical({ style: thumbVerticalStyleDefault }),
            {
              ref: (ref: Element | null) => {
                this.thumbVertical = ref as HTMLElement | null
              }
            } as any
          )
        )
      ]
    )
  }
}

Scrollbars.propTypes = {
  onScroll: PropTypes.func,
  onScrollFrame: PropTypes.func,
  onScrollStart: PropTypes.func,
  onScrollStop: PropTypes.func,
  onUpdate: PropTypes.func,
  renderView: PropTypes.func,
  renderTrackHorizontal: PropTypes.func,
  renderTrackVertical: PropTypes.func,
  renderThumbHorizontal: PropTypes.func,
  renderThumbVertical: PropTypes.func,
  tagName: PropTypes.string,
  thumbSize: PropTypes.number,
  thumbMinSize: PropTypes.number,
  hideTracksWhenNotNeeded: PropTypes.bool,
  autoHide: PropTypes.bool,
  autoHideTimeout: PropTypes.number,
  autoHideDuration: PropTypes.number,
  autoHeight: PropTypes.bool,
  autoHeightMin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autoHeightMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  universal: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node
}

// Note: defaultProps is deprecated in React 18 with TypeScript
// Default values are now handled in the props destructuring in the render method
