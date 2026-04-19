import { GOOGLE_FORMS } from "@/constants";

export async function submitContactForm(data: {
  name: string;
  phone: string;
  message: string;
}) {
  const body = new URLSearchParams({
    [GOOGLE_FORMS.CONTACT.fields.name]: data.name,
    [GOOGLE_FORMS.CONTACT.fields.phone]: data.phone,
    [GOOGLE_FORMS.CONTACT.fields.message]: data.message,
  });
  await fetch(GOOGLE_FORMS.CONTACT.url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}
