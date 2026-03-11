"use client";

import { Button } from "@/elements/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/elements/dialog";
import { Description, Field, FieldGroup, Fieldset, Label } from "@/elements/fieldset";
import { Input } from "@/elements/input";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Spinner from "@/elements/spinner";
import { Textarea } from "@/elements/textarea";

export function CreateJobModal({ isSubmitting, open, setOpen, jobFormData, setJobFormData, handleCreateJob }) {
  function handleChange(e) {
    setJobFormData((prevFormData) => ({ ...prevFormData, [e.target.name]: e.target.value }));
  }

  return (
    <Dialog open={open} onClose={setOpen}>
      <form onSubmit={handleCreateJob}>
        <DialogTitle>Add Job</DialogTitle>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Job URL</Label>
                <Input
                  type="url"
                  name="url"
                  placeholder="https://..."
                  value={jobFormData?.url || ""}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <Label>Job Description</Label>
                <Description>
                  Paste the entire contents of the job description page here. Job Goblin will extract the relevant
                  details for you.
                </Description>
                <Textarea
                  required
                  name="body"
                  value={jobFormData?.body}
                  onChange={handleChange}
                  placeholder="Job description..."
                  rows={10}
                />
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button color="indigo" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Creating...
              </>
            ) : (
              <>
                <PlusIcon /> Create
              </>
            )}
          </Button>
          <Button color="light" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function DeleteJobModal({ isSubmitting, open, setOpen, jobFormData, handleDeleteJob }) {
  return (
    <Dialog open={open} onClose={setOpen}>
      <form onSubmit={handleDeleteJob}>
        <DialogTitle>Delete "{jobFormData.title}"</DialogTitle>
        <DialogDescription>Are you sure you want to delete this job? This action cannot be undone.</DialogDescription>
        <DialogActions>
          <Button color="red" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              <>
                <TrashIcon /> Delete
              </>
            )}
          </Button>
          <Button color="light" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
