#!/usr/bin/env python3
"""Interactively log in and create a book through the backend API."""

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
        raise BackendError(f"Could not connect to {base_url}: {error.reason}") from error

    if not body:
        return None
    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return body


def prompt_required(label: str, *, secret: bool = False) -> str:
    prompt = getpass.getpass if secret else input
    while True:
        value = prompt(f"{label}: ").strip()
        if value:
            return value
        print(f"{label} is required.")


def prompt_optional(label: str) -> str | None:
    return input(f"{label} (optional): ").strip() or None


def login(base_url: str, email: str, password: str) -> dict[str, Any]:
    session = post_json(
        base_url,
        "/auth/login",
        {"email": email, "password": password},
    )
    if not isinstance(session, dict) or not session.get("access_token"):
        raise BackendError("Login response did not contain an access token.")
    return session


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Log in and create a book through the backend API."
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

    print("\nEnter the book details.")
    book: dict[str, Any] = {"book_id": prompt_required("Book ID")}
    optional_fields = {
        "title": prompt_optional("Title"),
        "author": prompt_optional("Author"),
        "genre": prompt_optional("Genre"),
        "description": prompt_optional("Description"),
    }
    book.update(
        {key: value for key, value in optional_fields.items() if value is not None}
    )

    try:
        print("\nLogging in...")
        session = login(args.base_url, email, password)
        print("Login succeeded. Creating book...")
        created_book = post_json(
            args.base_url,
            "/books",
            book,
            access_token=session["access_token"],
        )
        print("Book created:")
        print(json.dumps(created_book, indent=2))
    except BackendError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
