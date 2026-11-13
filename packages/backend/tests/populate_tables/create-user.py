#!/usr/bin/env python3
"""Interactively sign up, log in, and create a user profile."""

import argparse
import getpass
import json
import os
import sys
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DEFAULT_BACKEND_URL = "http://localhost:8000"


class BackendError(Exception):
    """Raised when the backend cannot complete a request."""


def post_json(
    base_url: str,
    endpoint: str,
    payload: dict[str, Any],
    access_token: str | None = None,
) -> Any:
    """POST JSON to the backend and return its decoded response."""
    headers = {"Content-Type": "application/json"}
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"

    request = Request(
        f"{base_url.rstrip('/')}{endpoint}",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urlopen(request, timeout=10) as response:
            body = response.read().decode("utf-8")
    except HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise BackendError(
            f"POST {endpoint} failed ({error.code}): {body or error.reason}"
        ) from error
    except URLError as error:
        raise BackendError(
            f"Could not connect to {base_url}: {error.reason}"
        ) from error

    if not body:
        return None

    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return body


def prompt_required(label: str, *, secret: bool = False) -> str:
    """Prompt until the user enters a non-empty value."""
    prompt = getpass.getpass if secret else input
    while True:
        value = prompt(f"{label}: ").strip()
        if value:
            return value
        print(f"{label} is required.")


def prompt_optional(label: str) -> str | None:
    """Return an optional console value, or None when it is blank."""
    return input(f"{label} (optional): ").strip() or None


def prompt_yes_no(label: str) -> bool | None:
    """Prompt for an optional yes/no answer."""
    while True:
        value = input(f"{label} [y/n, blank to skip]: ").strip().lower()
        if not value:
            return None
        if value in {"y", "yes"}:
            return True
        if value in {"n", "no"}:
            return False
        print("Please enter y, n, or leave the answer blank.")


def collect_profile(email: str) -> dict[str, Any]:
    """Collect fields accepted by POST /users."""
    print("\nEnter the user profile details.")
    username = prompt_required("Username")
    calpoly_email = input(f"Cal Poly email [{email}]: ").strip() or email

    profile: dict[str, Any] = {
        "username": username,
        "calpoly_email": calpoly_email,
    }

    optional_fields = {
        "name": prompt_optional("Name"),
        "bio": prompt_optional("Bio"),
        "pfp_url": prompt_optional("Profile picture URL"),
        "on_campus": prompt_yes_no("Do you live on campus?"),
    }
    profile.update(
        {key: value for key, value in optional_fields.items() if value is not None}
    )
    return profile


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sign up, log in, and create a user through the backend API."
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("BACKEND_URL", DEFAULT_BACKEND_URL),
        help="backend URL (default: %(default)s; can also use BACKEND_URL)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    print(f"Backend: {args.base_url}")
    email = prompt_required("Email")
    password = prompt_required("Password", secret=True)
    profile = collect_profile(email)

    try:
        print("\nSigning up...")
        signed_up_user = post_json(
            args.base_url,
            "/auth/signup",
            {"email": email, "password": password},
        )
        if isinstance(signed_up_user, dict):
            print(f"Signed up user {signed_up_user.get('id', email)}.")
        else:
            print("Sign-up succeeded.")

        input("Please authenticate your email before continuing...")

        print("Logging in...")
        session = post_json(
            args.base_url,
            "/auth/login",
            {"email": email, "password": password},
        )
        if not isinstance(session, dict) or not session.get("access_token"):
            raise BackendError("Login response did not contain an access token.")
        print("Login succeeded.")

        print("Creating user profile...")
        created_user = post_json(
            args.base_url,
            "/users",
            profile,
            access_token=session["access_token"],
        )
        print("User profile created:")
        print(json.dumps(created_user, indent=2))
    except BackendError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
