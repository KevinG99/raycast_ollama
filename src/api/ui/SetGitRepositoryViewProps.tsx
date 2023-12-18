import React, { useState } from "react";
import { Form, ActionPanel, Action, LocalStorage, showToast, Toast } from "@raycast/api";
import { checkIfRepositoryExists } from "../git";
import { ErrorInvalidGitRepository } from "../errors";

interface SetGitRepositoryViewProps {
  ShowRepositoryView: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Return JSX element for setting the repository path.
 * @param {SetGitRepositoryViewProps} props
 * @returns {JSX.Element} Raycast SetRepositoryView.
 */
export function SetRepositoryView(props: SetGitRepositoryViewProps): JSX.Element {
  const [repositoryPath, setRepositoryPath] = useState<string>("");

  /**
   * Save chosen repository path to LocalStorage.
   */
  async function handleSaveRepositoryPath() {
    if (!repositoryPath) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Repository path is required",
        message: "Please enter a valid repository path.",
      });
      return;
    } else if (!(await checkIfRepositoryExists(repositoryPath))) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Repository path does not exist",
        message: "Please enter a valid repository path.",
      });
      return;
    }

    await LocalStorage.setItem(`gitRepositoryPath`, repositoryPath);
    props.ShowRepositoryView(false);
    await showToast({
      style: Toast.Style.Success,
      title: "Repository path saved",
    });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Repository Path" onSubmit={handleSaveRepositoryPath} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="repositoryPath"
        title="Repository Path"
        placeholder="Enter the path to your Git repository"
        value={repositoryPath}
        onChange={setRepositoryPath}
      />
    </Form>
  );
}

/**
 * Checks for a git repository path stored in local storage and verifies its existence.
 * If the path exists and is valid, it returns the path.
 * Otherwise, it shows a toast notification indicating the path is invalid and throws an error.
 * @returns A promise that resolves to the repository path if it exists and is valid.
 */
export const checkAndShowRepositoryPath = async () => {
  const repoPath = await LocalStorage.getItem<string>(`gitRepositoryPath`);
  if (repoPath && (await checkIfRepositoryExists(repoPath))) {
    return repoPath;
  } else {
    await showToast({
      style: Toast.Style.Failure,
      title: "Repository path does not exist",
      message: "Please enter a valid repository path.",
    });
    throw ErrorInvalidGitRepository;
  }
};
