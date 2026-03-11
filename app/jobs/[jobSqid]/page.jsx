"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/elements/heading";
import MultiColumnLayout, { AsideColumn, MainColumn } from "@/layouts/MultiColumnLayout";
import { useParams } from "next/navigation";
import { Text } from "@/elements/text";
import Link from "next/link";
import Markdown from "react-markdown";
import FetchFailedAlert from "@/components/FetchFailedAlert";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function JobPage() {
  const { jobSqid } = useParams();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [job, setJob] = useState({});

  useEffect(() => {
    setIsFetching(true);
    async function fetchData() {
      const [jobResult] = await Promise.all([fetch(`/api/jobs/${jobSqid}`).then((r) => r.json())])
        .catch(() => setFetchFailed(true))
        .finally(() => {
          setFetchFailed(false);
          setIsFetching(false);
        });
      if (!jobResult.error) setJob(jobResult);
    }
    fetchData();
  }, [jobSqid]);

  return (
    <>
      <MultiColumnLayout currentTab="dashboard">
        <MainColumn>
          <Heading className="flex gap-2 items-center">
            {job.company} &middot; {job.title}
            <Link
              href={job.url || ""}
              className="font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
              target="_blank"
            >
              <ArrowTopRightOnSquareIcon className="size-5" />
            </Link>
          </Heading>
          <Text>{job.location}</Text>

          {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} className="my-2" />}

          <div className="prose proze-zinc dark:prose-invert max-w-none">
            <h4>Responsibilities</h4>
            <Markdown>{job.responsibilities}</Markdown>

            <h4>Minimum Qualifications</h4>
            <Markdown>{job.minimum_qualifications}</Markdown>

            <h4>Preferred Qualifications</h4>
            <Markdown>{job.preferred_qualifications}</Markdown>
          </div>
        </MainColumn>
        <AsideColumn>
          <Heading>Aside</Heading>
        </AsideColumn>
      </MultiColumnLayout>
    </>
  );
}
