"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
export default function DashboardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Some overview content goes here...</p>
      </CardContent>
    </Card>
  );
}