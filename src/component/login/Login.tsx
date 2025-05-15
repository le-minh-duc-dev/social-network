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

export default function Login() {
  return (
    <div className="flex-1 flex justify-center items-center">
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
            <span className="mx-4 text-default-400 text-sm">Or with email and password</span>
            <Divider className="flex-1" />
          </div>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  )
}
