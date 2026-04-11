"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    toast.success("Email reset password telah dikirim!");
  }

  if (sent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Cek Email Anda</CardTitle>
          <CardDescription>
            Kami telah mengirimkan link reset password ke <strong>{email}</strong>. Link berlaku 1 jam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Kembali ke Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{siteConfig.name}</CardTitle>
        <CardDescription>Masukkan email untuk reset password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@dewi.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Kirim Link Reset
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-muted-foreground text-sm hover:underline">
              Kembali ke Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
