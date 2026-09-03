import type { Validator } from "./types";

/**
 * Validators that name the actual problem rather than saying "required".
 * A person who mistyped their email should be told what is wrong with the
 * string they typed, not that a field is empty.
 */

export function required(message: string): Validator {
  return (value) => (value.trim() ? null : message);
}

export function minLength(chars: number, emptyMessage: string, shortMessage: string): Validator {
  return (value) => {
    const v = value.trim();
    if (!v) return emptyMessage;
    if (v.length < chars) return shortMessage;
    return null;
  };
}

export function choiceRequired(message: string): Validator {
  return (value) => (value ? null : message);
}

export const email: Validator = (value) => {
  const v = value.trim();
  if (!v) return "Enter the email address we should reply to.";
  if (/\s/.test(v)) return "Email addresses cannot contain spaces.";
  const parts = v.split("@");
  if (parts.length === 1) return "An email address needs an @, for example priya@college.edu.";
  if (parts.length > 2) return "That address has more than one @ in it.";
  const [local, domain] = parts;
  if (!local) return "Add the part that goes before the @.";
  if (!domain) return "Add the domain that goes after the @.";
  if (!domain.includes(".")) return "The domain looks incomplete, it needs an ending like .edu or .com.";
  if (domain.startsWith(".") || domain.endsWith(".")) return "The domain has a stray dot at the start or end.";
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) return "That does not look like a valid email address.";
  return null;
};

export const websiteUrl: Validator = (value) => {
  const v = value.trim();
  if (!v) return "Add the site you want reviewed.";
  if (/\s/.test(v)) return "A web address cannot contain spaces, check for a stray space.";
  const bare = v.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  if (!bare) return "Add a domain after https://, for example msmunify.com.";
  if (bare.startsWith("/")) return "That looks like a path rather than a full site address.";
  const host = bare.split("/")[0];
  if (!host.includes(".")) return "That is missing a domain ending, like .com or .edu.";
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host)) return "That does not look like a valid web address.";
  return null;
};

export const fullName: Validator = (value) => {
  const v = value.trim();
  if (!v) return "Tell us who we are replying to.";
  if (v.length < 2) return "That looks too short to be a name.";
  if (/^\d+$/.test(v)) return "Names cannot be only numbers.";
  return null;
};

export const optionalUrl: Validator = (value) => {
  if (!value.trim()) return null;
  return websiteUrl(value, {});
};
