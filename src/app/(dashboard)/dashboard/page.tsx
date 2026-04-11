"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, ClipboardCheck, CreditCard, TrendingUp, Star, Building, Activity } from "lucide-react";
import {
  mockDashboardKpi,
  mockUserGrowth,
  mockTransactionVolume,
  mockRevenueByType,
  mockVillagePerformance,
} from "@/lib/mock-data";
import { formatCurrency } from "@/utils/format-currency";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#eab308", "#dc2626", "#7c3aed"];

const kpiCards = [
  { title: "Total User", value: mockDashboardKpi.totalUsers.toLocaleString(), icon: Users, change: "+12% dari bulan lalu" },
  { title: "User Aktif", value: mockDashboardKpi.activeUsers.toLocaleString(), icon: Activity, change: `${Math.round((mockDashboardKpi.activeUsers / mockDashboardKpi.totalUsers) * 100)}% dari total` },
  { title: "Total Desa", value: mockDashboardKpi.totalVillages.toString(), icon: MapPin, change: `${mockDashboardKpi.activeVillages} aktif` },
  { title: "Pending Approval", value: mockDashboardKpi.pendingApprovals.toString(), icon: ClipboardCheck, change: "Perlu ditinjau" },
  { title: "Transaksi Bulan Ini", value: formatCurrency(mockDashboardKpi.monthlyRevenue), icon: CreditCard, change: "+22% dari bulan lalu" },
  { title: "Total Partner", value: mockDashboardKpi.totalPartners.toString(), icon: Building, change: "Aktif terdaftar" },
  { title: "Volume Transaksi", value: formatCurrency(mockDashboardKpi.monthlyTransactions), icon: Star, change: "Bulan ini" },
  { title: "Desa Aktif", value: mockDashboardKpi.activeVillages.toString(), icon: TrendingUp, change: `dari ${mockDashboardKpi.totalVillages} total` },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Ringkasan data platform Desa Wisata" />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-muted-foreground text-xs">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pertumbuhan User</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockUserGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} name="User" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Volume Transaksi</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockTransactionVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="accommodation" fill="#2563eb" name="Akomodasi" stackId="a" />
                <Bar dataKey="sme" fill="#16a34a" name="UMKM" stackId="a" />
                <Bar dataKey="experience" fill="#eab308" name="Pengalaman" stackId="a" />
                <Bar dataKey="facility" fill="#7c3aed" name="Fasilitas" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue per Tipe</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockRevenueByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {mockRevenueByType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Performa Desa</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockVillagePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={12} width={120} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="#16a34a" name="Pendapatan" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
