"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/partial/provider/Auth";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/auth");
        }
    }, [user, router]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome to the Dashboard, {user.name.first}!</h1>
        </div>
    );
}
