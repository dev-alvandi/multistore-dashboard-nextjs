"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Link from "next/link";

const signUpFormSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2),
});

const verificationFormSchema = z.object({
  code: z.string().length(6),
});

const testEmailRegex = /\b\+clerk_test\b/;

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const signupForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email:
        "random_email" +
        Math.random().toString(16).slice(2) +
        "+clerk_test@test.com",
      password: "pass" + Math.random().toString(16).slice(2),
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: "424242",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    if (!isLoaded) return;

    const { email, password } = values;

    console.log(email, password);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (err: any) {
      // console.error(JSON.stringify(err, null, 2));
      // console.log(err.errors[0].message);
      toast.error(err.errors[0].message, {
        id: "sign-up-error",
      });
    }
  };

  const handleVerify = async (
    values: z.infer<typeof verificationFormSchema>
  ) => {
    if (!isLoaded) return;

    toast.loading("Signing up...", {
      id: "sign-up-id",
    });

    const { code } = values;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
        router.refresh();
        toast.success("🎉 You're signed up", {
          id: "sign-up-id",
        });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  if (verifying) {
    return (
      <>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify the email
              </h1>
              <Form {...verificationForm}>
                <form
                  onSubmit={verificationForm.handleSubmit(handleVerify)}
                  className="space-y-8"
                >
                  <FormField
                    control={verificationForm.control}
                    name="code"
                    render={({ field }) => {
                      {
                        testEmailRegex.test(signupForm.getValues("email"))
                          ? (field.value = "424242")
                          : (field.value = "");
                      }
                      return (
                        <FormItem>
                          <FormLabel>OTP code</FormLabel>
                          <FormControl className="space-y-2">
                            <InputOTP
                              maxLength={6}
                              {...field}
                              defaultValue={424242}
                            >
                              <InputOTPGroup className="w-full gap-2 otp-custom-styles">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormDescription>
                            This is autofilled with the test OTP.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <Button className="w-full" type="submit">
                    Verify
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign up to your account
          </h1>
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is a random autogenerated email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is a random autogenerated password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Sign up
              </Button>
            </form>
          </Form>
          <div className="text-sm flex items-center justify-center">
            <p className="inline text-muted-foreground">
              Already have an account?&nbsp;
            </p>
            <Link href={"/sign-in"}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
