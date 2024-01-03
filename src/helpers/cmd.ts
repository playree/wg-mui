import { ExecException, exec } from 'child_process'

export const runCmd = async (cmd: string) => {
  return new Promise<{
    error: ExecException | null
    stdout: string
    stderr: string
  }>((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({
        error,
        stdout,
        stderr,
      })
    })
  })
}
