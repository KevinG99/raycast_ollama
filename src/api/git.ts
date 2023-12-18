import { exec } from "child_process";
import { promisify } from "util";
import { access, stat } from "fs";
import path from "path";
import { ErrorConventionalCommitNoDifferences } from "./errors";

const execAsync = promisify(exec);

/**
 * Retrieves the git differences for a specified repository.
 * @param repoPath The file path to the git repository.
 * @returns A promise that resolves to an array of strings, each representing a line of git diff output.
 */
export async function getGitDiff(repoPath: string): Promise<string[]> {
  return execAsync("git diff", { cwd: repoPath }).then((result) => {
    if (result.stdout === "") {
      throw ErrorConventionalCommitNoDifferences;
    }
    return result.stdout.trim().split("\n");
  });
}

/**
 * Checks if a specified repository exists.
 * @param repoPath The file path to the git repository.
 * @returns A promise that resolves to a boolean indicating if the repository exists.
 */
export async function checkIfRepositoryExists(repoPath: string): Promise<boolean> {
  access(repoPath, (err) => {
    return false;
  });
  const gitDir = path.join(repoPath, ".git");
  stat(gitDir, (err) => {
    return false;
  });
  return true;
}
