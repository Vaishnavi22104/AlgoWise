# Security Policy

## Supported versions

AlgoWise is in early development. Only the latest code on the `main` branch receives security fixes.

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through GitHub instead:

1. Go to the **Security** tab of this repository.
2. Choose **Report a vulnerability**.
3. Describe the problem and how to reproduce it.

You can expect a first reply within 7 days. If the report is confirmed, we will work on a fix and credit you in the release notes unless you prefer to stay anonymous.

## Scope

AlgoWise version 1 does not run user-written code. Every visualization trace comes from a reviewed executor function in this repository. Progress is stored only in your own browser (`localStorage`); there are no accounts and no server-side user data.

Examples of issues worth reporting: cross-site scripting, unsafe handling of stored data, vulnerable dependencies, or anything that could expose a visitor's data.
