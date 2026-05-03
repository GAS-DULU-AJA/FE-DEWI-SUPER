"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { WatermarkConfig, WatermarkPosition } from "@/types";

const positions: { value: WatermarkPosition; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
  { value: "tiled", label: "Tiled" },
];

const initialConfig: WatermarkConfig = {
  enabled: true,
  type: "text",
  text: "Desa Wisata Indonesia",
  fontSize: 24,
  fontColor: "#ffffff",
  opacity: 0.3,
  position: "bottom-right",
  padding: 20,
  scale: 0.2,
};

function previewPosition(position: WatermarkPosition) {
  switch (position) {
    case "center":
      return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
    case "top-left":
      return "left-0 top-0";
    case "top-right":
      return "right-0 top-0";
    case "bottom-left":
      return "left-0 bottom-0";
    default:
      return "right-0 bottom-0";
  }
}

export function WatermarkConfigPanel() {
  const [config, setConfig] = useState<WatermarkConfig>(initialConfig);

  const tiledText = useMemo(() => {
    if (config.type !== "text" || !config.text?.trim()) return "WATERMARK";
    return config.text;
  }, [config]);

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setConfig((prev) => ({ ...prev, imageUrl: url, type: "image" }));
  };

  const save = () => {
    toast.success("Watermark configuration saved");
  };

  const isTiled = config.position === "tiled";
  const alpha = config.opacity ?? 0.3;

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Watermark Configuration</CardTitle>
          <CardDescription>Configure global watermark policy for partner media uploads.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={config.enabled ? "default" : "secondary"}>{config.enabled ? "Enabled" : "Disabled"}</Badge>
            <Button variant={config.enabled ? "destructive" : "outline"} onClick={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}>
              {config.enabled ? "Disable" : "Enable"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Watermark Type</Label>
              <Select
                value={config.type}
                onValueChange={(value) => {
                  if (!value) return;
                  setConfig((prev) => ({ ...prev, type: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <Select
                value={config.position}
                onValueChange={(value) => {
                  if (!value) return;
                  setConfig((prev) => ({ ...prev, position: value as WatermarkPosition }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>{position.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {config.type === "text" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label>Text</Label>
                <Input value={config.text ?? ""} onChange={(event) => setConfig((prev) => ({ ...prev, text: event.target.value }))} placeholder="Enter watermark text" />
              </div>
              <div className="space-y-2">
                <Label>Font Color</Label>
                <Input type="color" value={config.fontColor ?? "#ffffff"} onChange={(event) => setConfig((prev) => ({ ...prev, fontColor: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Input type="number" min={12} max={72} value={config.fontSize ?? 24} onChange={(event) => setConfig((prev) => ({ ...prev, fontSize: Number(event.target.value) || 24 }))} />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Watermark Logo</Label>
                <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleLogoUpload(event.target.files?.[0])} />
              </div>
              <div className="space-y-2">
                <Label>Scale (0.05 - 1)</Label>
                <Input type="number" min={0.05} max={1} step={0.05} value={config.scale ?? 0.2} onChange={(event) => setConfig((prev) => ({ ...prev, scale: Number(event.target.value) || 0.2 }))} />
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Opacity ({alpha.toFixed(2)})</Label>
              <Input type="range" min={0} max={1} step={0.05} value={alpha} onChange={(event) => setConfig((prev) => ({ ...prev, opacity: Number(event.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Padding (px)</Label>
              <Input type="number" min={0} max={100} value={config.padding ?? 20} onChange={(event) => setConfig((prev) => ({ ...prev, padding: Number(event.target.value) || 0 }))} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={save}>Save Watermark Config</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>Preview how watermark appears on uploaded image.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-[url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=60')] bg-cover bg-center">
            {config.enabled ? (
              config.type === "image" && config.imageUrl ? (
                isTiled ? (
                  <div className="absolute inset-0" style={{ opacity: alpha, backgroundImage: `url(${config.imageUrl})`, backgroundRepeat: "repeat", backgroundSize: `${Math.max(8, (config.scale ?? 0.2) * 100)}% auto` }} />
                ) : (
                  <img
                    src={config.imageUrl}
                    alt="Watermark"
                    className={`absolute h-16 w-auto ${previewPosition(config.position)}`}
                    style={{
                      opacity: alpha,
                      margin: `${config.padding ?? 20}px`,
                    }}
                  />
                )
              ) : isTiled ? (
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: alpha,
                    backgroundImage: `repeating-linear-gradient(-30deg, transparent, transparent 60px, rgba(255,255,255,0.25) 60px, rgba(255,255,255,0.25) 120px)`,
                  }}
                >
                  <div className="p-4 text-xs font-semibold tracking-wide text-white">{tiledText}</div>
                </div>
              ) : (
                <span
                  className={`absolute font-semibold ${previewPosition(config.position)}`}
                  style={{
                    opacity: alpha,
                    color: config.fontColor ?? "#ffffff",
                    fontSize: `${config.fontSize ?? 24}px`,
                    margin: `${config.padding ?? 20}px`,
                  }}
                >
                  {config.text || "WATERMARK"}
                </span>
              )
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
