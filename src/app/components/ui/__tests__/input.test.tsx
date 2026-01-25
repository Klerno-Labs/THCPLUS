import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toBeInTheDocument()
  })

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')

    expect(input).toBeInTheDocument()
  })

  it('should accept different input types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number')
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement

    await user.type(input, 'Hello World')

    expect(input.value).toBe('Hello World')
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveClass('custom-input')
  })

  it('should have default classes', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveClass('flex')
    expect(input).toHaveClass('h-10')
    expect(input).toHaveClass('w-full')
    expect(input).toHaveClass('rounded-md')
    expect(input).toHaveClass('border')
  })

  it('should forward ref', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should be disabled when disabled prop is passed', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toBeDisabled()
  })

  it('should have disabled styling when disabled', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveClass('disabled:cursor-not-allowed')
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('should accept value prop', () => {
    render(<Input value="Test value" onChange={() => {}} data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement

    expect(input.value).toBe('Test value')
  })

  it('should be read-only when readOnly prop is passed', () => {
    render(<Input readOnly data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('readOnly')
  })

  it('should accept aria-label for accessibility', () => {
    render(<Input aria-label="Email input" data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('aria-label', 'Email input')
  })

  it('should accept required attribute', () => {
    render(<Input required data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toBeRequired()
  })

  it('should accept name attribute', () => {
    render(<Input name="email" data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('name', 'email')
  })

  it('should accept id attribute', () => {
    render(<Input id="email-input" data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('id', 'email-input')
  })

  it('should accept autocomplete attribute', () => {
    render(<Input autoComplete="email" data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('autoComplete', 'email')
  })

  it('should accept maxLength attribute', () => {
    render(<Input maxLength={50} data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('maxLength', '50')
  })

  it('should accept min and max for number inputs', () => {
    render(<Input type="number" min={0} max={100} data-testid="input" />)
    const input = screen.getByTestId('input')

    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('should trigger onChange callback', async () => {
    const user = userEvent.setup()
    let value = ''
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value
    }

    render(<Input onChange={handleChange} data-testid="input" />)
    const input = screen.getByTestId('input')

    await user.type(input, 'test')

    expect(value).toBe('test')
  })

  it('should trigger onFocus callback', async () => {
    const user = userEvent.setup()
    let focused = false
    const handleFocus = () => {
      focused = true
    }

    render(<Input onFocus={handleFocus} data-testid="input" />)
    const input = screen.getByTestId('input')

    await user.click(input)

    expect(focused).toBe(true)
  })

  it('should trigger onBlur callback', async () => {
    const user = userEvent.setup()
    let blurred = false
    const handleBlur = () => {
      blurred = true
    }

    render(
      <>
        <Input onBlur={handleBlur} data-testid="input" />
        <button data-testid="outside">Outside</button>
      </>
    )
    const input = screen.getByTestId('input')
    const outside = screen.getByTestId('outside')

    await user.click(input)
    await user.click(outside)

    expect(blurred).toBe(true)
  })
})
