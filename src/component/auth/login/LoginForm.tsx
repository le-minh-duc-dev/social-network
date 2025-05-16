import { Button, Form, Input } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import React from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  const mutation = useMutation({})

  return (
    <Form
      className="w-full max-w-xs"
      onSubmit={() => {
        mutation.mutate()
      }}
    >
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <Input
        className="max-w-xs"
        labelPlacement="outside"
        isRequired
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <FaEyeSlash className="text-lg text-default-400 pointer-events-none" />
            ) : (
              <FaEye className="text-lg text-default-400 pointer-events-none" />
            )}
          </button>
        }
        label="Password"
        placeholder="Enter your password"
        type={isVisible ? "text" : "password"}
      />
      <Button type="submit" variant="bordered" className="w-full mt-4">
        Submit
      </Button>
    </Form>
  )
}
