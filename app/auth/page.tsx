"use client";
import { useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import Button from "@/components/ui/atom/Button";
import Input from "@/components/ui/atom/Input";
import styles from "./Auth.module.scss";
import api from "@/core/config/api";
import { useAuth } from "@/components/partial/provider/Auth";

const phoneValidationSchema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^(\+98|0)?9\d{9}$/, "شماره تلفن وارد شده معتبر نیست")
        .required("شماره تلفن اجباری است"),
});

export default function AuthPage() {
    const router = useRouter();
    const { login } = useAuth();

    return (
        <div className={styles.container}>
            <Formik
                initialValues={{ phone: "" }}
                validationSchema={phoneValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const response = await api.get("/", {
                            params: { results: 1, nat: "us" },
                        });

                        if (response.data?.results?.length > 0) {
                            const user = response.data.results[0];
                            login(user);
                            router.push("/dashboard");
                        }
                    } catch (error) {
                        console.error("خطا در دریافت کاربر:", error);
                        alert("خطا در ورود، دوباره تلاش کنید.");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
                    <Form className={styles.form}>
                        <h1 className={styles.title}>سامانه احراز هویت</h1>
                        <p className={styles.description}>این تسک برای شرکت دکاموند طراحی شده است.</p>

                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            label="شماره تلفن همراه"
                            placeholder="مثلاً 09123456789"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone ? errors.phone : ""}
                        />

                        <div className={styles.error}>
                            <ErrorMessage name="phone" component="div" />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className={styles.loginBtn}>
                            {isSubmitting ? "در حال ورود..." : "ورود"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
