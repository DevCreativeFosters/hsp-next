const BREVO_SIGNUP_URL = process.env.NEXT_PUBLIC_BREVO_SIGNUP_URL;

export async function sendBrevoNewsletterData(payload) {
  if (!BREVO_SIGNUP_URL) {
    throw new Error('BREVO_SIGNUP_URL is not defined');
  }
  const endpoint = BREVO_SIGNUP_URL + '?isAjax=1';
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await fetch(endpoint, {
      body: formData,
      method: 'POST',
    });
    return res.json();
  } catch (err) {
    return {
      errors: err?.response?.data?.errors,
    };
  }
}
