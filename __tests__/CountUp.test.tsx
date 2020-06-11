import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { CountUp } from '../src'

const useElapsedTime = require('use-elapsed-time')

const fixture = {
  isCounting: false,
  duration: 10,
  end: 3684,
}

afterEach(() => {
  useElapsedTime.__resetElapsedTime()
})

describe('functional tests', () => {
  it('should return the end value if duration is set to 0', () => {
    const { getByText } = render(<CountUp {...fixture} duration={0} />)

    expect(getByText('3684')).toBeInTheDocument()
  })

  it('should return the end value when the duration is set to be less than the elapsed time', () => {
    useElapsedTime.__setElapsedTime(17)
    const { getByText } = render(<CountUp {...fixture} duration={0} />)

    expect(getByText('3684')).toBeInTheDocument()
  })

  it('should use the default duration if it is not provided', () => {
    useElapsedTime.__setElapsedTime(2)
    const { getByText } = render(<CountUp {...fixture} duration={undefined} />)

    expect(getByText('3684')).toBeInTheDocument()
  })

  it('should return the elapsed time from the start if end value is not provided', () => {
    useElapsedTime.__setElapsedTime(17.345)
    const { getByText } = render(
      <CountUp {...fixture} end={undefined} start={43.67} />
    )

    expect(getByText('61.02')).toBeInTheDocument()
  })

  it('should pass isCounting to useElapsedTime hook', () => {
    const isCounting = true

    render(<CountUp {...fixture} isCounting={isCounting} />)

    expect(useElapsedTime.__getIsPlaying()).toBe(isCounting)
    useElapsedTime.__resetIsPlaying()
  })

  it('should pass config options to useElapsedTime hook', () => {
    const onComplete = jest.fn()
    const autoResetKey = '100'

    render(
      <CountUp
        {...fixture}
        onComplete={onComplete}
        autoResetKey={autoResetKey}
      />
    )

    expect(useElapsedTime.__getConfig()).toEqual({
      duration: 10,
      onComplete,
      autoResetKey,
    })

    useElapsedTime.__resetIsPlaying()
    useElapsedTime.__resetConfig()
  })
})

describe('when using the component with children as a render prop', () => {
  const reset = jest.fn()
  beforeEach(() => {
    useElapsedTime.__setElapsedTime(7.345)
    useElapsedTime.__setResetMethod(reset)
  })
  afterEach(() => {
    useElapsedTime.__resetResetMethod()
  })

  it('should pass the current count up value and reset method to children render function', () => {
    const children = jest.fn()
    render(
      <CountUp {...fixture} start={43}>
        {children}
      </CountUp>
    )

    expect(children).toHaveBeenCalledWith({ value: '3616', reset })
  })
})

describe('easing testing', () => {
  it('should use the custom easing function when it is provided', () => {
    useElapsedTime.__setElapsedTime(5)

    const easingReturnValue = '45687'
    const easing = jest.fn().mockReturnValue(easingReturnValue)
    const { getByText } = render(<CountUp {...fixture} easing={easing} />)

    expect(getByText(easingReturnValue)).toBeInTheDocument()
    expect(easing).toHaveBeenCalledWith(5, 0, 3684, 10)
  })

  it.each`
    easing            | midValue
    ${'easeOutCubic'} | ${'3229'}
    ${'easeInCubic'}  | ${'501'}
    ${'linear'}       | ${'1865'}
  `(
    'should return the correct start, mid and end values when the easing is set to $easing',
    ({ easing, midValue }) => {
      useElapsedTime.__setElapsedTime(0)

      const getComponent = () => (
        <CountUp {...fixture} start={46} easing={easing} />
      )

      const { getByText, rerender } = render(getComponent())

      expect(getByText('46')).toBeInTheDocument()

      useElapsedTime.__setElapsedTime(5)
      rerender(getComponent())
      expect(getByText(midValue)).toBeInTheDocument()

      useElapsedTime.__setElapsedTime(10)
      rerender(getComponent())
      expect(getByText('3684')).toBeInTheDocument()
    }
  )

  it.each`
    easing            | midValue
    ${'easeOutCubic'} | ${'694.2'}
    ${'easeInCubic'}  | ${'139.0'}
    ${'linear'}       | ${'416.6'}
  `(
    'should return the correct start, mid and end values when the easing is set to $easing and values have decimal places',
    ({ easing, midValue }) => {
      useElapsedTime.__setElapsedTime(0)

      const getComponent = () => (
        <CountUp {...fixture} start={46.5} end={786.7} easing={easing} />
      )

      const { getByText, rerender } = render(getComponent())

      expect(getByText('46.5')).toBeInTheDocument()

      useElapsedTime.__setElapsedTime(5)
      rerender(getComponent())
      expect(getByText(midValue)).toBeInTheDocument()

      useElapsedTime.__setElapsedTime(10)
      rerender(getComponent())
      expect(getByText('786.7')).toBeInTheDocument()
    }
  )
})

describe('when formatting the number', () => {
  it('should remove all decimal places by default', () => {
    useElapsedTime.__setElapsedTime(6.789412)
    const { getByText } = render(<CountUp {...fixture} />)

    expect(getByText('3562')).toBeInTheDocument()
  })

  it('should add "." as decimal separator by default', () => {
    useElapsedTime.__setElapsedTime(6.789412)
    const { getByText } = render(<CountUp {...fixture} decimalPlaces={2} />)

    expect(getByText('3562.08')).toBeInTheDocument()
  })

  it('should add as many decimal places as the bigger decimal places count from start and end when decimalPlaces is not set and end has more decimal places', () => {
    useElapsedTime.__setElapsedTime(2)
    const { getByText } = render(
      <CountUp {...fixture} start={12.478} end={18.93412} />
    )

    expect(getByText('15.62859')).toBeInTheDocument()
  })

  it('should add as many decimal places as the bigger decimal places count from start and end when decimalPlaces is not set and start has more decimal places', () => {
    useElapsedTime.__setElapsedTime(2)
    const { getByText } = render(
      <CountUp {...fixture} start={12.478} end={18.9} />
    )

    expect(getByText('15.612')).toBeInTheDocument()
  })

  it('should use decimal and thousand separators if there are provided', () => {
    useElapsedTime.__setElapsedTime(6.789412)
    const { getByText } = render(
      <CountUp
        {...fixture}
        decimalPlaces={2}
        decimalSeparator=","
        thousandsSeparator=" "
      />
    )

    expect(getByText('3 562,08')).toBeInTheDocument()
  })

  it('should add prefix when provided', () => {
    useElapsedTime.__setElapsedTime(6.789412)
    const { getByText } = render(<CountUp {...fixture} prefix="£" />)

    expect(getByText('£3562')).toBeInTheDocument()
  })

  it('should add suffix when provided', () => {
    useElapsedTime.__setElapsedTime(6.789412)
    const { getByText } = render(<CountUp {...fixture} suffix=" left" />)

    expect(getByText('3562 left')).toBeInTheDocument()
  })

  it('should prefer custom formatter to toLocaleString', () => {
    const formatter = jest.fn().mockReturnValueOnce('12.765')
    useElapsedTime.__setElapsedTime(7.4)
    const { getByText } = render(
      <CountUp {...fixture} formatter={formatter} shouldUseToLocaleString />
    )

    expect(getByText('12.765')).toBeInTheDocument()
    expect(formatter).toHaveBeenCalledWith(3619.250016)
  })
})

describe('when using the toLocaleString', () => {
  it('should use toLocaleString when it is supported without params', () => {
    useElapsedTime.__setElapsedTime(7)
    const { getByText } = render(
      <CountUp {...fixture} shouldUseToLocaleString />
    )

    expect(getByText('3,585')).toBeInTheDocument()
  })

  it('should use toLocaleString when it is supported without params and format number based on decimal places in the "end" value', () => {
    useElapsedTime.__setElapsedTime(7)
    const { getByText } = render(
      <CountUp {...fixture} shouldUseToLocaleString end={1465.23} />
    )

    expect(getByText('1,425.67')).toBeInTheDocument()
  })

  it('should use toLocaleString when it is supported with locale', () => {
    useElapsedTime.__setElapsedTime(7)
    const { getByText } = render(
      <CountUp
        {...fixture}
        shouldUseToLocaleString
        toLocaleStringParams={{ locale: 'de' }}
      />
    )

    expect(getByText('3,585')).toBeInTheDocument()
  })

  it('should use toLocaleString when it is supported with locale and format number based on decimal places in the "end" value', () => {
    useElapsedTime.__setElapsedTime(7)
    const { getByText } = render(
      <CountUp
        {...fixture}
        shouldUseToLocaleString
        toLocaleStringParams={{ locale: 'de' }}
        end={76.8}
      />
    )

    expect(getByText('74.7')).toBeInTheDocument()
  })

  it('should use toLocaleString when it is supported with options', () => {
    useElapsedTime.__setElapsedTime(7)
    const { getByText } = render(
      <CountUp
        {...fixture}
        shouldUseToLocaleString
        toLocaleStringParams={{ options: { maximumFractionDigits: 1 } }}
        end={783.8}
      />
    )

    expect(getByText('762.6')).toBeInTheDocument()
  })

  it('should log an error if the provided locale is not correct and use to fallback options', () => {
    const mockedConsoleError = jest.fn()
    global.console.error = mockedConsoleError
    useElapsedTime.__setElapsedTime(7)
    const { getByText } = render(
      <CountUp
        {...fixture}
        shouldUseToLocaleString
        toLocaleStringParams={{ locale: 'asdasdsad' }}
        thousandsSeparator=" "
        decimalSeparator="."
        decimalPlaces={2}
      />
    )

    expect(mockedConsoleError).toHaveBeenCalled()
    expect(getByText('3 584.53')).toBeInTheDocument()
  })

  it('should default to custom formating options with fallback suffix and prefix when toLocaleString locales or options are not supported', () => {
    Object.defineProperty(global.Intl, 'NumberFormat', {
      value: undefined,
      configurable: true,
    })
    useElapsedTime.__setElapsedTime(7)

    const { getByText } = render(
      <CountUp
        {...fixture}
        shouldUseToLocaleString
        toLocaleStringParams={{ options: { maximumFractionDigits: 2 } }}
        thousandsSeparator=" "
        decimalSeparator="."
        decimalPlaces={2}
        fallbackPrefix="$"
        fallbackSuffix=" left"
      />
    )

    expect(getByText('$3 584.53 left')).toBeInTheDocument()
  })
})
