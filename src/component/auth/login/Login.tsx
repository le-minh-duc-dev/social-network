"use client"

import { AppRouteManager } from "@/service/AppRouteManager"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
} from "@heroui/react"
import { signIn } from "next-auth/react"
import LoginForm from "./LoginForm"
import Link from "next/link"

export default function Login() {
  return (
    <div className="flex-1 flex-col flex justify-center items-center gap-y-8">
      <Card
        classNames={{
          base: "p-12",
          // body:"flex flex-col items-center"
        }}
      >
        <CardHeader>
          <h1 className="text-3xl mb-12 mx-auto font-semibold">Login</h1>
        </CardHeader>
        <CardBody>
          <form
            action={() => {
              signIn("google", {
                redirectTo: AppRouteManager.HOME,
              })
            }}
          >
            <Button
              type="submit"
              variant="bordered"
              className="h-fit bg-content1 "
            >
              <div className="flex gap-x-6 p-2 items-center justify-between">
                <Image
                  src="/images/google_icon.png"
                  alt="Google icon"
                  width={30}
                  height={30}
                />
                <div className="font-semibold">Sign in with Google</div>
                <div className=""></div>
              </div>
            </Button>
          </form>
          {/* <form
            action={() => {
              signIn("github", {
                redirectTo: AppRouteManager.HOME,
              })
            }}
            className="mt-4"
          >
            <Button
              type="submit"
              variant="bordered"
              className="h-fit bg-content1 "
            >
              <div className="flex gap-x-6 p-2 items-center justify-between">
                <Image
                  src="/images/github_icon.png"
                  alt="Github icon"
                  width={30}
                  height={30}
                />
                <div className="font-semibold">Sign in with Github</div>
                <div className=""></div>
              </div>
            </Button>
          </form> */}
          <div className="flex my-8 items-center">
            <Divider className="flex-1" />
            <span className="mx-4 text-default-400 text-sm">
              Or with email and password
            </span>
            <Divider className="flex-1" />
          </div>
          <LoginForm />
          <Link
            href={AppRouteManager.REGISTER}
            className="text-default-400 text-sm mt-8 hover:text-default-500 hover:underline"
          >
            Don&apos;t have an account?
          </Link>
        </CardBody>
      </Card>
      <div className="">
        <p className="text-sm text-default-500 mt-6">
          © 2025 Social Network Inc.
        </p>
        <p className="text-sm mt-1">
          Built with ❤️ by{" "}
          <a
            href="https://ducle.online"
            target="_blank"
            className="text-primary hover:underline font-medium "
          >
            ducle.online
          </a>
        </p>
      </div>
    </div>
  )
}
