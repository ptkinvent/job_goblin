"use client";

import { useState, useEffect } from "react";
import MultiColumnLayout, { MainColumn, AsideColumn } from "@/layouts/MultiColumnLayout";
import { Heading } from "@/elements/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/elements/table";
import Link from "next/link";
import { Button } from "@/elements/button";
import { CreateJobModal, DeleteJobModal } from "../components/JobModals";
import { Text } from "@/elements/text";
import { LoadingSpinner } from "@/elements/spinner";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "@/elements/dropdown";
import { Input } from "@/elements/input";
import FetchFailedAlert from "@/components/FetchFailedAlert";
import { ArrowTopRightOnSquareIcon, EllipsisVerticalIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

function JobTable({ jobs, setJobFormData, setDeleteJobModalOpen }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Jobs</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.sqid}>
            <TableCell>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Link
                    className="font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
                    href={`/jobs/${job.sqid}`}
                  >
                    {job.company} &middot; {job.title}
                  </Link>
                  <Link
                    href={job.url || ""}
                    className="font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
                    target="_blank"
                  >
                    <ArrowTopRightOnSquareIcon className="size-5" />
                  </Link>
                </div>
                <p className="text-secondary-500 text-xs">{job.location}</p>
              </div>
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon />
                </DropdownButton>
                <DropdownMenu anchor="bottom end">
                  <DropdownItem
                    onClick={() => {
                      setJobFormData(job);
                      setDeleteJobModalOpen(true);
                    }}
                  >
                    <TrashIcon className="stroke-danger-500" /> Delete job
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function JobFilters({ query, setQuery }) {
  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <Heading className="mb-2">Filter</Heading>

      <Input value={query} onChange={handleChange} placeholder="Search..." />
    </>
  );
}

export default function DashboardPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobFormData, setJobFormData] = useState({});
  const [query, setQuery] = useState("");

  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [deleteJobModalOpen, setDeleteJobModalOpen] = useState(false);

  async function fetchJobs() {
    setIsFetching(true);

    try {
      const jobsResult = await fetch("/api/jobs").then((response) => response.json());

      if (Array.isArray(jobsResult)) {
        setJobs(jobsResult);
        return;
      }

      setFetchFailed(true);
    } catch {
      setFetchFailed(true);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function handleCreateJob(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: jobFormData.url, body: jobFormData.body }),
      });
      const newJob = await response.json();

      if (!response.ok) {
        setFetchFailed(true);
        return;
      }

      window.location.href = `/jobs/${newJob.sqid}`;
    } catch {
      setFetchFailed(true);
    } finally {
      setIsSubmitting(false);
      setCreateJobModalOpen(false);
    }
  }

  async function handleDeleteJob(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobs/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sqid: jobFormData.sqid }),
      });

      await response.json();

      if (!response.ok) {
        setFetchFailed(true);
        return;
      }

      await fetchJobs();
    } catch {
      setFetchFailed(true);
    } finally {
      setIsSubmitting(false);
      setDeleteJobModalOpen(false);
      setJobFormData({});
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job?.company.toLowerCase().includes(query.toLowerCase()) ||
      job?.title.toLowerCase().includes(query.toLowerCase()) ||
      job?.location.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <MultiColumnLayout currentTab="dashboard">
        <MainColumn>
          <div className="flex justify-between">
            <Heading>Dashboard</Heading>
            <Button color="indigo" onClick={() => setCreateJobModalOpen(true)}>
              <PlusIcon /> Add job
            </Button>
          </div>

          {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} className="my-2" />}

          {isFetching ? (
            <LoadingSpinner />
          ) : jobs.length > 0 ? (
            <JobTable
              jobs={filteredJobs}
              setJobFormData={setJobFormData}
              setDeleteJobModalOpen={setDeleteJobModalOpen}
            />
          ) : (
            <Text>No jobs yet.</Text>
          )}
        </MainColumn>
        <AsideColumn>
          <JobFilters query={query} setQuery={setQuery} />
        </AsideColumn>
      </MultiColumnLayout>

      <CreateJobModal
        isSubmitting={isSubmitting}
        open={createJobModalOpen}
        setOpen={setCreateJobModalOpen}
        jobFormData={jobFormData}
        setJobFormData={setJobFormData}
        handleCreateJob={handleCreateJob}
      />

      <DeleteJobModal
        isSubmitting={isSubmitting}
        open={deleteJobModalOpen}
        setOpen={setDeleteJobModalOpen}
        jobFormData={jobFormData}
        handleDeleteJob={handleDeleteJob}
      />
    </>
  );
}
