# Project Context: OurLibrary

## Product

A web and mobile system for lending and renting books within a local
community. Our plan is to start in Cal Poly SLO and move up!

## Constraints

- Do not include real customer addresses, names, or package IDs
  in GenAI prompts.
- Status changes must preserve an audit history.
- Keep it local and assume handoffs will be arranged in person via dropoffs. We should not be storing or processing actual addresses for the moment.

## Open questions

- How will lenders be able to report unresponsive or damaging borrowers? Likewise, will borrowers be able to do the same for rude lenders?
- Will we provide in-app messaging for users to use?

## Task prompt pattern

Using only the evidence and confirmed decisions above:

1. Draft one user story for a named user.
2. Draft Given / When / Then acceptance criteria.
3. List assumptions separately.
4. List questions that require a manager or stakeholder decision.
5. Do not invent policy, timing, or privacy requirements.
