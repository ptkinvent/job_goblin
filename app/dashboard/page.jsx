"use client";

import MultiColumnLayout, { MainColumn, AsideColumn } from "@/layouts/MultiColumnLayout";
import { Heading } from "@/elements/heading";

export default function DashboardPage() {
  return (
    <MultiColumnLayout currentTab="dashboard">
      <MainColumn asideWidth="xl:pr-[8rem]">
        <Heading>Dashboard</Heading>
      </MainColumn>
      <AsideColumn>
        <Heading>Aside</Heading>
      </AsideColumn>
    </MultiColumnLayout>
  );
}
