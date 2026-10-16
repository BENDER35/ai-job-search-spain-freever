"""The platform report must run on a bare interpreter and always exit 0.

tools/check_platform.py is the first thing a new user is told to run, so it has
to work before anything is installed: standard library only, no network, and no
crash when Bun, Node or LaTeX are absent. The report is advisory, never a gate,
so its exit code is 0 whatever it finds.
"""

import os
import platform
import subprocess
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SCRIPT = REPO / "tools" / "check_platform.py"


def run_report(**env):
    """Run the report in a child process, returning (returncode, stdout, stderr) as text."""
    proc = subprocess.run(
        [sys.executable, str(SCRIPT)],
        capture_output=True,
        env={**os.environ, **env},
    )
    return (
        proc.returncode,
        proc.stdout.decode("utf-8", "replace"),
        proc.stderr.decode("utf-8", "replace"),
    )


class CheckPlatformReport(unittest.TestCase):
    def test_exits_zero_and_names_the_current_platform(self):
        code, out, err = run_report()
        self.assertEqual(code, 0, err)
        self.assertIn(platform.system(), out)
        self.assertIn(platform.machine(), out)

    def test_reports_the_running_python_version(self):
        _, out, _ = run_report()
        self.assertIn(platform.python_version(), out)

    def test_prints_utf8_even_on_a_legacy_stdout(self):
        # Mirrors tests/test_tools_utf8_output.py: a Western Windows host pipes
        # cp1252, and the report must not die with UnicodeEncodeError.
        code, out, err = run_report(PYTHONIOENCODING="cp1252", PYTHONUTF8="0")
        self.assertEqual(code, 0, err)
        self.assertNotIn("UnicodeEncodeError", err)
        self.assertTrue(out)


if __name__ == "__main__":
    unittest.main()
