"use client";

import { useEffect, useState } from "react";
import { Heading, Subheading } from "@/elements/heading";
import { Button } from "@/elements/button";
import { Input } from "@/elements/input";
import { Text } from "@/elements/text";
import Spinner, { LoadingSpinner } from "@/elements/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/elements/table";
import FetchFailedAlert from "@/components/FetchFailedAlert";
import MultiColumnLayout, { AsideColumn, MainColumn } from "@/layouts/MultiColumnLayout";
import Markdown from "react-markdown";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

function ResumeTable({ resumes, selectedResume, setSelectedResume }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Resumes</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {resumes.map((resume) => {
          const fileName = resume.fileName || resume.filename || `Resume ${resume.id}`;
          const format = fileName.split(".").at(-1)?.toUpperCase() || "FILE";
          const isSelected = selectedResume?.id === resume.id;

          return (
            <TableRow key={resume.id || fileName} className={isSelected ? "bg-secondary-950/3 dark:bg-white/5" : ""}>
              <TableCell>
                <button
                  type="button"
                  className="flex w-full flex-col text-left cursor-pointer"
                  onClick={() => setSelectedResume(resume)}
                >
                  <span className="font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300">
                    {fileName}
                  </span>

                  <p className="text-secondary-500 text-xs">
                    {new Date(resume.created_at).toLocaleDateString([], {
                      dateStyle: "short",
                    })}{" "}
                    {new Date(resume.created_at).toLocaleTimeString([], {
                      timeStyle: "short",
                    })}
                  </p>
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function ResumesPage() {
  const [file, setFile] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  async function fetchResumes() {
    setIsFetching(true);

    try {
      const response = await fetch("/api/resumes");
      const result = await response.json();

      if (!response.ok || !Array.isArray(result)) {
        setFetchFailed(true);
        return;
      }

      setResumes(result);
      setSelectedResume((current) => current || result[0] || null);
      setFetchFailed(false);
    } catch {
      setFetchFailed(true);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Choose a PDF or DOCX file first.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setFetchFailed(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/resumes/create", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to upload resume.");
        return;
      }

      setSuccessMessage("Resume uploaded, formatted, and saved.");
      setFile(null);
      await fetchResumes();
      setSelectedResume(result);
      const input = document.getElementById("resume-upload");
      if (input instanceof HTMLInputElement) {
        input.value = "";
      }
    } catch {
      setErrorMessage("Failed to upload resume.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MultiColumnLayout currentTab="resumes">
      <MainColumn>
        <div className="sticky top-6">
          <Heading>
            {selectedResume ? selectedResume.fileName || selectedResume.filename || "Preview" : "Preview"}
          </Heading>

          {selectedResume?.body ? (
            <div className="border border-secondary-950/10 bg-white dark:border-white/10 dark:bg-white/5 shadow-lg rounded-lg p-8 mt-4">
              <div className="prose max-w-none dark:prose-invert">
                <Markdown>{selectedResume?.body || "Empty document."}</Markdown>
              </div>
            </div>
          ) : (
            <Text>No resume selected.</Text>
          )}
        </div>
      </MainColumn>
      <AsideColumn>
        <div className="flex flex-col gap-6">
          <div>
            <Heading>Resumes</Heading>
            <Text>Upload your resume as a .pdf or .docx file.</Text>
          </div>

          <form
            onSubmit={handleUpload}
            className="rounded-2xl border border-secondary-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-4">
              <div>
                <Subheading>Upload Resume</Subheading>
                <Text className="mt-1">Accepted formats: PDF and DOCX up to 10MB.</Text>
              </div>

              <Input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {errorMessage ? <Text className="text-red-600 dark:text-red-400">{errorMessage}</Text> : null}
              {successMessage ? <Text className="text-green-600 dark:text-green-400">{successMessage}</Text> : null}

              <div className="flex items-center gap-3">
                <Button color="indigo" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon />
                      Upload resume
                    </>
                  )}
                </Button>
                <Text>{file ? file.name : "No file selected."}</Text>
              </div>
            </div>
          </form>

          {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

          {isFetching ? (
            <LoadingSpinner />
          ) : resumes.length > 0 ? (
            <ResumeTable resumes={resumes} selectedResume={selectedResume} setSelectedResume={setSelectedResume} />
          ) : (
            <Text>No resumes yet.</Text>
          )}
        </div>
      </AsideColumn>
    </MultiColumnLayout>
  );
}
